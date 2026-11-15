// Every record is written in our own words from NASA material (the Glenn combustion
// pages, the Apollo and Mir pages, and the Space Apps challenge brief).
// Leave a field empty ("") when NASA's text does not state it. Never guess.
//
// concern_score (1-5) is OUR OWN rubric, not an official NASA rating:
//   incidents   -> how severe the fire or oxygen event was
//   experiments -> how directly the work addresses fire safety for crewed spacecraft and bases
//
// category: prevention | detection | suppression | incident
// planned: true means NASA expects the data later and it is not yet available.

const GUIDE = "https://www.nasa.gov/missions/station/a-researchers-guide-to-combustion-science/";
const BRIEF = "https://psi.nasa.gov/physci/repo/search?q=combustion";

export const catalog = [
  {
    id: 1,
    name: "Apollo 1 cabin fire",
    short: "Apollo 1",
    type: "incident",
    category: "incident",
    year: 1967,
    fuel: "Cabin materials",
    hardware: "",
    conditions: "Pure oxygen cabin atmosphere",
    key_finding:
      "During a ground test with the cabin full of pure oxygen, a flash fire spread in seconds. Heat and pressure cracked the cabin, and the crew died from toxic gases.",
    safety_implication:
      "Pure oxygen makes fires spread extremely fast. NASA reduced combustible materials, added fire-resistant suits and built a hatch that opens in 3 seconds.",
    concern_score: 5,
    source_url: "https://sma.nasa.gov/sma-disciplines/accllp/apollo-1",
  },
  {
    id: 2,
    name: "Apollo 13 oxygen tank explosion",
    short: "Apollo 13",
    type: "incident",
    category: "incident",
    year: 1970,
    fuel: "Teflon wire insulation",
    hardware: "",
    conditions: "Oxygen tank",
    key_finding:
      "An overheated oxygen tank damaged its insulation during a ground test, and the tank exploded in flight. It was an explosion, not a cabin fire.",
    safety_implication:
      "Heat, electrical parts and oxygen together are dangerous. Tanks were redesigned with upgraded thermostats and stainless steel covering on the wiring.",
    concern_score: 3,
    source_url: "https://sma.nasa.gov/sma-disciplines/accllp/apollo-13",
  },
  {
    id: 3,
    name: "Mir space station fire",
    short: "Mir",
    type: "incident",
    category: "incident",
    year: 1997,
    fuel: "Solid-fuel oxygen generator canister",
    hardware: "",
    conditions: "",
    key_finding:
      "An oxygen generator canister burst into flame, throwing a flame about three feet long and filling the station with smoke. It blocked the route to an escape capsule. The crew fought it with extinguishers.",
    safety_implication:
      "Equipment that makes oxygen can itself start a fire. The likely cause was contamination by latex glove material, so canister preparation was changed.",
    concern_score: 5,
    source_url:
      "https://www.nasa.gov/history/25-years-ago-fire-aboard-space-station-mir/",
  },
  {
    id: 4,
    name: "BASS and BASS-II: Burning and Suppression of Solids",
    short: "BASS",
    type: "experiment",
    category: "prevention",
    year: 2009,
    fuel: "Cotton-fiberglass fabric (75% / 25% by mass), Nomex fabric, Ultem; also spheres and cylinders",
    hardware: "Microgravity Science Glovebox, ISS; small flow duct (76 mm x 76 mm), variable-speed fan",
    conditions: "BASS-II (PSI-25) table: 129 tests in 2014 at 13.6-22.2% starting oxygen, with oxygen, CO2 and CO measured before and after. Airflow up to 40 cm/s, opposed or concurrent to flame spread. Oxygen: ISS air (21%), and 17% by adding nitrogen (Researcher's Guide). Not stated in PSI-26 metadata",
    key_finding:
      "Tests whether materials burn as well in microgravity as in normal gravity, and how an inert gas puts flames out. NASA's current materials test (NASA-STD-6001 Test 1) ignores low-gravity effects. BASS results feed models of heat release in spacecraft fires. NASA's Researcher's Guide says recent BASS results indicate Test 1 is not conservative: materials can burn at lower oxygen in microgravity than on Earth. A nitrogen jet aimed at a flame can even strengthen it by pulling in oxygen.",
    safety_implication:
      "Shows which materials are safe to bring into a crewed spacecraft or base. Material choice is the main way to prevent fires.",
    concern_score: 5,
    source_url: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-25",
  },
  {
    id: 5,
    name: "Saffire-I, II and III: Spacecraft Fire Safety Demonstration",
    short: "Saffire",
    type: "experiment",
    category: "prevention",
    fuel: "Solid materials such as fabrics and plastics",
    hardware: "",
    conditions: "",
    key_finding:
      "Fire safety demonstrations that studied how solid materials burn in spacecraft conditions. NASA's brief groups them with BASS as the main flammability studies.",
    safety_implication:
      "Gives direct evidence for material selection. Open the NASA summary to add specific results.",
    concern_score: 5,
    source_url:
      "https://www.nasa.gov/wp-content/uploads/2025/07/spacecraft-fire-safety-demonstration-saffire.pdf",
  },
  {
    id: 6,
    name: "SAME and SAME-R: Smoke Aerosol Measurement Experiment",
    short: "SAME",
    psi: "PSI-102",
    papers: 10,
    type: "experiment",
    category: "detection",
    fuel: "Teflon, Kapton, silicone rubber, lampwick, dibutyl phthalate (PSI-102 table)",
    hardware: "Microgravity Science Glovebox, ISS (flown 2007 and 2010)",
    conditions: "PSI-102 table: airflow 5 and 10 cm/s; sample weight-loss rate 1 and 2 mg/min; aging 1 and 20 min. No oxygen column. Igniter on 15-60 s, events about 2 min; smoke read by two detectors and an electron microscope. Hypothesis: low-gravity smoke particles grow larger than in 1 g",
    key_finding:
      "Tested fire detection in microgravity by studying the smoke different materials make. Hydrocarbon fuels make soot, while plastics make droplets of recondensed polymer fragments.",
    safety_implication:
      "Spacecraft smoke detectors must catch several kinds of smoke, not just one.",
    concern_score: 5,
    source_url:
      "https://psi.nasa.gov/physci/repo/data/investigations/PSI-102",
  },
  {
    id: 7,
    name: "DAFT and DAFT-2: Dust and Aerosol Measurement Feasibility Test",
    short: "DAFT",
    type: "experiment",
    category: "detection",
    fuel: "",
    hardware: "Smoke instrument from SAME, reused to detect dust",
    conditions: "Measured background aerosol particle levels on the ISS",
    key_finding:
      "Used one of the smoke detection instruments from SAME to detect dust instead, and checked that it works in microgravity.",
    safety_implication:
      "Smoke and dust sensors must be proven in microgravity before they are trusted on a mission.",
    concern_score: 3,
    source_url:
      "https://www.nasa.gov/wp-content/uploads/2025/07/dust-and-aerosol-measurement-feasibility-test-daft.pdf",
  },
  {
    id: 8,
    name: "FLEX and FLEX-2: Flame Extinguishment Experiment",
    short: "FLEX",
    type: "experiment",
    category: "suppression",
    year: 2007,
    psi: "PSI-69",
    papers: 45,
    fuel: "Burning droplets of liquid fuel",
    hardware: "Multi-user Droplet Combustion Apparatus (MDCA) in the Combustion Integrated Rack (PSI-69)",
    conditions: "PSI-68 (FLEX-2) table: oxygen 0.17-0.30 in O2/N2 or O2/He, 0.5-3 atm, 25 C, flow 0.1-5 cm/s, droplets 1.5-5 mm. PSI-69: finds the Limiting Oxygen Index (LOI) versus pressure (0.5-1.5 atm) using droplets of about 3 mm and suppressants CO2, He and SF6. Researcher's Guide adds: Heptane and methanol droplets (1-5 mm); chamber diluted with nitrogen, carbon dioxide, helium or xenon; hardware allows up to 40% oxygen at 0-3 atm. FLEX-2 figure: ethanol at 30% oxygen, 2.4 atm",
    key_finding:
      "Tested how to put flames out by diluting the chamber atmosphere with carbon dioxide and with helium. Both suppress fire. The Researcher's Guide reports the flammability limit is lower in reduced gravity, so Earth-based suppressant standards do not give the same safety margin. FLEX also found cool flames that keep vaporizing fuel after the visible flame goes out.",
    safety_implication:
      "Gives targets for how much oxygen to remove, or which gas to release, to stop a fire.",
    concern_score: 4,
    source_url:
      "https://psi.nasa.gov/physci/repo/data/investigations/PSI-69",
  },
  {
    id: 9,
    name: "CFI-G: Cool Flames Investigation with Gases (part of ACME)",
    short: "CFI-G",
    psi: "PSI-159",
    papers: 2,
    type: "experiment",
    category: "prevention",
    fuel: "Nitrogen and a flammable gas such as propane",
    hardware: "ACME modular hardware in the Combustion Integrated Rack",
    conditions: "Oxygen-nitrogen mixture of up to 85% oxygen",
    key_finding:
      "PSI-159 aims to find when cool diffusion flames occur for propane, n-butane and n-pentane, in normal and inverse flames, for a range of dilutions, flow rates and pressures (funded by NSF and CASIS; motivated by engine efficiency). The 85% oxygen figure comes from the challenge brief, not the PSI-159 metadata. Made the microgravity tests with the highest oxygen concentrations: oxygen-rich gas flowed out of a spherical burner, creating an inside-out flame.",
    safety_implication:
      "Moon habitats are expected to use more oxygen than Earth air, so tests at high oxygen are the closest match for that case.",
    concern_score: 4,
    source_url: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-159",
  },
  {
    id: 10,
    name: "E-FIELD Flames (ACME)",
    short: "E-FIELD",
    type: "experiment",
    category: "prevention",
    year: 2018,
    fuel: "Methane and ethylene, diluted with nitrogen",
    hardware: "ACME hardware in the Combustion Integrated Rack, ISS",
    conditions: "Microgravity, coflow air 21% oxygen, electric field up to 10,000 V",
    key_finding:
      "Used an electric field on flame ions to mimic partial gravity. NASA's report records 142 flames ignited on 13 test days in 2018. The oxygen level is in the report text, not in the PSI data table.",
    safety_implication:
      "A first stand-in for partial gravity, since real Moon and Mars gravity data does not exist yet.",
    concern_score: 3,
    source_url: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-22",
  },
  {
    id: 17,
    name: "CFI: Cool Flames Investigation (PSI-39)",
    short: "CFI",
    type: "experiment",
    category: "prevention",
    year: 2017,
    psi: "PSI-39",
    fuel: "n-dodecane and dodecane / iso-dodecane blends, burned as droplets (some on a fiber)",
    hardware: "Multi-user Droplet Combustion Apparatus in the Combustion Integrated Rack",
    conditions: "0.5-5 atm; 17% and 21% oxygen; nitrogen, with helium added in some tests (up to 59%)",
    key_finding: "NASA's Experimental Table lists pressure, oxygen, nitrogen and helium for each test, so this record is model-ready. Cool flames can keep burning fuel after the visible flame is gone.",
    safety_implication: "Shows how pressure and diluent change droplet burning. No tests at 30%+ oxygen appear in this table.",
    concern_score: 3,
    source_url: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-39",
  },
  {
    id: 16,
    name: "BRE: Burning Rate Emulator (ACME)",
    short: "BRE",
    type: "experiment",
    category: "prevention",
    fuel: "Gaseous fuels",
    hardware: "ACME hardware in the Combustion Integrated Rack",
    conditions: "Still atmospheres",
    key_finding:
      "The Burning Rate Emulator used gas flames to study how material flammability in still air depends on material properties.",
    safety_implication:
      "Gives a way to study flammability without testing every material.",
    concern_score: 3,
    source_url: BRIEF,
  },
  {
    id: 11,
    name: "SPICE and SLICE: Smoke Point and Flame Structure",
    short: "SPICE/SLICE",
    type: "experiment",
    category: "prevention",
    fuel: "Solid and gaseous fuels",
    hardware: "Microgravity Science Glovebox, fan-driven flow duct built for SPICE",
    conditions: "",
    key_finding:
      "Studied the smoke point in co-flow (SPICE) and the structure and liftoff of flames (SLICE). NASA says investigations like these are relevant to fire safety, but less directly.",
    safety_implication:
      "Background science that supports flame and smoke models.",
    concern_score: 2,
    source_url: BRIEF,
  },
  {
    id: 12,
    name: "SoFIE: Solid Fuel Ignition and Extinction",
    short: "SoFIE",
    type: "experiment",
    category: "prevention",
    fuel: "Solid fuels; plastics such as PMMA or Delrin are the likely candidates (planned)",
    hardware: "CIR insert plus a larger flow duct in the MSG (planned as of the 2015 guide)",
    conditions: "Planned: 10-40% oxygen, 0.2-1.5 atm, airflow 0-30 cm/s (the spacecraft ventilation range)",
    key_finding:
      "Studies how fire grows and how it can be stopped in space. NASA approves materials with a flame test in normal gravity, and some researchers think that test is not cautious enough for low gravity.",
    safety_implication:
      "A material that passes on Earth may be riskier in microgravity, so materials need testing under low gravity too.",
    concern_score: 4,
    source_url:
      "https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/solid-fuel-ignition-and-extinction-sofie/",
  },
  {
    id: 13,
    name: "FLARE: Flammability Limits At Reduced-g",
    short: "FLARE",
    type: "experiment",
    category: "prevention",
    fuel: "Solid materials",
    hardware: "",
    conditions: "",
    key_finding:
      "Builds a method to link how flammable a material is on Earth to how flammable it is in microgravity, so space limits can be estimated from ground data. An international team works on it.",
    safety_implication:
      "If proven, cheap ground tests could predict space fire risk without a space experiment for every material.",
    concern_score: 4,
    source_url:
      "https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/flammability-limits-at-reduced-g-experiment-flare/",
  },
  {
    id: 14,
    name: "FM2: Flammability of Materials on the Moon",
    short: "FM2",
    type: "experiment",
    category: "prevention",
    planned: true,
    fuel: "Burning materials",
    hardware: "",
    conditions: "Lunar gravity, one sixth of Earth's",
    key_finding:
      "The first combustion experiment on another planetary body. NASA expects partial-gravity data from it, but none is available in PSI yet.",
    safety_implication:
      "Moon bases need fire rules for 1/6 gravity, which is neither Earth gravity nor microgravity.",
    concern_score: 5,
    source_url:
      "https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/flammability-of-materials-on-the-moon-fm2/",
  },
  {
    id: 15,
    name: "LUCI: Lunar-g Combustion Investigation",
    short: "LUCI",
    type: "experiment",
    category: "prevention",
    planned: true,
    fuel: "",
    hardware: "",
    conditions: "Lunar gravity",
    key_finding:
      "A planned investigation. NASA expects partial-gravity combustion data from LUCI and FM2 to be added to PSI in the future.",
    safety_implication:
      "Will fill the biggest data gap for Moon and Mars bases.",
    concern_score: 5,
    source_url: BRIEF,
  },
];

