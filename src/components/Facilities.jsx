const ROWS = [
  ["MDCA (in CIR)", "FLEX, FLEX-2", "Up to 40% oxygen, 0-3 atm", "254 kg", "0.73 kW", "Operating", "Analog color camera, radiometer, low-light UV camera"],
  ["ACME (in CIR)", "BRE, CLD Flame, E-FIELD, Flame Design, s-Flame", "Gaseous fuels, 100 L chamber", "250 kg", "0.75 kW", "Planned in 2015", "Radiometers, color cameras, photomultiplier tubes, ion current, gas chromatograph"],
  ["SoFIE (in CIR)", "Flame Spread, GEL, Narrow Channel, SMuRF, MIST", "10-40% oxygen, 0.2-1.5 atm, flow 0-30 cm/s", "250 kg", "0.75 kW", "Planned in 2015", "Same as ACME"],
  ["MSG flow duct", "SPICE, SLICE, BASS (and SAME)", "ISS air, 21% oxygen, 1 atm; 17% with nitrogen", "40 kg", "0.05 kW", "Operating", "Still and video cameras, airflow, fuel flow, radiometer"],
];
const H = ["Facility", "Experiments", "Atmosphere", "Up mass", "Power", "Status (2015)", "Diagnostics"];

export default function Facilities() {
  return (
    <section id="hardware" className="section">
      <h2>Hardware behind the data</h2>
      <p className="lead">
        Which facility produced which investigation, and what atmosphere it
        can reach. This answers "which results can be compared", because
        tests in the same hardware share conditions.
      </p>
      <div className="table-wrap">
        <table style={{ minWidth: 820 }}>
          <thead><tr>{H.map((h) => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>{ROWS.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{i === 0 ? <b>{c}</b> : c}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <p className="small">
        Source:{" "}
        <a className="lnk" target="_blank" rel="noreferrer"
          href="https://www.nasa.gov/missions/station/a-researchers-guide-to-combustion-science/">
          NASA, A Researcher's Guide to Combustion Science (2015), appendix and facility pages
        </a>. The CIR has a 100 L chamber with eight windows; the MSG has a
        255 L workspace. "Planned" status is as of 2015 and may have changed.
        Only the SoFIE row reaches the Moon-like 30%+ oxygen range
        by design, along with FLEX-2 and CFI-G in flight.
      </p>
    </section>
  );
}
