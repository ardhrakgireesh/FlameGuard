// REAL NASA DATA. Source: ACME/E-FIELD Flames 30-day Operational Accomplishments Report
// for ISS Increments 55 and 56 (15 Nov 2018), Table 1, and NASA PSI investigation PSI-22.
// Copied row by row. "conc" is the fuel concentration (diluted with nitrogen, by volume).
export const PSI22_URL = "https://psi.nasa.gov/physci/repo/data/investigations/PSI-22";

export const efieldRuns = [
  { day: "18073", date: "14 Mar", round: 1, burner: "coflow", polarity: "negative", fuel: "Methane", bottle: "100% CH4", conc: "100%", flames: 10 },
  { day: "18078", date: "19 Mar", round: 1, burner: "coflow", polarity: "negative", fuel: "Methane", bottle: "100% CH4", conc: "70%, 100%", flames: 10 },
  { day: "18080", date: "21 Mar", round: 1, burner: "coflow", polarity: "negative", fuel: "Methane", bottle: "40% CH4", conc: "40%", flames: 8 },
  { day: "18087", date: "28 Mar", round: 1, burner: "coflow", polarity: "negative", fuel: "Ethylene", bottle: "100% C2H4", conc: "80%, 100%", flames: 10 },
  { day: "18092", date: "2 Apr", round: 1, burner: "coflow", polarity: "negative", fuel: "Ethylene", bottle: "30% C2H4", conc: "30%", flames: 11 },
  { day: "18095", date: "5 Apr", round: 1, burner: "coflow", polarity: "positive", fuel: "Ethylene", bottle: "30% C2H4", conc: "30%", flames: 10 },
  { day: "18102", date: "12 Apr", round: 1, burner: "coflow", polarity: "positive", fuel: "Methane", bottle: "40% CH4", conc: "40%", flames: 8 },
  { day: "18106", date: "16 Apr", round: 1, burner: "coflow", polarity: "positive", fuel: "Methane", bottle: "40% CH4", conc: "40%", flames: 13 },
  { day: "18113", date: "23 Apr", round: 1, burner: "coflow", polarity: "positive", fuel: "Methane", bottle: "100% CH4", conc: "100%", flames: 15 },
  { day: "18130", date: "10 May", round: 1, burner: "coflow", polarity: "positive", fuel: "Methane", bottle: "100% CH4", conc: "70%", flames: 13 },
  { day: "18137", date: "17 May", round: 1, burner: "coflow", polarity: "positive", fuel: "Ethylene", bottle: "100% C2H4", conc: "80%, 100%", flames: 12 },
  { day: "18269", date: "26 Sep", round: 2, burner: "gas-jet", polarity: "negative", fuel: "Methane", bottle: "40% CH4", conc: "40%", flames: 11 },
  { day: "18274", date: "1 Oct", round: 2, burner: "gas-jet", polarity: "negative", fuel: "Ethylene", bottle: "30% C2H4", conc: "30%", flames: 11 },
];

// Numbers NASA states in the report text (used to cross-check the table).
export const efieldReport = {
  totalFlames: 142,
  firstRoundFlames: 120,
  coflowOxygenPercent: 21,
  maxVolts: 10000,
};
