import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function ExperimentCard({ item }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 14 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 14 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    x.set(px - 0.5);
    y.set(py - 0.5);
    ref.current.style.setProperty("--gx", `${px * 100}%`);
    ref.current.style.setProperty("--gy", `${py * 100}%`);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.article
      ref={ref}
      className={`card ${item.type}`}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 80, damping: 14 }}
      whileHover={{ scale: 1.05, zIndex: 5 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="card-top">
        <span className={`tag ${item.category}`}>
          {item.category}
          {item.year ? ` · ${item.year}` : ""}
        </span>
        <span className="score">🔥 {item.concern_score}/5</span>
      </div>
      {item.planned && <span className="planned">PLANNED · NO DATA YET</span>}
      <h3>{item.name}</h3>
      <p>{item.key_finding}</p>
      {(item.fuel || item.conditions) && (
        <div className="meta">
          {item.fuel && <span>🧪 {item.fuel}</span>}
          {item.conditions && <span>⚙️ {item.conditions}</span>}
        </div>
      )}
      {item.safety_implication && (
        <p className="impact">🛰️ {item.safety_implication}</p>
      )}
      <a href={item.source_url} target="_blank" rel="noreferrer">
        NASA source ↗
      </a>
    </motion.article>
  );
}
