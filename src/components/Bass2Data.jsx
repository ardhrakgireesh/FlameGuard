import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { bass2, BASS2_URL } from "../bass2";

export default function Bass2Data() {
  const o2 = bass2.map((r) => r.o2i);
  const lo = Math.min(...o2), hi = Math.max(...o2);
  const below = bass2.filter((r) => r.o2i < 20.9).length;
  const pis = new Set(bass2.map((r) => r.pi)).size;
  const hist = [];
  for (let b = 14; b <= 22; b++) hist.push({ o2: `${b}%`, tests: bass2.filter((r) => Math.round(r.o2i) === b).length, air: b === 21 });
  const groups = Object.entries(bass2.reduce((a, r) => ((a[r.group] = (a[r.group] || 0) + 1), a), {})).sort((a, b) => b[1] - a[1]);
  const missing = bass2.filter((r) => r.o2f == null || r.co2f == null || r.cof == null).length;
  const high = bass2.filter((r) => r.o2f != null && r.o2f > 25).length;
  const odd = bass2.filter((r) => r.o2f != null && r.o2f < r.o2i - 5).length;
  const csv = () => {
    const h = "test,pi,date,material_group,o2_initial,o2_final,co2_initial,co2_final,co_initial_ppm,co_final_ppm";
    const b = bass2.map((r) => [r.test, r.pi, r.date, `"${r.group}"`, r.o2i, r.o2f ?? "", r.co2i ?? "", r.co2f ?? "", r.coi ?? "", r.cof ?? ""].join(","));
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([[h, ...b].join("\n")], { type: "text/csv" }));
    a.download = "psi25-bass2-experimental-table.csv";
    a.click();
  };
  return (
    <section id="bass2data" className="section">
      <h2>Solid-material burns at reduced oxygen (PSI-25 BASS-II)</h2>
      <p className="lead">
        The only solid-fuel table so far: {bass2.length} burns of plastic rods,
        films and fabrics on the ISS (mostly 2014; NASA's table also dates 3 tests 2016 and 2 tests 2018, probably typos), with oxygen, CO2 and CO measured
        before and after each test. Material selection is the main way to
        prevent spacecraft fires, so this is the closest data to it.
      </p>
      <div className="stats rd-stats">
        <div><b>{bass2.length}</b><span>tests, {pis} investigators</span></div>
        <div><b>{lo}-{hi}%</b><span>starting oxygen</span></div>
        <div><b>{below}</b><span>tests below Earth air (21%)</span></div>
        <div><b>0</b><span>tests at Moon-like 30%+</span></div>
      </div>
      <div className="panel">
        <h3>Tests by starting oxygen level</h3>
        <div role="img" aria-label={`Bar chart of ${bass2.length} BASS-II tests by starting oxygen, from ${lo} to ${hi} percent. No test reaches 30 percent.`} style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={hist} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="o2" stroke="#aab4e6" /><YAxis stroke="#aab4e6" allowDecimals={false} />
              <Tooltip formatter={(v) => [`${v} tests`, "Count"]} contentStyle={{ background: "#0b1230", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, color: "#e8ecff" }} />
              <Bar dataKey="tests" radius={[6, 6, 0, 0]}>
                {hist.map((d, i) => <Cell key={i} fill={d.air ? "#ff9a3c" : "#7fc4ff"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="legend">
          <span><i style={{ background: "#ff9a3c" }} /> 21% (Earth air)</span>
          <span><i style={{ background: "#7fc4ff" }} /> other levels</span>
        </div>
        <h3 style={{ marginTop: 16 }}>Materials burned</h3>
        <div className="pills">{groups.map(([g, n]) => <span key={g} className="chip">{g}: {n}</span>)}</div>
        <button className="chip" onClick={csv}>Download this table (CSV)</button>
      </div>
      <p className="small">
        Source: <a className="lnk" href={BASS2_URL} target="_blank" rel="noreferrer">NASA PSI-25 Experimental Table</a>,
        read from NASA's CSV, not retyped. Material groups are ours. Data checks: {missing} tests lack a final
        oxygen, CO2 or CO reading, and {odd} show a final oxygen drop of more than 5 points (for example test B2), which may be a
        sensor issue and was left as NASA recorded it. {high} tests record a final oxygen above 25% (P22b 39.1, T28b 40.4) from a start near 20%, which is not physical for a burn that consumes oxygen, so they are probably typos in NASA's table. The table has no flame-spread rate or outcome column,
        and the fan and air display values are raw instrument readings, so airflow in cm/s cannot be read from it.
        Finding: BASS-II tests the 14-22% range where flames still burn, but not the 30%+ atmosphere planned for the Moon.
      </p>
    </section>
  );
}
