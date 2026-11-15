import { motion } from "framer-motion";
import Float from "./Float";

export default function WhyDifferent() {
  return (
    <section id="why" className="section">
      <motion.blockquote
        className="quote"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        “If you want to get somebody’s attention really quick, make the fire
        alarm go off in your spacecraft when you’re still about 80,000 miles
        from home.”
        <cite>Artemis II commander, quoted in the NASA challenge description</cite>
      </motion.blockquote>

      <h2>Why fire behaves differently in space</h2>
      <p className="lead">
        On Earth, hot gas rises, so a flame is a flickering teardrop. With no
        buoyancy, a flame becomes a ghostly blue sphere that depends on
        diffusion for its oxygen. NASA's fire safety work focuses on three
        jobs: prevention, detection and suppression.
      </p>
      <div className="compare">
        <Float amp={12}>
          <motion.div
            className="compare-box"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flame-earth" />
            <h3>On Earth</h3>
            <p>Hot gas rises, so the flame is tall, teardrop shaped and flickers.</p>
          </motion.div>
        </Float>
        <Float amp={14}>
          <motion.div
            className="compare-box"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flame-space" />
            <h3>In microgravity</h3>
            <p>No rising gas, so the flame is a round blue ball.</p>
          </motion.div>
        </Float>
      </div>

      <div className="jobs">
        <div><b>🛡️ Prevention</b><span>Control ignition sources and choose safe materials</span></div>
        <div><b>📡 Detection</b><span>Sense smoke early</span></div>
        <div><b>🧯 Suppression</b><span>Put the fire out</span></div>
      </div>
      <p className="small">
        Source: NASA Glenn Combustion Science page and the NASA challenge
        description. The flame pictures are illustrations, not NASA photos.
      </p>
    </section>
  );
}
