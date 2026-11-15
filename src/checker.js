// PSI Table Checker: pure functions, no network. Every rule is listed in RULES so it can be challenged.
export function parseCSV(text) {
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += c;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim() !== ""));
}

export const FIELDS = [
  { key: "oxygen", label: "Oxygen concentration", pts: 25, re: /oxygen|(^|[^a-z])o2(?![a-z])/i, why: "Sets how easily a flame burns" },
  { key: "pressure", label: "Pressure", pts: 20, re: /pressure|\batm\b|\bpsi\b|kpa/i, why: "Moon base is 10.2 psi, not 14.7" },
  { key: "flow", label: "Airflow speed", pts: 15, re: /flow(?!\s*restrictor)|\bfan\b|air\s*(speed|display)|velocity|cm\/s/i, why: "Ventilation changes spread and detection" },
  { key: "outcome", label: "Outcome (burned / spread / out)", pts: 20, re: /outcome|result|extinguish|ignit|spread|blow|status/i, why: "A model needs a label to learn from" },
  { key: "fuel", label: "Fuel or material", pts: 10, re: /fuel|material|sample/i, why: "Which material burned" },
  { key: "gravity", label: "Gravity level", pts: 10, re: /gravity|(^|[^a-z])g[-_ ]?level|\bg\b/i, why: "Needed to compare ISS, Moon and Mars" },
];

export const RULES = [
  "Column found by name only (for example oxygen, O2, pressure, atm). A column we cannot recognize counts as missing; say so if we are wrong.",
  "Airflow counts as raw units unless the header says cm/s.",
  "Exact duplicate rows, and repeated test IDs with different data.",
  "Gas fractions (oxygen + nitrogen + helium) that do not sum to 1 (tolerance 0.011).",
  "Oxygen value far outside the rest of its column, or a drop of more than 10 points between initial and final.",
  "Dates whose year differs by 2 or more from the most common year.",
  "Blank or non-numeric cells in numeric columns.",
];

const num = (v) => { const t = String(v ?? "").trim(); if (t === "" || !/^-?\d*\.?\d+$/.test(t)) return null; return Number(t); };
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };

