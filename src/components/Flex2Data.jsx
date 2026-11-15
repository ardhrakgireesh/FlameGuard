// Copied from the PSI-68 (FLEX-2) Experimental Table, read from a clear screenshot.
// The table gives ranges shared by all fuels, not one row per run.
const FUELS = [
  ["Iso-octane", "pure"], ["n-Octane", "pure"], ["Heptane", "pure"], ["Decane", "pure"], ["Ethanol", "pure"],
  ["Propanol 95% / glycerol 5%", "mixture"], ["Heptane 50% / iso-octane 50%", "mixture"], ["Propanol 80% / glycerol 20%", "mixture"],
];
const ENV = [
  ["Initial droplet diameter", "1.5 - 5 mm"],
  ["Ambient gas", "O2/N2 or O2/He"],
  ["Oxygen mole fraction", "0.17, 0.21, 0.25 or 0.30"],
  ["Ambient pressure", "0.5, 1.0, 1.5, 2.0 or 3.0 atm"],
  ["Ambient temperature", "25 C"],
  ["Flow velocity", "0.1 - 5 cm/s"],
];
const URL = "https://psi.nasa.gov/physci/repo/data/investigations/PSI-68";

export default function Flex2Data() {
  return (
    <section id="flex2data" className="section">
      <h2>FLEX-2: the first test range that reaches 30% oxygen (PSI-68)</h2>
      <p className="lead">
        NASA's table for the droplet experiment lists oxygen up to 0.30 and
        pressures from 0.5 to 3 atm. The Moon base is expected at 30% oxygen
        or more and 10.2 psi or less.
      </p>
      <div className="stats rd-stats">
        <div><b>30%</b><span>top oxygen level in table</span></div>
        <div><b>0.5-3</b><span>atm pressure range</span></div>
        <div><b>~0.69</b><span>atm = Moon base 10.2 psi</span></div>
      </div>
      <div className="panel">
        <h3>Test conditions shared by every fuel</h3>
        <table style={{ minWidth: 0 }}>
          <tbody>{ENV.map(([k, v]) => <tr key={k}><td><b>{k}</b></td><td>{v}</td></tr>)}</tbody>
        </table>
        <h3 style={{ marginTop: 18 }}>Fuels listed</h3>
        <div className="pills">
          {FUELS.map(([n, t]) => <span key={n} className={`chip ${t === "mixture" ? "on" : ""}`}>{n}</span>)}
        </div>
      </div>
      <p className="small">
        Source: <a className="lnk" href={URL} target="_blank" rel="noreferrer">NASA PSI-68 Experimental Table</a>.
        These are ranges for the investigation, not results for individual runs, so we do not claim
        every oxygen and pressure pair was burned. The page footer says "1 - 9 of 9" rows, but only 8 fuels were
        visible in our screenshot. 10.2 psi / 14.7 psi = 0.69 atm is our arithmetic; it sits between the
        0.5 and 1.0 atm points. Heptane and the other fuels are liquids burned as droplets, not
        spacecraft materials, so this informs flammability limits more than material selection.
      </p>
    </section>
  );
}
