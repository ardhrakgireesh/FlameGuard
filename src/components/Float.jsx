import { useMemo } from "react";

// Makes anything drift gently, like it is floating in zero gravity.
export default function Float({ children, amp = 10 }) {
  const d = useMemo(
    () => ({
      dur: 5 + Math.random() * 4,
      delay: -Math.random() * 8,
      rot: (Math.random() - 0.5) * 1.4,
    }),
    []
  );
  return (
    <div
      className="float"
      style={{
        "--amp": `${amp}px`,
        "--rot": `${d.rot}deg`,
        animationDuration: `${d.dur}s`,
        animationDelay: `${d.delay}s`,
      }}
    >
      {children}
    </div>
  );
}
