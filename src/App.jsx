import { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { lazy, Suspense } from "react";
import MoonReadiness from "./components/MoonReadiness";
const Starfield = lazy(() => import("./components/Starfield"));
import ExperimentCard from "./components/ExperimentCard";
import Float from "./components/Float";
import WhyDifferent from "./components/WhyDifferent";
import MoonAtmosphere from "./components/MoonAtmosphere";
import Compare from "./components/Compare";
import Charts from "./components/Charts";
import AskData from "./components/AskData";
import Findings from "./components/Findings";
const NasaBrief = lazy(() => import("./components/NasaBrief"));
const Checker = lazy(() => import("./components/Checker"));
const DataLab = lazy(() => import("./components/DataLab"));
import BlindSpot from "./components/BlindSpot";
import Insights from "./components/Insights";
import { catalog } from "./catalog";

const FILTERS = [
  ["all", "All"],
  ["prevention", "🛡️ Prevention"],
  ["detection", "📡 Detection"],
  ["suppression", "🧯 Suppression"],
  ["incident", "🔥 Incidents"],
  ["planned", "🌕 Planned"],
];

export default function App() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [minScore, setMinScore] = useState(1);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 20 });

  const shown = catalog
    .filter((c) => {
      if (filter === "all") return true;
      if (filter === "planned") return c.planned;
      return c.category === filter;
    })
    .filter((c) => c.concern_score >= minScore)
    .filter((c) =>
      [c.name, c.fuel, c.hardware, c.conditions, c.key_finding, c.safety_implication]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    )
    .sort((a, b) => b.concern_score - a.concern_score);

  const experiments = catalog.filter((c) => c.type === "experiment");

  return (
    <>
      <div className="nebula n1" />
      <div className="nebula n2" />
      <div className="nebula n3" />
      <Suspense fallback={null}><Starfield /></Suspense>
      <motion.div className="progress" style={{ scaleX: progress }} />

      <a className="skip" href="#main">Skip to content</a>
      <nav className="nav" aria-label="Sections">
        <span className="brand">🔥 FLAMEGUARD</span>
        <div className="links">
          <a href="#blind">Blind spot</a>
          <a href="#moonready">Readiness</a>
          <a href="#datalab">Data Lab</a>
          <a href="#checker">Checker</a>
          <a href="#nasa">For NASA</a>
          <a href="#explore">Explore</a>
          <a href="#ask">Ask</a>
          <a href="#insights">Insights</a>
        </div>
      </nav>

      <main className="page" id="main">
        <section className="hero">
          <div className="orbit-wrap">
            <div className="orbit o1"><i /></div>
            <div className="orbit o2"><i /></div>
            <div className="orbit o3"><i /></div>
            <motion.div
              className="flame"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 40, letterSpacing: "0.8em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "0.25em" }}
            transition={{ duration: 1.6, ease: "easeOut" }}
          >
            FLAMEGUARD
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            Crews will live on the Moon at 30% oxygen or more. Where is the
            fire data for that? FlameGuard summarizes, ranks and interprets
            NASA's combustion research to find out.
          </motion.p>
          <motion.div
            className="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div><b>{catalog.length}</b><span>NASA records</span></div>
            <div><b>{catalog.filter((c) => c.type === "incident").length}</b><span>real incidents</span></div>
            <div><b>{experiments.length}</b><span>investigations</span></div>
            <div><b>0</b><span>real partial-gravity datasets yet</span></div>
          </motion.div>
          <a href="#blind" className="btn">See the blind spot ↓</a>
          <p className="hint">Move your mouse. Click anywhere. Watch the asteroids.</p>
        </section>

        <section className="start" aria-label="Start here">
          <b>Short on time? Start here:</b>
          <a href="#blind">1. See the blind spot</a>
          <a href="#checker">2. Check a NASA table</a>
          <a href="#nasa">3. What NASA should do</a>
        </section>
        <Findings />
        <WhyDifferent />
        <MoonAtmosphere />


        <BlindSpot />
        <MoonReadiness />
        <Suspense fallback={<section id="datalab" style={{ minHeight: 500 }} />}><DataLab /></Suspense>
        <Suspense fallback={<section id="checker" style={{ minHeight: 400 }} />}><Checker /></Suspense>
        <Suspense fallback={<section id="nasa" style={{ minHeight: 400 }} />}><NasaBrief /></Suspense>

        <section id="explore" className="section">
          <h2>Find the research that matters</h2>
          <p className="lead">
            Filter by the job it does for crew safety, then search. Cards are
            ranked by how directly they address fire safety.
          </p>
          <div className="pills">
            {FILTERS.map(([key, label]) => (
              <button
                key={key}
                className={`chip ${filter === key ? "on" : ""}`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="filters">
            <input
              className="search"
              placeholder="Search fuel, hardware, smoke, oxygen..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <label className="slider">
              Min relevance: {minScore}
              <input
                type="range"
                min="1"
                max="5"
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="grid">
            {shown.map((item) => (
              <Float key={item.id} amp={9}>
                <ExperimentCard item={item} />
              </Float>
            ))}
          </div>
          {shown.length === 0 && <p className="answer-empty">No records match.</p>}
        </section>

        <Compare items={shown.length ? shown : catalog} />
        <Charts items={shown.length ? shown : catalog} />
        <AskData items={catalog} />
        <Insights />

        <footer className="footer">
          <p>
            <b>Sources:</b> NASA PSI tables PSI-22, PSI-25, PSI-39, PSI-68, PSI-102 and PSI-26 metadata; the
            E-FIELD 30-day ISS report; NASA's Researcher's Guide to Combustion Science; the challenge
            description. Every record links to its source.
          </p>
          <p>
            <b>Limits:</b> a curated sample, not the full archive. Readiness scores and recommendations are our
            own, not NASA ratings. The map covers PSI only. FLEX-2 gives test ranges, not per-run results.
          </p>
          <p>Built for the NASA Space Apps Challenge: Flame in Freefall.</p>
        </footer>
      </main>
    </>
  );
}