// The Moon-base atmosphere numbers come from the NASA challenge brief.
export const atmospheres = [
  {
    key: "earth",
    name: "Earth, sea level",
    o2: 21,
    psi: 14.7,
    note: "The reference. Most fire safety rules and flame tests are built on this.",
  },
  {
    key: "moon",
    name: "Moon base and rover (expected)",
    o2: 30,
    psi: 10.2,
    note: "Expected to be 30% oxygen or more at 10.2 psi or less. Materials become much more flammable.",
  },
  {
    key: "suit",
    name: "Spacesuit",
    o2: 100,
    psi: 4.3,
    note: "100% oxygen at only 4.3 psi, so suits stay flexible. Astronauts pre-breathe oxygen to avoid the bends.",
  },
  {
    key: "acme",
    name: "Highest microgravity test (CFI-G)",
    o2: 85,
    psi: null,
    note: "Oxygen-nitrogen mixture of up to 85% oxygen. Pressure is not stated in the brief.",
  },
];

// Insights. Each points to the catalog records that support it.
export const insights = [
  {
    title: "Moon bases will be more flammable than Earth air",
    body: "To make spacesuit use faster, NASA expects Moon bases and rovers at 30% oxygen or more and 10.2 psi or less. That is more than a 40% rise in oxygen compared with Earth air, and flammability depends strongly on oxygen concentration.",
    action:
      "Choose materials and test them at the expected Moon atmosphere, not at Earth air.",
    support: [9, 4, 5],
  },
  {
    title: "The biggest gap: no partial-gravity data yet",
    body: "PSI has microgravity and normal-gravity results but no Moon or Mars gravity data. NASA expects it from LUCI and FM2, and E-FIELD Flames mimics partial gravity with an electric field. Microgravity and normal-gravity results could bound what happens in between.",
    action:
      "Use the two known ends as safe bounds until LUCI and FM2 report.",
    support: [14, 15, 10],
  },
  {
    title: "Earth flame tests may under-estimate space fire risk",
    body: "Materials are approved with a flame test in normal gravity, and some researchers think that is not cautious enough for low gravity. FLARE tries to link ground flammability to microgravity flammability.",
    action:
      "Test key materials in low gravity, and use FLARE-style links to scale up cheaply.",
    support: [12, 13],
  },
  {
    title: "Smoke detectors must see more than one kind of smoke",
    body: "Hydrocarbon fuels make soot and plastics make droplets of polymer fragments. A detector tuned to one can miss the other, so detection needs several sensing methods.",
    action: "Prove each sensor in microgravity, as SAME and DAFT did.",
    support: [6, 7],
  },
  {
    title: "Two gases that put fires out: carbon dioxide and helium",
    body: "FLEX diluted the chamber atmosphere with carbon dioxide and with helium, and both suppress fire. For a crew with nowhere to escape to, suppression is the last line of defense.",
    action:
      "Size suppression systems from FLEX-style limits for each habitat atmosphere.",
    support: [8],
  },
  {
    title: "Oxygen equipment and escape routes decide survival",
    body: "Apollo 1 burned in a pure oxygen cabin with a slow hatch, and the Mir flame came from an oxygen generator and blocked the way to an escape capsule.",
    action:
      "Keep oxygen equipment clean and backed up, and keep every exit free of it.",
    support: [1, 2, 3],
  },
  {
    title: "Three fire myths NASA had to disprove",
    body: "NASA's Researcher's Guide lists three old misconceptions: that a steady fire cannot exist in still microgravity, that a fire dies if ventilation is shut off, and that low gravity makes terrestrial fire tests very conservative. A candle flame in microgravity burned for over 45 minutes in some tests, and BASS results suggest the Earth test is not conservative.",
    action: "Do not assume shutting off fans or relying on Earth ratings is enough.",
    support: [4, 12, 8],
  },
  {
    title: "Spraying suppressant at one spot can backfire",
    body: "On Earth, extinguishers attack the base of a flame. In microgravity the best point is unclear, and early BASS results showed that a local nitrogen jet can strengthen a flame by entraining oxygen, even sustaining it with the ambient flow off.",
    action: "Prefer total-flooding or well-tested suppression layouts, and test nozzle placement in low gravity.",
    support: [4, 8],
  },
];

// Fire safety technology that came back to Earth (from the NASA challenge brief).
export const earthUses = [
  {
    icon: "💧",
    title: "Fine-water-mist extinguishers",
    text: "The Mist experiment (2003) studied water droplets against flames to replace banned Halon. Non-toxic water-mist extinguishers were certified for spaceflight, and the first two of nine reached the ISS in Dec 2015 to replace CO2 units (Researcher's Guide).",
  },
  {
    icon: "🚨",
    title: "Smoke detection",
    text: "A shuttle-era Brunswick Incipient Fire Detector tells combustion particles from dust, so it gives fewer false alarms, and can serve mines and large areas (NASA Spinoff, 1978). NASA-FAA tests also found a newer particulate-plus-gas sensor beat aircraft smoke detectors.",
  },
  {
    icon: "🧑‍🚒",
    title: "Firefighter gear",
    text: "Project FIRES used Apollo-era heat-protective materials for firefighter gear (Spinoff, 1982). A NASA-Johnson air tank held 30 minutes of air at 20 lb, 13 lb lighter, at 4,500 psi (Spinoff, 1976).",
  },
];
