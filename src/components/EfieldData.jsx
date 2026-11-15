import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { efieldRuns, efieldReport, PSI22_URL } from "../efield";

const FUEL_COLOR = { Methane: "#7fc4ff", Ethylene: "#ff9a3c" };

export default function EfieldData() {
  const [fuel, setFuel] = useState("All");
  const rows = efieldRuns.filter((r) => fuel === "All" || r.fuel === fuel);

  // Cross-check our copy of the table against the totals NASA states in the report text.
  const total = efieldRuns.reduce((s, r) => s + r.flames, 0);
  const round1 = efieldRuns.filter((r) => r.round === 1).reduce((s, r) => s + r.flames, 0);
  const ok = total === efieldReport.totalFlames && round1 === efieldReport.firstRoundFlames;

  const byFuel = ["Methane", "Ethylene"].map((f) => ({
    f,
    n: efieldRuns.filter((r) => r.fuel === f).reduce((s, r) => s + r.flames, 0),
    days: efieldRuns.filter((r) => r.fuel === f).length,
  }));

  const data = rows.map((r) => ({ ...r, label: r.date }));

  return (
    <section id="realdata" className="section">
      <h2>Real NASA data, checked</h2>
      <p className="lead">
        Every row below is copied from NASA's E-FIELD Flames table (PSI-22) and
        its 30-day ISS report. Flames burned on the space station in 2018.
      </p>

      <div className="stats rd-stats">
        <div><b>{total}</b><span>flames ignited</span></div>
        <div><b>{efieldRuns.length}</b><span>test days</span></div>
        <div><b>{efieldReport.coflowOxygenPercent}%</b><span>oxygen in coflow air</span></div>
        <div><b>{efieldReport.maxVolts.toLocaleString()}</b><span>max volts applied</span></div>
      </div>

      <div className={`verify ${ok ? "good" : "bad"}`}>
        {ok
          ? `✔ Verified: our table adds up to ${total} flames in total and ${round1} in the first round, exactly what NASA's report states.`
          : "⚠ Our table does not match the totals in NASA's report. Check the rows."}
      </div>

      <div className="pills">
        {["All", "Methane", "Ethylene"].map((f) => (
          <button key={f} className={`chip ${fuel === f ? "on" : ""}`} onClick={() => setFuel(f)}>
            {f === "All" ? "All fuels" : f}
          </button>
        ))}
      </div>

      <div className="panel">
        <h3>Flames ignited per test day</h3>
        <div style={{ width: "100%", height: 300 }}>
          <div role="img" aria-label="Bar chart of E-FIELD flames per test day on the ISS. The same numbers are in the table on this page." style={{ width: "100%", height: "100%" }}><ResponsiveContainer>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="label" stroke="#aab4e6" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" interval={0} />
              <YAxis stroke="#aab4e6" />
              <Tooltip
                contentStyle={{ background: "#0b1230", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, color: "#e8ecff" }}
                formatter={(v, n, p) => [`${v} flames`, `${p.payload.fuel} · fuel ${p.payload.conc}`]}
                labelFormatter={(l, p) =>
                  p?.[0] ? `${l} 2018 · test day ${p[0].payload.day} · ${p[0].payload.polarity} mesh · ${p[0].payload.burner} burner` : l
                }
              />
              <Bar dataKey="flames" radius={[6, 6, 0, 0]}>
                {data.map((d, i) => <Cell key={i} fill={FUEL_COLOR[d.fuel]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer></div>
        </div>
        <div className="legend">
          {byFuel.map((b) => (
            <span key={b.f}>
              <i style={{ background: FUEL_COLOR[b.f] }} /> {b.f}: {b.n} flames on {b.days} days
            </span>
          ))}
        </div>
      </div>

      <motion.div className="table-wrap" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <table style={{ minWidth: 700 }}>
          <thead>
            <tr><th>Test day</th><th>Date</th><th>Burner</th><th>Mesh polarity</th><th>Fuel bottle</th><th>Fuel conc.</th><th>Flames</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.day}>
                <td>{r.day}</td><td>{r.date} 2018</td><td>{r.burner}</td>
                <td>{r.polarity}</td><td>{r.bottle}</td><td>{r.conc}</td><td><b>{r.flames}</b></td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <p className="small">
        Source:{" "}
        <a href={PSI22_URL} target="_blank" rel="noreferrer" className="lnk">NASA PSI-22 (E-FIELD Flames)</a>{" "}
        and the "ACME/E-FIELD Flames 30-day Operation Accomplishments Report, ISS Increments 55 and 56", 15 Nov 2018,
        Table 1. Test day 18073 means year 2018, day 73. The oxygen level (21%, balance nitrogen) is stated in the
        report text, not in the table.
      </p>
    </section>
  );
}