export function check(text) {
  const all = parseCSV(text);
  if (all.length < 2) return { error: "Could not read a table. Is this a CSV with a header row?" };
  const head = all[0].map((h) => h.replace(/\s+/g, " ").trim());
  const body = all.slice(1).map((r, i) => ({ line: i + 2, cells: head.map((_, k) => r[k] ?? "") }));
  const numericCols = head.filter((_, i) => body.filter((r) => num(r.cells[i]) !== null).length / body.length >= 0.5).length;
  if (numericCols < 2) return { error: "This does not look like a PSI experimental table: fewer than two mostly-numeric columns." };
  const col = (re, skip = []) => head.findIndex((h, i) => !skip.includes(i) && re.test(h));
  const idCol = col(/test\s*#?|flex number|^id$|number/i);
  const idOf = (r) => (idCol >= 0 ? r.cells[idCol] : `row ${r.line}`);

  const fields = FIELDS.map((f) => {
    const idxs = head.map((h, i) => (f.re.test(h) ? i : -1)).filter((i) => i >= 0);
    let note = "";
    if (f.key === "flow" && idxs.length) {
      const hasUnit = idxs.some((i) => /cm\/s|m\/s/i.test(head[i]));
      note = hasUnit ? "has a unit in the header" : "no cm/s unit, so likely raw instrument readings";
    }
    return { ...f, cols: idxs.map((i) => head[i]), found: idxs.length > 0, partial: f.key === "flow" && idxs.length > 0 && note.startsWith("no cm/s"), note };
  });
  const score = fields.reduce((s, f) => s + (f.found ? (f.partial ? f.pts / 2 : f.pts) : 0), 0);

  const issues = [];
  const add = (r, type, detail) => issues.push({ line: r.line, id: idOf(r), type, detail });

  // duplicates
  const seen = new Map(), ids = new Map();
  for (const r of body) {
    const k = r.cells.map((c) => c.trim()).join("|");
    if (seen.has(k)) add(r, "Duplicate row", `Same as line ${seen.get(k)}`); else seen.set(k, r.line);
    if (idCol >= 0) {
      const id = r.cells[idCol].trim();
      if (ids.has(id) && seen.get(k) === r.line) add(r, "Repeated test ID", `${id} also on line ${ids.get(id)} with different data`);
      if (!ids.has(id)) ids.set(id, r.line);
    }
  }

  // gas fractions
  const O = col(/oxygen/i), N = col(/nitrogen/i), He = col(/helium/i);
  if (O >= 0 && N >= 0) for (const r of body) {
    const o = num(r.cells[O]), n = num(r.cells[N]), h = He >= 0 ? num(r.cells[He]) ?? 0 : 0;
    if (o !== null && n !== null && o <= 1 && Math.abs(o + n + h - 1) > 0.011) add(r, "Gas fractions do not sum to 1", `O2 ${o} + N2 ${n}${He >= 0 ? ` + He ${h}` : ""} = ${(o + n + h).toFixed(2)}`);
  }

  // oxygen outliers and drops
  const o2cols = head.map((h, i) => (/(^|[^a-z])o2(?![a-z])|oxygen/i.test(h) && !/co2/i.test(h) ? i : -1)).filter((i) => i >= 0);
  const o2init = o2cols.find((i) => /initial/i.test(head[i])), o2fin = o2cols.find((i) => /final/i.test(head[i]));
  for (const i of o2cols) {
    const vals = body.map((r) => num(r.cells[i])).filter((v) => v !== null && v > 1);
    const med = median(vals);
    if (med === null) continue;
    for (const r of body) { const v = num(r.cells[i]); if (v !== null && v > 1 && (v > med + 15 || v < 0)) add(r, "Oxygen outlier", `${head[i]} = ${v} while the column median is ${med}`); }
  }
  if (o2init !== undefined && o2fin !== undefined) for (const r of body) {
    const a = num(r.cells[o2init]), b = num(r.cells[o2fin]);
    if (a !== null && b !== null && a - b > 10) add(r, "Oxygen drop over 10 points", `${a} to ${b}`);
  }

  // dates
  const dcol = col(/date/i);
  if (dcol >= 0) {
    const yr = (s) => { const t = s.trim(); let m = t.match(/(\d{4})\s*$/); if (m) return +m[1]; m = t.match(/-(\d{2})\s*$/); return m ? 2000 + +m[1] : null; };
    const ys = body.map((r) => yr(r.cells[dcol])).filter((y) => y);
    if (ys.length) {
      const cnt = {}; ys.forEach((y) => (cnt[y] = (cnt[y] || 0) + 1));
      const mode = +Object.entries(cnt).sort((a, b) => b[1] - a[1])[0][0];
      for (const r of body) { const y = yr(r.cells[dcol]); if (y && Math.abs(y - mode) >= 2) add(r, "Date year looks off", `${r.cells[dcol].trim()} while most rows are ${mode}`); }
    }
  }

  // blank / non-numeric cells in numeric columns
  const colReport = [];
  head.forEach((h, i) => {
    const vals = body.map((r) => r.cells[i] ?? "");
    const numeric = vals.filter((v) => num(v) !== null).length;
    if (numeric / body.length >= 0.6 && numeric < body.length) {
      const bad = body.filter((r) => num(r.cells[i]) === null);
      colReport.push({ col: h, count: bad.length, examples: [...new Set(bad.map((r) => (r.cells[i] ?? "").trim() || "(blank)"))].slice(0, 4) });
    }
  });

  const byType = {};
  issues.forEach((x) => (byType[x.type] = (byType[x.type] || 0) + 1));
  const rowsFlagged = new Set(issues.map((x) => x.line)).size;
  return { rows: body.length, cols: head.length, head, fields, score, issues, byType, colReport, rowsFlagged, ready: score >= 80 && issues.length === 0 };
}
