import { useState } from "react";
import { motion } from "framer-motion";
import { PSI22_URL } from "../efield";

const GRAV = [
  { key: "micro", label: "Microgravity", sub: "ISS" },
  { key: "moon", label: "Moon", sub: "1/6 g" },
  { key: "mars", label: "Mars", sub: "0.38 g" },
  { key: "earth", label: "Earth", sub: "1 g" },
];
const O2 = [21, 30, 85, 100];

const GAP =
  "NASA says there is no partial-gravity combustion data in PSI yet. It expects some from LUCI and FM2.";
const UNK =
  "Not found in the sources checked so far. This cell needs an audit of more PSI investigations.";

// Only cells backed by a source are marked "found". Nothing is guessed.
const CELLS = {
  "micro-21": {
    state: "found",
    text: "E-FIELD Flames burned methane and ethylene in coflow air with 21% oxygen, balance nitrogen. 142 flames were ignited on the ISS in 2018. BASS-II (PSI-25) also burned solid materials in 129 tests at 13.6-22.2% oxygen.",
    link: [PSI22_URL, "NASA PSI-22 and the E-FIELD report"],
  },
  "micro-85": {
    state: "found",
    text: "CFI-G made the microgravity tests with the highest oxygen concentration: an oxygen-nitrogen mixture of up to 85% oxygen, from a spherical burner.",
    link: ["https://psi.nasa.gov/physci/repo/data/investigations/PSI-159", "NASA PSI-159 and the challenge brief"],
  },
};
for (const g of ["moon", "mars"]) for (const o of O2) CELLS[`${g}-${o}`] = { state: "gap", text: GAP };
for (const k of ["micro-30", "micro-100"]) CELLS[k] = { state: "unknown", text: UNK };
for (const o of O2) CELLS[`earth-${o}`] = {
  state: "unknown",
  text: "NASA compares microgravity flames with normal-gravity ones, but the oxygen levels of those 1 g tests were not itemized in the sources checked.",
};

CELLS["micro-30"] = {
  state: "found",
  text: "FLEX-2 (PSI-68) lists oxygen mole fractions up to 0.30 (30%), in O2/N2 or O2/He, at 0.5 to 3 atm, for liquid droplets. The table gives ranges, not per-run results.",
  link: ["https://psi.nasa.gov/physci/repo/data/investigations/PSI-68", "NASA PSI-68 Experimental Table"],
};

const TARGETS = [
  {
    key: "moon-30",
    label: "🌕 Moon base (30%+ oxygen)",
    text: "NASA expects Moon bases and rovers at 30% oxygen or more and 10.2 psi or less. Nearest evidence: microgravity at 21% (E-FIELD), up to 30% for droplets (FLEX-2, PSI-68) and up to 85% (CFI-G). Nothing exists at 1/6 g. NASA says microgravity and normal-gravity results could bound the in-between case.",
  },
  {
    key: "moon-100",
    label: "🧑‍🚀 Spacesuit on the Moon (100% oxygen)",
    text: "Spacesuits hold 100% oxygen at 4.3 psi. Nearest evidence: microgravity up to 85% (CFI-G). No data exists at 1/6 g, and no source checked so far covers 100% oxygen in microgravity.",
  },
];

const LABEL = { found: "Evidence found", gap: "No data in PSI", unknown: "Not checked yet" };

const AUDIT = {
  "E-FIELD (PSI-22)": [
    ["Oxygen concentration", "Not a table column. Only in the report text (21%)."],
    ["Fuel concentration", "A column in the table."],
    ["Pressure", "Not in the table. No value in the report pages read."],
    ["Airflow speed", "Not in the table. Named as a parameter in the report."],
    ["Structured data factors", "Experimental table with one row per test day."],
  ],
  "BASS (PSI-26)": [
    ["Oxygen concentration", "No value. The hypothesis says oxygen was held equal to normal gravity, but gives no number."],
    ["Fuel / material", "In text: cotton-fiberglass fabric, Nomex, Ultem, spheres, cylinders."],
    ["Pressure", "Not stated in the metadata."],
    ["Airflow speed", "In text only: up to 40 cm/s, opposed or concurrent."],
    ["Structured data factors", "Study Factors and Assays fields are empty in the metadata file."],
  ],
  "BASS-II (PSI-25)": [
    ["Oxygen concentration", "Measured columns: initial and final oxygen, 13.6-22.2%. No test at 30%+."],
    ["Fuel / material", "A column: PMMA films, rods and a sphere, SIBAL and Nomex fabrics."],
    ["Gas measurements", "Initial and final CO2 and CO columns."],
    ["Airflow speed", "Raw fan and air display values, not cm/s."],
    ["Outcome", "No spread rate or extinction column in the table."],
  ],
  "FLEX-2 (PSI-68)": [
    ["Oxygen concentration", "A table column: 0.17, 0.21, 0.25 or 0.30. The first table here to reach 30%."],
    ["Pressure", "A table column: 0.5, 1.0, 1.5, 2.0 or 3.0 atm."],
    ["Airflow speed", "A table column: 0.1 to 5 cm/s."],
    ["Fuel", "A table column: 8 liquid fuels and mixtures listed."],
    ["Structured data factors", "Ranges only, not one row per run. No associated Modeling Table."],
  ],
  "CFI (PSI-39)": [
    ["Oxygen concentration", "A table column: 0.17 and 0.21 mole fraction. Nothing at 30% or more."],
    ["Pressure", "A table column: 0.5, 0.75, 1, 1.25, 2, 3 and 5 atm."],
    ["Diluents", "Columns for nitrogen and helium (helium up to 0.59)."],
    ["Airflow speed", "Not a column. Droplets burn in still gas."],
    ["Structured data factors", "Yes: one row per test, downloadable from the PSI page."],
  ],
  "FLEX (PSI-69)": [
    ["Oxygen concentration", "Method described (find the Limiting Oxygen Index) but no values in the metadata."],
    ["Pressure", "Test range stated in text: 0.5 to 1.5 atm."],
    ["Suppressant", "In text: CO2, He and SF6."],
    ["Airflow speed", "Not stated. Droplets burn in still atmosphere."],
    ["Structured data factors", "Study file is a placeholder. 45 linked papers hold the numbers."],
  ],
  "CFI-G (PSI-159)": [
    ["Oxygen concentration", "Not mentioned at all. The 85% value comes only from the challenge brief."],
    ["Fuel", "In text: propane, n-butane, n-pentane."],
    ["Pressure", "Only 'a range of pressures'. No value."],
    ["Airflow speed", "Only 'flow rates'. No value."],
    ["Structured data factors", "Study file is a placeholder. 2 linked papers."],
  ],
  "SAME (PSI-102)": [
    ["Oxygen concentration", "Not a column and not stated."],
    ["Fuel / material", "A table column: Teflon, Kapton, silicone rubber, lampwick, dibutyl phthalate."],
    ["Airflow speed", "A table column: 5 and 10 cm/s."],
    ["Heating and aging", "Columns for weight-loss rate (1 and 2 mg/min) and aging (1 and 20 min)."],
    ["Structured data factors", "Yes: an Experimental Table with 8 rows. 10 linked papers."],
  ],
};

