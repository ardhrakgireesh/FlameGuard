# FlameGuard

Fire safety insights from NASA microgravity combustion data. Built for the NASA Space Apps Challenge: *Flame in Freefall*.

**Core idea:** crews will live on the Moon at 30% oxygen or more. FlameGuard shows where NASA's PSI database has fire evidence for that, and where it has none.

## What is inside
- **Blind-Spot map:** gravity x oxygen grid against real mission targets (Moon base, spacesuit).
- **Moon readiness ranking:** a transparent rubric with weight sliders that re-rank live.
- **Data Lab:** five real PSI tables (BASS-II, CFI, FLEX-2, E-FIELD, SAME) plus the hardware behind them.
- **PSI Table Checker:** drop in any PSI CSV; it scores model-readiness and lists duplicates, bad gas fractions and suspicious values. Runs in the browser; nothing is uploaded.
- **What this means for NASA:** three recommendations, a recommended column list, and a merged starter dataset (CSV).
- **Ask the data:** live calculations over the real tables, plus optional AI answers limited to FlameGuard's records.
- **Explore, Compare, Insights, Earth benefits** for the wider catalog.

## Data provenance
| Table | Source | How it was obtained |
|---|---|---|
| PSI-25 BASS-II | NASA PSI CSV | Generated from the file, not retyped |
| PSI-39 CFI | NASA PSI CSV | Generated from the file; 8 duplicate rows removed |
| PSI-22 E-FIELD | NASA 30-day ISS report | Copied by hand; totals checked on the page |
| PSI-102 SAME | NASA PSI table | Copied from a screenshot |
| PSI-68 FLEX-2 | NASA PSI table | Copied from a screenshot; ranges only; 1 of 9 rows not visible |

## Honest limits
A curated sample, not the full archive. Scores and recommendations are ours, not NASA's. No partial-gravity data exists in PSI yet. Partial-gravity studies may exist outside PSI.

## Run locally
```
npm install
npm run dev
```

## Deploy (Vercel, with optional AI)
1. Push this folder to GitHub, then import it at vercel.com (Vite is detected automatically).
2. Optional AI: Settings > Environment Variables > add `GEMINI_API_KEY` (key from aistudio.google.com), then redeploy. Without it, the site uses the keyword engine and still works.
3. Set a spend or quota limit on the key. The endpoint builds its context on the server and allows 6 questions per minute per visitor and 300 per day, but those counters are per server instance, so the key limit is the real protection.

Netlify or any static host also works for everything except the AI answers.

## Accessibility
Skip link, keyboard-reachable file drop zone, tab roles on the Data Lab, text alternatives on charts, reduced-motion support.
