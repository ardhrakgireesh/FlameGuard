import { motion } from "framer-motion";
import Float from "./Float";
import { catalog, insights, earthUses } from "../catalog";

export default function Insights() {
  const byId = Object.fromEntries(catalog.map((c) => [c.id, c]));
  return (
    <section id="insights" className="section">
      <h2>Safety insights for the Moon and Mars</h2>
      <p className="lead">
        Each insight points to the NASA records that support it. The
        "recommended action" lines are our own interpretation.
      </p>
      <div className="insights">
        {insights.map((ins, idx) => (
          <Float key={ins.title} amp={6}>
            <motion.div
              className="insight"
              initial={{ opacity: 0, x: idx % 2 ? 80 : -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ type: "spring", stiffness: 70, damping: 14 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="insight-num">{idx + 1}</div>
              <div>
                <h3>{ins.title}</h3>
                <p>{ins.body}</p>
                <p className="moonmars">🌕 Recommended action: {ins.action}</p>
                <div className="support">
                  Based on:{" "}
                  {ins.support.map((id) => (
                    <a
                      key={id}
                      href={byId[id].source_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {byId[id].short}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </Float>
        ))}
      </div>

      <h2 style={{ marginTop: 90 }}>Space fire safety helps on Earth too</h2>
      <div className="earth">
        {earthUses.map((e) => (
          <motion.div
            key={e.title}
            className="earth-card"
            whileHover={{ y: -8, scale: 1.04 }}
          >
            <div className="earth-icon">{e.icon}</div>
            <h3>{e.title}</h3>
            <p>{e.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
