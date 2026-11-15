import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = {
  incident: "#ff9a3c",
  prevention: "#7fc4ff",
  detection: "#c9a6ff",
  suppression: "#6ee7b7",
};

export default function Charts({ items }) {
  const data = [...items]
    .sort((a, b) => b.concern_score - a.concern_score)
    .map((i) => ({
      name: i.short,
      full: i.name,
      score: i.concern_score,
      category: i.category,
    }));

  const incidents = items
    .filter((i) => i.type === "incident" && i.year)
    .sort((a, b) => a.year - b.year);

  return (
    <section id="charts" className="section">
      <h2>The data at a glance</h2>

      <div className="panel">
        <h3>Fire safety relevance by item</h3>
        <div style={{ width: "100%", height: 320 }}>
          <div role="img" aria-label="Chart comparing the listed investigations by relevance score and category. The same facts are in the comparison table above." style={{ width: "100%", height: "100%" }}><ResponsiveContainer>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#aab4e6"
                tick={{ fontSize: 11 }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} stroke="#aab4e6" />
              <Tooltip
                contentStyle={{
                  background: "#0b1230",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 8,
                  color: "#e8ecff",
                }}
                formatter={(v) => [`${v} / 5`, "Score"]}
                labelFormatter={(l, p) => p?.[0]?.payload?.full || l}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {data.map((d, i) => (
                  <Cell key={i} fill={COLORS[d.category]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer></div>
        </div>
        <div className="legend">
          <span><i style={{ background: COLORS.incident }} /> Incident</span>
          <span><i style={{ background: COLORS.prevention }} /> Prevention</span>
          <span><i style={{ background: COLORS.detection }} /> Detection</span>
          <span><i style={{ background: COLORS.suppression }} /> Suppression</span>
        </div>
        <p className="small">
          Scores are our own rubric, not an official NASA rating. Incidents:
          how severe. Experiments: how directly they address fire safety for
          crewed spacecraft and bases.
        </p>
      </div>

      <div className="panel">
        <h3>Real spacecraft fire and oxygen incidents</h3>
        <div className="timeline">
          {incidents.map((i) => (
            <div key={i.id} className="tl-item">
              <div className="tl-dot" />
              <div className="tl-year">{i.year}</div>
              <div className="tl-name">{i.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
