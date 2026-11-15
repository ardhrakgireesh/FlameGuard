import { motion } from "framer-motion";

// Side-by-side view of the investigations: what burned, with what hardware,
// under which conditions. "Not stated" means NASA's text did not say.
export default function Compare({ items }) {
  const rows = items.filter((i) => i.type === "experiment");
  const dash = (v) => v || <span className="ns">Not stated</span>;

  return (
    <section id="compare" className="section">
      <h2>Compare the investigations</h2>
      <p className="lead">
        What was burned, in which hardware, and under which conditions. Blank
        cells mean the NASA text did not state it. Nothing is guessed.
      </p>
      <motion.div
        className="table-wrap"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <table>
          <thead>
            <tr>
              <th>Investigation</th>
              <th>Job</th>
              <th>Fuel</th>
              <th>Hardware</th>
              <th>Conditions</th>
              <th>Relevance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <a href={r.source_url} target="_blank" rel="noreferrer">
                    {r.short}
                  </a>
                  {r.planned && <em> planned</em>}
                </td>
                <td><span className={`pill ${r.category}`}>{r.category}</span></td>
                <td>{dash(r.fuel)}</td>
                <td>{dash(r.hardware)}</td>
                <td>{dash(r.conditions)}</td>
                <td>
                  <span className="dots">
                    {"●".repeat(r.concern_score)}
                    <i>{"●".repeat(5 - r.concern_score)}</i>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
      <p className="small">
        Relevance is our own rubric: how directly the work addresses fire
        safety for crewed spacecraft and bases. It is not an official NASA
        rating.
      </p>
    </section>
  );
}
