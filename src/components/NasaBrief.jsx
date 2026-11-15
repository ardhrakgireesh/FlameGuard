import { motion } from "framer-motion";
import { bass2 } from "../bass2";
import { cfiRuns } from "../cfi";
import { efieldRuns } from "../efield";

// One shared table built from the three per-test datasets. Nothing is guessed:
// a field the NASA table does not give stays empty, and o2_source says where oxygen came from.
function harmonize() {
  const rows = [];
  for (const r of bass2) rows.push({ source: "PSI-25 BASS-II", test: r.test, date: r.date, gravity: "micro", oxygen_pct: r.o2i, pressure_atm: "", material: r.group, o2_source: "table column" });
  for (const r of cfiRuns) rows.push({ source: "PSI-39 CFI", test: r.test, date: `${r.date}-2017`, gravity: "micro", oxygen_pct: Math.round(r.o2 * 100), pressure_atm: r.p, material: r.fuel, o2_source: "table column" });
  for (const r of efieldRuns) rows.push({ source: "PSI-22 E-FIELD", test: r.day, date: `${r.date} 2018`, gravity: "micro", oxygen_pct: 21, pressure_atm: "", material: `${r.fuel} ${r.conc}`, o2_source: "report text only" });
  return rows;
}

const SCHEMA = [
  ["gravity_level_g", "number", "0 for ISS microgravity, 0.166 Moon, 0.38 Mars, 1 Earth", "Lets one query compare all gravity levels"],
  ["oxygen_pct", "number", "Volume percent in the test atmosphere", "Missing from E-FIELD and BASS metadata tables"],
  ["pressure_atm", "number", "Total pressure in atmospheres", "Missing from BASS-II and E-FIELD tables"],
  ["flow_cm_s", "number", "Airflow speed in cm/s (not raw fan units)", "BASS-II gives raw fan readings only"],
  ["outcome", "enum", "ignited / spread / extinguished / blow-off", "BASS-II has no outcome column"],
  ["fuel_or_material", "text", "Standard name plus thickness", "Free text in every table checked"],
];

const download = (name, text) => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/csv" }));
  a.download = name;
  a.click();
};
const q = (v) => `"${String(v).replace(/"/g, '""')}"`;

export default function NasaBrief() {
  const rows = harmonize();
  const withBoth = rows.filter((r) => r.oxygen_pct !== "" && r.pressure_atm !== "").length;
  const bassTop = Math.max(...bass2.map((r) => r.o2i));

  const getData = () => {
    const h = "source,test,date,gravity,oxygen_pct,pressure_atm,material,o2_source";
    download("flameguard-harmonized-psi.csv", [h, ...rows.map((r) => [r.source, r.test, r.date, r.gravity, r.oxygen_pct, r.pressure_atm, q(r.material), r.o2_source].join(","))].join("\n"));
  };
  const getSchema = () => download("psi-recommended-columns.csv", ["column,type,meaning,why", ...SCHEMA.map((s) => s.map(q).join(","))].join("\n"));

  const recs = [
    ["1", "Measure fire where crews will live", `No per-test table reaches 30% oxygen (highest solid-material start: ${bassTop}%). Burn solids at Moon-base oxygen first, then at 1/6 g.`],
    ["2", "Put oxygen, pressure and flow in table columns", "Oxygen for E-FIELD sits only in a report, and BASS-II has raw fan units. Models cannot read prose. The column list below fixes this."],
    ["3", "Publish an outcome for every test", "BASS-II has no column saying whether the flame spread or went out, so it cannot train a flammability model."],
  ];

  return (
    <section id="nasa" className="section">
      <h2>What this means for NASA</h2>
      <p className="lead">
        Our recommendations, drawn from the gaps the data shows. They are our
        interpretation, not NASA statements.
      </p>
      <div className="grid">
        {recs.map(([n, t, d], i) => (
          <motion.div key={n} className="card find" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
            <b className="find-big">{n}</b>
            <h3 style={{ marginBottom: 8 }}>{t}</h3>
            <p>{d}</p>
          </motion.div>
        ))}
      </div>

      <div className="panel" style={{ marginTop: 28, textAlign: "left", animation: "none" }}>
        <h3>A starter dataset for prediction models</h3>
        <p className="lead" style={{ margin: "0 0 14px", textAlign: "left" }}>
          We merged {rows.length} test rows from three PSI tables into one file with shared columns.
          Only {withBoth} rows ({Math.round((100 * withBoth) / rows.length)}%) have both oxygen and pressure,
          because the others do not give pressure. Empty cells stay empty.
        </p>
        <div className="pills" style={{ justifyContent: "flex-start" }}>
          <button className="chip on" onClick={getData}>Download merged data (CSV)</button>
          <button className="chip" onClick={getSchema}>Download recommended PSI columns (CSV)</button>
        </div>
        <table style={{ minWidth: 0, marginTop: 12 }}>
          <thead><tr><th>Recommended column</th><th>Meaning</th><th>Why</th></tr></thead>
          <tbody>{SCHEMA.map((s) => <tr key={s[0]}><td><b>{s[0]}</b></td><td>{s[2]}</td><td>{s[3]}</td></tr>)}</tbody>
        </table>
        <p className="small">
          Oxygen for E-FIELD rows is 21% from NASA's report text and is flagged "report text only". Gravity is
          microgravity for all rows. The merged file is a convenience copy; the NASA tables remain the source.
        </p>
      </div>
    </section>
  );
}