export default function BlindSpot() {
  const [sel, setSel] = useState("moon-30");
  const [target, setTarget] = useState("moon-30");
  const [inv, setInv] = useState("E-FIELD (PSI-22)");
  const cell = CELLS[sel];
  const tgt = TARGETS.find((t) => t.key === target);

  const pick = (key) => setSel(key);
  const pickTarget = (key) => { setTarget(key); setSel(key); };

  return (
    <section id="blind" className="section">
      <h2>The blind spot: fire on the Moon</h2>
      <p className="lead">
        Where does NASA have fire evidence, and where will crews actually live?
        Tap any square, or pick a mission target.
      </p>

      <div className="pills">
        {TARGETS.map((t) => (
          <button key={t.key} className={`chip ${target === t.key ? "on" : ""}`} onClick={() => pickTarget(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="panel bs">
        <div className="bs-grid">
          <div className="bs-row bs-hrow">
            <div />
            {GRAV.map((g) => (
              <div key={g.key} className="bs-head"><b>{g.label}</b><span>{g.sub}</span></div>
            ))}
          </div>
          {O2.map((o) => (
            <div key={o} className="bs-row">
              <div className="bs-o2"><b>{o}%</b><span>oxygen</span></div>
              {GRAV.map((g) => {
                const key = `${g.key}-${o}`;
                const c = CELLS[key];
                return (
                  <motion.button
                    key={key}
                    className={`bs-cell ${c.state} ${sel === key ? "sel" : ""}`}
                    onClick={() => pick(key)}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    {key === target && <span className="star">★</span>}
                    {c.state === "found" ? "✔" : c.state === "gap" ? "?" : "·"}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="bs-detail">
          <div className={`bs-badge ${cell.state}`}>{LABEL[cell.state]}</div>
          <h3>
            {GRAV.find((g) => g.key === sel.split("-")[0]).label} at {sel.split("-")[1]}% oxygen
          </h3>
          <p>{cell.text}</p>
          {cell.link && (
            <a href={cell.link[0]} target="_blank" rel="noreferrer" className="lnk">{cell.link[1]} ↗</a>
          )}
          <div className="bs-target">
            <b>★ {tgt.label}</b>
            <p>{tgt.text}</p>
          </div>
        </div>
      </div>

      <div className="legend">
        <span><i style={{ background: "#6ee7b7" }} /> Evidence found</span>
        <span><i style={{ background: "#ff6b6b" }} /> No data in PSI (NASA says so)</span>
        <span><i style={{ background: "#55608f" }} /> Not checked yet</span>
      </div>
      <p className="small">
        ★ marks the selected mission target. Only squares backed by a NASA
        source are marked "found". Squares marked "?" are gaps NASA states
        itself. We do not guess the rest. Partial-gravity studies may exist outside PSI; this map covers PSI only.
      </p>

      <div className="panel audit">
        <h3>Data readiness audit: can PSI data feed a model?</h3>
        <p className="lead" style={{ marginBottom: 16 }}>
          The brief asks for data that supports predictive modeling. We checked
          which variables a model needs, and where PSI keeps them.
        </p>
        <div className="pills">
          {Object.keys(AUDIT).map((k) => (
            <button key={k} className={`chip ${inv === k ? "on" : ""}`} onClick={() => setInv(k)}>{k}</button>
          ))}
        </div>
        <table style={{ minWidth: 0 }}>
          <tbody>
            {AUDIT[inv].map(([k, v]) => (
              <tr key={k}><td><b>{k}</b></td><td>{v}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="small">
          Finding: of 8 investigations audited, five have a structured Experimental Table (PSI-25, PSI-68, PSI-39, PSI-22, PSI-102). PSI-25 and PSI-68 and PSI-39 have oxygen columns; none of them reaches 30% in a solid-material test. The rest keep oxygen, pressure or airflow in prose or in linked papers, and CFI-G does not state oxygen at all.
        </p>
      </div>
    </section>
  );
}
