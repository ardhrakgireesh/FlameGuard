import { useState } from "react";
import { motion } from "framer-motion";
import { atmospheres } from "../catalog";

export default function MoonAtmosphere() {
  const [sel, setSel] = useState("moon");
  const cur = atmospheres.find((a) => a.key === sel);
  const earth = atmospheres[0];
  const rise = Math.round(((cur.o2 - earth.o2) / earth.o2) * 100);
  // partial pressure of oxygen = fraction x total pressure (our own calculation)
  const pp = cur.psi ? ((cur.o2 / 100) * cur.psi).toFixed(1) : null;

  return (
    <section id="moon" className="section">
      <h2>The air on the Moon burns differently</h2>
      <p className="lead">
        Tap an environment. Flammability depends strongly on oxygen
        concentration, and Moon bases are expected to use more oxygen than
        Earth air.
      </p>

      <div className="atmo-tabs">
        {atmospheres.map((a) => (
          <button
            key={a.key}
            className={`chip ${sel === a.key ? "on" : ""}`}
            onClick={() => setSel(a.key)}
          >
            {a.name}
          </button>
        ))}
      </div>

      <div className="panel atmo">
        <div className="atmo-bars">
          {atmospheres.map((a) => (
            <div key={a.key} className="bar-row">
              <span className="bar-label">{a.name.split(" (")[0].split(",")[0]}</span>
              <div className="bar-track">
                <motion.div
                  className={`bar-fill ${sel === a.key ? "hot" : ""}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${a.o2}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <b>{a.o2}%{a.key === "moon" ? "+" : ""}</b>
            </div>
          ))}
          <p className="small">Oxygen concentration. Moon figure is "30% or greater".</p>
        </div>

        <div className="atmo-detail">
          <h3>{cur.name}</h3>
          <div className="atmo-stats">
            <div><b>{cur.o2}%{cur.key === "moon" ? "+" : ""}</b><span>oxygen</span></div>
            <div><b>{cur.psi ? `${cur.psi}` : "n/a"}</b><span>{cur.psi ? (cur.key === "moon" ? "psi or less" : "psi") : "pressure"}</span></div>
            {cur.key !== "earth" && (
              <div><b>+{rise}%</b><span>oxygen vs Earth air</span></div>
            )}
          </div>
          <p>{cur.note}</p>
          {pp && (
            <p className="small">
              Our calculation: oxygen fraction × pressure ≈ {pp} psi of oxygen.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
