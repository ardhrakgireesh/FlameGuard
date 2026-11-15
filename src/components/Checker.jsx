import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { check, RULES } from "../checker";

const SAMPLES = [
  ["PSI-25 BASS-II (solids)", "/samples/PSI-25_BASS-II.csv"],
  ["PSI-39 CFI (droplets)", "/samples/PSI-39_CFI.csv"],
];
const q = (v) => `"${String(v).replace(/"/g, '""')}"`;

export default function Checker() {
  const [res, setRes] = useState(null);
  const [name, setName] = useState("");
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState("");
  const input = useRef(null);

  const run = (text, n) => {
    setErr("");
    let r;
    try { r = check(text); } catch (e) { r = { error: "Could not read that file as a table." }; }
    if (r.error) { setErr(r.error); setRes(null); return; }
    setName(n); setRes(r);
  };
  const readFile = (f) => { if (!f) return; const fr = new FileReader(); fr.onload = () => run(String(fr.result), f.name); fr.readAsText(f); };
  const sample = async ([label, url]) => {
    try { const t = await (await fetch(url)).text(); run(t, label); } catch (e) { setErr("Could not load the sample."); }
  };
  const fixList = () => {
    const rows = ["line,test_id,problem,detail", ...res.issues.map((i) => [i.line, q(i.id), q(i.type), q(i.detail)].join(","))];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
    a.download = `psi-check-${name.replace(/[^a-z0-9]+/gi, "_")}.csv`;
    a.click();
  };

  const grade = res ? (res.score >= 80 ? "good" : res.score >= 50 ? "mid" : "bad") : "";

  return (
    <section id="checker" className="section">
      <h2>PSI Table Checker</h2>
      <p className="lead">
        A tool, not a chart. Drop in any PSI Experimental Table (CSV) and it
        checks, in your browser, whether a model could use it. Nothing is uploaded.
      </p>

      <div
        className={`drop ${drag ? "over" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); readFile(e.dataTransfer.files[0]); }}
        onClick={() => input.current.click()}
        role="button" tabIndex={0} aria-label="Choose a PSI table CSV file to check"
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.current.click(); } }}
      >
        <input ref={input} type="file" accept=".csv,text/csv" hidden onChange={(e) => readFile(e.target.files[0])} />
        <b>Drop a PSI table CSV here</b>
        <span>or click to choose a file</span>
      </div>
      <div className="pills" style={{ marginTop: 16 }}>
        <span className="small" style={{ margin: "8px 6px 0 0" }}>Or try NASA's real files:</span>
        {SAMPLES.map((s) => <button key={s[0]} className="chip" onClick={() => sample(s)}>{s[0]}</button>)}
      </div>
      {err && <p className="answer-empty" role="alert">{err}</p>}

      {res && (
        <motion.div className="panel chk" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ animation: "none" }}>
          <div className="chk-top">
            <div className={`chk-score ${grade}`}><b>{res.score}</b><span>/ 100 model-readiness</span></div>
            <div>
              <h3 style={{ marginBottom: 4 }}>{name}</h3>
              <p className="small" style={{ margin: 0 }}>
                {res.rows} rows, {res.cols} columns. {res.issues.length} problems in {res.rowsFlagged} rows.{" "}
                {res.ready ? "Ready for modeling." : "Not ready for modeling yet."}
              </p>
            </div>
          </div>

          <h3>Which variables does a model need?</h3>
          <table style={{ minWidth: 0 }}>
            <thead><tr><th></th><th>Variable</th><th>Found as</th><th>Why it matters</th></tr></thead>
            <tbody>
              {res.fields.map((f) => (
                <tr key={f.key}>
                  <td className={f.found ? (f.partial ? "t-mid" : "t-ok") : "t-no"}>{f.found ? (f.partial ? "~" : "✔") : "✖"}</td>
                  <td><b>{f.label}</b></td>
                  <td>{f.found ? `${f.cols.slice(0, 2).join("; ")}${f.note ? ` (${f.note})` : ""}` : "No matching column"}</td>
                  <td>{f.why}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ marginTop: 22 }}>Problems found</h3>
          {res.issues.length === 0 ? <p className="small">None of our checks fired.</p> : (
            <>
              <div className="pills" style={{ justifyContent: "flex-start" }}>
                {Object.entries(res.byType).map(([t, n]) => <span key={t} className="chip on">{t}: {n}</span>)}
              </div>
              <div className="table-wrap">
                <table style={{ minWidth: 520 }}>
                  <thead><tr><th>Line</th><th>Test</th><th>Problem</th><th>Detail</th></tr></thead>
                  <tbody>
                    {res.issues.slice(0, 40).map((i, k) => <tr key={k}><td>{i.line}</td><td>{i.id}</td><td>{i.type}</td><td>{i.detail}</td></tr>)}
                  </tbody>
                </table>
              </div>
              {res.issues.length > 40 && <p className="small">Showing 40 of {res.issues.length}. The download has all of them.</p>}
            </>
          )}
          {res.colReport.length > 0 && (
            <p className="small">
              Cells that are not plain numbers in mostly-numeric columns:{" "}
              {res.colReport.sort((a, b) => b.count - a.count).slice(0, 5).map((c) => `${c.col} (${c.count}: ${c.examples.join(", ")})`).join("; ")}.
            </p>
          )}
          <button className="chip on" onClick={fixList}>Download problem list (CSV)</button>
        </motion.div>
      )}

      <details className="rules">
        <summary>How the checks work (every rule, so you can challenge it)</summary>
        <ul>{RULES.map((r) => <li key={r}>{r}</li>)}
          <li>Score: oxygen 25, pressure 20, outcome 20, airflow 15 (half if no unit), fuel 10, gravity 10. Not an official NASA metric.</li>
        </ul>
      </details>
    </section>
  );
}
