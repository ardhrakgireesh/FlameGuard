import { useState } from "react";
import { catalog } from "../catalog";

// Transparent rubric (our own, not NASA's). Every sub-score is stated so it can be challenged.
// Updated with NASA Researcher's Guide: FLEX-2 at 30% O2, BASS at 21% and 17%, SoFIE planned 10-40%.
// O2: 2 = tested at 30%+ oxygen, 1 = 21% oxygen stated, 0 = oxygen not stated in sources checked
// MAT: 2 = directly informs materials, detection or suppression, 1 = background science
// G: 2 = partial gravity (real or emulated), 1 = microgravity only
// DATA: 1 = results already in PSI, 0 = not yet
const R = {
  4: [1, 2, 1, 1], 5: [0, 2, 1, 1], 6: [0, 2, 1, 1], 7: [0, 1, 1, 1], 8: [2, 2, 1, 1],
  9: [2, 1, 1, 1], 10: [1, 1, 2, 1], 16: [0, 1, 1, 1], 17: [1, 1, 1, 1], 11: [0, 1, 1, 1],
  12: [2, 2, 1, 0], 13: [0, 2, 1, 0], 14: [0, 2, 2, 0], 15: [0, 1, 2, 0],
};
const CRIT = [
  ["Oxygen match", 2, "Moon base expects 30%+ oxygen"],
  ["Crew-safety use", 2, "Materials, detection or suppression"],
  ["Gravity match", 2, "Partial gravity is the Moon and Mars case"],
  ["Data in PSI now", 1, "Results exist today"],
];

export default function MoonReadiness() {
  const [w, setW] = useState([1, 1, 1, 1]);
  const rows = catalog
    .filter((c) => R[c.id])
    .map((c) => {
      const s = R[c.id];
      const max = CRIT.reduce((a, k, i) => a + k[1] * w[i], 0) || 1;
      const total = s.reduce((a, v, i) => a + v * w[i], 0);
      return { c, s, pct: Math.round((100 * total) / max) };
    })
    .sort((a, b) => b.pct - a.pct);

  const o2 = rows.filter((r) => r.s[0] === 2).length;
  const pg = rows.filter((r) => r.s[2] === 2 && r.s[3] === 1).length;
  const noO2 = rows.filter((r) => r.s[0] === 0).length;

  const csv = () => {
    const head = ["investigation","oxygen_0_2","crew_use_0_2","gravity_0_2","data_0_1","readiness_pct"];
    const body = rows.map(({ c, s, pct }) => [c.short, ...s, pct].join(","));
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([[head.join(","), ...body].join("\n")], { type: "text/csv" }));
    a.download = "flameguard-readiness.csv";
    a.click();
  };

  return (
    <section id="moonready" className="section">
      <h2>Moon readiness ranking</h2>
      <p className="lead">
        Which investigations best match a crewed Moon base? Set your own
        priorities and the ranking updates. Every sub-score is shown.
      </p>
      <div className="stats rd-stats">
        <div><b>{o2}/{rows.length}</b><span>at 30%+ oxygen (tested or planned)</span></div>
        <div><b>{noO2}/{rows.length}</b><span>no oxygen value in sources checked</span></div>
        <div><b>{pg}</b><span>emulated partial-gravity dataset (E-FIELD)</span></div>
      </div>
      <div className="panel">
        <div className="filters" style={{ flexWrap: "wrap" }}>
          {CRIT.map(([n, , d], i) => (
            <label key={n} className="slider" title={d}>
              {n} weight: {w[i]}
              <input type="range" min="0" max="3" value={w[i]}
                onChange={(e) => setW(w.map((v, j) => (j === i ? Number(e.target.value) : v)))} />
            </label>
          ))}
        </div>
        <button className="chip" onClick={csv}>Download ranking (CSV)</button>
        <div className="table-wrap">
          <table style={{ minWidth: 640 }}>
            <thead><tr><th>Investigation</th>{CRIT.map((k) => <th key={k[0]}>{k[0]}</th>)}<th>Readiness</th></tr></thead>
            <tbody>
              {rows.map(({ c, s, pct }) => (
                <tr key={c.id}>
                  <td><a href={c.source_url} target="_blank" rel="noreferrer">{c.short}</a>{c.planned && <em> planned</em>}</td>
                  {s.map((v, i) => <td key={i}>{v}/{CRIT[i][1]}</td>)}
                  <td>
                    <div style={{ background: "rgba(255,255,255,.1)", borderRadius: 6, height: 10, minWidth: 90 }}>
                      <div style={{ width: `${pct}%`, height: 10, borderRadius: 6, background: "linear-gradient(90deg,#ff9a3c,#6ee7b7)" }} />
                    </div>
                    <span className="small">{pct}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small">
          Finding: only {o2} of {rows.length} investigations reach
          Moon-like oxygen (FLEX-2 as a test range, CFI-G in flight, SoFIE only planned), and the planned lunar experiments have no data yet.
          The rubric is our own. Scores of 0 mean "not stated in the sources
          we checked", not "tested and failed".
        </p>
      </div>
    </section>
  );
}
