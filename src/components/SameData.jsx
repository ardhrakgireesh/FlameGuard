// Copied from the PSI-102 (SAME) Experimental Table, read from a clear screenshot.
const COND = [
  { n: 1, air: 5, loss: 2, aging: 1 },
  { n: 2, air: 5, loss: 1, aging: 1 },
  { n: 3, air: 5, loss: 2, aging: 20 },
  { n: 4, air: 10, loss: 2, aging: 1 },
];
const MATS = ["Teflon", "Kapton", "Silicone rubber", "Lampwick", "Dibutyl phthalate"];
const URL = "https://psi.nasa.gov/physci/repo/data/investigations/PSI-102";

export default function SameData() {
  return (
    <section id="samedata" className="section">
      <h2>Smoke test matrix (PSI-102 SAME)</h2>
      <p className="lead">
        NASA's table for the smoke detection experiment varies three things:
        airflow, how fast the sample loses weight (how hard it is heated), and
        how long the material was aged. Five materials were tested under the
        same four condition sets (see the note below the table).
      </p>
      <div className="stats rd-stats">
        <div><b>{MATS.length}</b><span>materials</span></div>
        <div><b>5 and 10</b><span>cm/s airflow tested</span></div>
        <div><b>1 and 20</b><span>minutes of aging</span></div>
        <div><b>{MATS.length * COND.length}</b><span>material and condition pairs</span></div>
      </div>
      <div className="table-wrap">
        <table style={{ minWidth: 420 }}>
          <thead>
            <tr><th>Condition set</th><th>Air flow (cm/s)</th><th>Weight loss rate (mg/min)</th><th>Aging (min)</th></tr>
          </thead>
          <tbody>
            {COND.map((c) => (
              <tr key={c.n}>
                <td><b>{c.n}</b></td><td>{c.air}</td><td>{c.loss}</td><td>{c.aging}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small">
        Materials: {MATS.join(", ")}. Source:{" "}
        <a className="lnk" href={URL} target="_blank" rel="noreferrer">NASA PSI-102 Experimental Table</a>.
        NASA lists Teflon with its conditions and writes "same conditions as 1-4"
        for the other four, so the 20 pairs are our reading of that note.
        Oxygen is not a column in this table. Both airflow values sit inside
        the 0-30 cm/s spacecraft ventilation range, but only two points of it are covered.
      </p>
    </section>
  );
}
