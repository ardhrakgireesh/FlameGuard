import { motion } from "framer-motion";
import { bass2 } from "../bass2";
import { cfiRuns } from "../cfi";
import { efieldRuns } from "../efield";

export default function Findings() {
  const tests = bass2.length + cfiRuns.length;
  const top = Math.max(...bass2.map((r) => r.o2i), ...cfiRuns.map((r) => r.o2 * 100));
  const flames = efieldRuns.reduce((s, r) => s + r.flames, 0);
  const cards = [
    ["1", `${top}%`, `Highest starting oxygen in ${tests} real test rows (BASS-II and CFI). A Moon base is expected at 30% or more.`, "#blind"],
    ["2", "0", "Moon- or Mars-gravity datasets in PSI, NASA's combustion database. LUCI and FM2 are planned to fill the gap.", "#blind"],
    ["3", "Prose", `Oxygen for ${flames} ISS flames (E-FIELD) sits in a report, not a data column. Models cannot read it.`, "#blind"],
  ];
  return (
    <section className="section" style={{ paddingTop: 20, paddingBottom: 20 }}>
      <h2>Three findings from the data</h2>
      <div className="grid" style={{ marginTop: 24 }}>
        {cards.map(([n, big, text, href], i) => (
          <motion.a key={n} href={href} className="card find" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
            <b className="find-big">{big}</b>
            <p>{text}</p>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
