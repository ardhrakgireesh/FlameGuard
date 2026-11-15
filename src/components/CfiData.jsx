import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cfiRuns, CFI_URL } from "../cfi";

const P = [0.5, 0.75, 1, 1.25, 2, 3, 5];
export default function CfiData() {
  const n = (f) => cfiRuns.filter(f).length;
  const data = P.map((p) => ({
    p: `${p} atm`,
    "17% oxygen": n((r) => r.p === p && r.o2 === 0.17),
    "21% oxygen": n((r) => r.p === p && r.o2 === 0.21),
  }));
  const heRuns = n((r) => r.he > 0);
  const csv = () => {
    const h = "test,date_2017,pressure_atm,oxygen,nitrogen,helium,fiber,fuel";
    const b = cfiRuns.map((r) => [r.test, r.date, r.p, r.o2, r.n2, r.he, r.fiber, `"${r.fuel}"`].join(","));
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([[h, ...b].join("\n")], { type: "text/csv" }));
    a.download = "psi39-cfi-experimental-table.csv";
    a.click();
  };
  return (
    <section id="cfidata" className="section">
      <h2>Structured oxygen and pressure data (PSI-39)</h2>
      <p className="lead">
        Unlike the other records audited, PSI-39 has an Experimental Table with
        separate columns for pressure, oxygen, nitrogen and helium. That is
        model-ready input. These droplet tests used {cfiRuns.length} test
        rows, read from NASA's table.
      </p>
      <div className="stats rd-stats">
        <div><b>{P[0]}-{P[P.length - 1]}</b><span>atm tested</span></div>
        <div><b>17-21%</b><span>oxygen: none at Moon-like 30%+</span></div>
        <div><b>{heRuns}</b><span>runs with helium added</span></div>
      </div>
      <div className="panel">
        <h3>Tests per pressure and oxygen level</h3>
        <div role="img" aria-label={`Bar chart of ${cfiRuns.length} CFI tests by pressure from 0.5 to 5 atm and oxygen level of 17 or 21 percent.`} style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="p" stroke="#aab4e6" /><YAxis stroke="#aab4e6" allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#0b1230", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, color: "#e8ecff" }} />
              <Legend />
              <Bar dataKey="17% oxygen" fill="#7fc4ff" radius={[6, 6, 0, 0]} />
              <Bar dataKey="21% oxygen" fill="#ff9a3c" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <button className="chip" onClick={csv}>Download this table (CSV)</button>
      </div>
      <p className="small">
        Source: <a className="lnk" href={CFI_URL} target="_blank" rel="noreferrer">NASA PSI-39 Experimental Table</a>.
        Read from NASA's CSV, not retyped. NASA's file lists tests 1285-1289 and 1295-1297 twice; the 8 exact duplicate rows were removed, leaving 79 tests. Fiber is blank for 9 tests in NASA's own table. Tests 1219-1222 list oxygen 0.21 with nitrogen 0.76 (sum 0.97), left exactly as NASA recorded it.
        Finding: this dataset stops at 21% oxygen, so the Moon-base atmosphere (30%+) is still untested here.
      </p>
    </section>
  );
}
