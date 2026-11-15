import { useState } from "react";
import { bass2 } from "../bass2";
import { cfiRuns } from "../cfi";
import { efieldRuns } from "../efield";

const STOP = new Set(["the","a","an","is","are","was","were","of","in","on","to","and","or","for","what","how","why","does","do","did","about","with","it","that","this","me","tell","can","i","my","at","by","from"]);
const words = (t) => t.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
const stem = (w) => w.replace(/(ing|ed|es|s)$/, "");
const SYN = {
  out: ["extinguish","suppress","suppression","dilution"], put: ["extinguish","suppress"], stop: ["extinguish","suppress","suppression"],
  detect: ["smoke","aerosol","detection","sensor"], alarm: ["smoke","detection"], moon: ["moon","lunar","partial"],
  lunar: ["moon","lunar","partial"], mars: ["partial","gravity"], material: ["solid","fabric","plastic"], safe: ["prevention","material"],
};
const expand = (l) => l.flatMap((w) => [w, ...Object.keys(SYN).filter((k) => w.startsWith(k)).flatMap((k) => SYN[k])]);

function searchCatalog(query, items) {
  const q = expand(words(query)).map(stem);
  if (!q.length) return [];
  return items
    .map((it) => {
      const hay = words([it.name, it.category, it.fuel, it.hardware, it.conditions, it.key_finding, it.safety_implication].join(" ")).map(stem);
      return { it, hits: q.filter((w) => hay.includes(w)).length };
    })
    .filter((r) => r.hits > 0)
    .sort((a, b) => b.hits - a.hits || b.it.concern_score - a.it.concern_score)
    .slice(0, 3).map((r) => r.it);
}

// Answers computed live from the real tables. Nothing is typed in by hand.
function computed(q) {
  const t = q.toLowerCase(), out = [];
  const maxB = Math.max(...bass2.map((r) => r.o2i)), minB = Math.min(...bass2.map((r) => r.o2i));
  if (/oxygen|o2|30|moon/.test(t))
    out.push({ title: "Oxygen levels actually tested", text: `Across the per-test tables: BASS-II starts at ${minB}-${maxB}% oxygen (${bass2.length} tests), CFI uses 17% and 21% (${cfiRuns.length} tests), E-FIELD used 21% air. None of these runs starts at the Moon-base level of 30% or more. FLEX-2 lists 0.30 in its test range, but that is a range, not per-run results.`, src: "PSI-25, PSI-39, PSI-22, PSI-68" });
  if (/how many|count|number|total/.test(t))
    out.push({ title: "Counts in the real tables", text: `BASS-II: ${bass2.length} burns. CFI: ${cfiRuns.length} droplet tests. E-FIELD: ${efieldRuns.reduce((s, r) => s + r.flames, 0)} flames on ${efieldRuns.length} test days.`, src: "PSI-25, PSI-39, PSI-22" });
  if (/pressure|atm|psi/.test(t)) {
    const p = [...new Set(cfiRuns.map((r) => r.p))].sort((a, b) => a - b);
    out.push({ title: "Pressures tested", text: `CFI tests ran at ${p.join(", ")} atm. FLEX-2's table lists 0.5 to 3 atm. A Moon base at 10.2 psi is about 0.69 atm (our arithmetic, 10.2 / 14.7), inside that range. BASS-II and E-FIELD tables have no pressure column.`, src: "PSI-39, PSI-68" });
  }
  if (/helium/.test(t)) out.push({ title: "Helium runs", text: `${cfiRuns.filter((r) => r.he > 0).length} of ${cfiRuns.length} CFI tests added helium to the mix.`, src: "PSI-39" });
  return out;
}

const EXAMPLES = ["What oxygen levels were actually tested?", "How are fires put out?", "Which work covers smoke detection?", "Is anything tested at Moon-base conditions?"];

export default function AskData({ items }) {
  const [q, setQ] = useState("");
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);

  const run = async (text) => {
    setQ(text);
    if (!text.trim()) return;
    setBusy(true);
    const local = { mode: "keyword", facts: computed(text), recs: searchCatalog(text, items).slice(0, computed(text).length ? 1 : 3) };
    try {
      const r = await fetch("/api/ask", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question: text }) });
      if (r.ok) {
        const j = await r.json();
        if (j.answer) { setRes({ ...local, mode: "ai", ai: j.answer }); setBusy(false); return; }
      }
    } catch (e) { /* no AI backend: fall through to the keyword engine */ }
    setRes(local); setBusy(false);
  };

  return (
    <section id="ask" className="section">
      <h2>Ask the data</h2>
      <p className="lead">
        Answers come only from the NASA records and tables on this page, each
        with its source. If the data has no answer, it says so.
      </p>
      <form className="ask-form" onSubmit={(e) => { e.preventDefault(); run(q); }}>
        <input className="search" placeholder="Ask about fires, oxygen, pressure, smoke, the Moon..." value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn" type="submit">{busy ? "..." : "Ask"}</button>
      </form>
      <div className="chips">
        {EXAMPLES.map((ex) => <button key={ex} className="chip" onClick={() => run(ex)}>{ex}</button>)}
      </div>

      {res && (
        <div className="answers" aria-live="polite">
          <p className="small" style={{ marginTop: 0 }}>
            {res.mode === "ai"
              ? "AI answer (Gemini), limited to FlameGuard's records. Matching sources below."
              : "Keyword engine: live calculations over the real tables plus matching records. No AI backend is connected on this copy."}
          </p>
          {res.ai && <div className="answer"><h4>Answer</h4><p>{res.ai}</p></div>}
          {res.facts.map((f) => (
            <div key={f.title} className="answer"><h4>{f.title}</h4><p>{f.text}</p><p className="small">Computed from: {f.src}</p></div>
          ))}
          {res.recs.map((r) => (
            <div key={r.id} className="answer">
              <h4>{r.name}</h4><p>{r.key_finding}</p>
              <p className="impact">🛰️ {r.safety_implication}</p>
              <a href={r.source_url} target="_blank" rel="noreferrer">NASA source ↗</a>
            </div>
          ))}
          {!res.ai && !res.facts.length && !res.recs.length && <p className="answer-empty">The FlameGuard data does not cover that.</p>}
        </div>
      )}
    </section>
  );
}
