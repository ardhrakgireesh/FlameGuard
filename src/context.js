// Context for the AI endpoint. Built on the server so the browser cannot send its own text.
import { catalog } from "./catalog.js";
import { bass2 } from "./bass2.js";
import { cfiRuns } from "./cfi.js";
import { efieldRuns } from "./efield.js";

export function buildContext() {
  const cat = catalog.map((c) => `[${c.short}] ${c.name}. Fuel: ${c.fuel}. Conditions: ${c.conditions}. Finding: ${c.key_finding} Implication: ${c.safety_implication} Source: ${c.source_url}`).join("\n");
  const maxB = Math.max(...bass2.map((r) => r.o2i)), minB = Math.min(...bass2.map((r) => r.o2i));
  const flames = efieldRuns.reduce((s, r) => s + r.flames, 0);
  return `${cat}\n\nTABLE FACTS (computed):\nBASS-II PSI-25: ${bass2.length} burns, starting oxygen ${minB}-${maxB}%, no outcome column.\nCFI PSI-39: ${cfiRuns.length} tests, oxygen 17 or 21%, pressure 0.5-5 atm.\nE-FIELD PSI-22: ${flames} flames on ${efieldRuns.length} days, 21% oxygen coflow.\nFLEX-2 PSI-68: table lists oxygen 0.17-0.30 and 0.5-3 atm as ranges, not per-run results.\nMoon base target (NASA brief): 30%+ oxygen, 10.2 psi or less. No partial-gravity data in PSI yet.`;
}
