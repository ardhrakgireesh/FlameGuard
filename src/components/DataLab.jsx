import { useState } from "react";
import EfieldData from "./EfieldData";
import CfiData from "./CfiData";
import SameData from "./SameData";
import Flex2Data from "./Flex2Data";
import Bass2Data from "./Bass2Data";
import Facilities from "./Facilities";

const TABS = [
  ["bass2", "BASS-II · solids", Bass2Data],
  ["cfi", "CFI · droplets", CfiData],
  ["flex2", "FLEX-2 · range to 30% O₂", Flex2Data],
  ["efield", "E-FIELD · ISS flames", EfieldData],
  ["same", "SAME · smoke", SameData],
  ["hw", "Hardware", Facilities],
];

export default function DataLab() {
  const [tab, setTab] = useState("bass2");
  const Active = TABS.find((t) => t[0] === tab)[2];
  return (
    <section id="datalab" className="section" style={{ paddingBottom: 0 }}>
      <h2>Data Lab: real NASA tables</h2>
      <p className="lead">
        Five PSI experimental tables and the hardware behind them, read from
        NASA's own files. Pick one.
      </p>
      <div className="pills" role="tablist" aria-label="PSI tables">
        {TABS.map(([k, label]) => (
          <button key={k} role="tab" id={`tab-${k}`} aria-selected={tab === k} aria-controls="lab-panel" className={`chip ${tab === k ? "on" : ""}`} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>
      <div className="lab-body" role="tabpanel" id="lab-panel" aria-labelledby={`tab-${tab}`}><Active /></div>
    </section>
  );
}
