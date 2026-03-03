# iranwarcost.com

A real-time tracker of estimated US military spending on the Iran conflict since January 2025. Every figure is sourced; every number is explained.

**Live site:** [iranwarcost.com](https://iranwarcost.com)

---

## Why this exists

In early March 2026, I read a news report about three US F-15s shot down by friendly fire near Kuwait. My first thought was: *what did those planes cost?* My second was: *what does all of this cost?* The answer was harder to find than it should be — scattered across congressional appropriations, Pentagon press releases, and defense research reports. This site puts it in one place, in plain numbers, with every source linked.

---

## What it tracks

The counter reflects estimated US direct spending since January 1, 2025, including:

| Component | Source | Est. |
|-----------|--------|------|
| FY2025 Foreign Military Financing for Israel (H.R.1968) | Congress.gov, CRS | $3.3B |
| US air defense costs — Twelve-Day War, June 2025 (THAAD, SM-3, etc.) | JINSA July 2025 | ~$3.5B |
| Operation Midnight Hammer (June 22, 2025) | CSIS, USAF | ~$400M |
| Operation Rough Rider — Houthi/Iran-proxy strikes, Mar–May 2025 | DoD estimates | ~$1.5B |
| FY2025 weapons drawdown transfers to Israel | DSCA notifications | ~$1B |
| US theater presence Jul 2025–Jan 2026 (2 CSG rotations) | USNI, DoD | ~$2B |
| Operation Epic Fury — 3 days at ~$200M/day + surge munitions | Unit costs, DoD | ~$4.3B |
| **Total anchor (March 2, 2026)** | | **~$16B** |

The live counter ticks at **$2,315/second** (~$200M/day), the estimated active combat operations rate since Operation Epic Fury began February 28, 2026.

**Not included in the counter:** long-term veteran healthcare and disability costs (historically 30–40% of total war cost), interest on war-related debt, intelligence operations. The true 10–20 year cost to taxpayers will be substantially higher.

---

## TODO / Research Queue

### Casualties (track for context, not cost)
- [ ] US KIA: currently **6** (as of March 3, 2026) — update as confirmed by CENTCOM
- [ ] US WIA: currently **18** (as of March 3, 2026)
- [ ] Consider adding a casualties line to the site (context, not cost — but drives long-term VA/disability costs)
- [ ] Long-term veteran healthcare: historically 30–40% of total war cost; no sourced figure yet

### Operation Epic Fury — untracked direct costs
- [ ] **Tomahawk depletion**: CENTCOM has NOT confirmed a total count. Open-source estimate: 200–400 fired in first 72 hrs across ~13 destroyers. Unit cost: $1.75–$2.2M (Block V; Marine Corps paid $2.2M/round). Range: **$350M–$880M**. Confirmed ships (USNI): USS Thomas Hudner, USS Frank E. Petersen Jr. (DDG-121), USS Winston S. Churchill (DDG-81), USS Spruance, USS Delbert D. Black (DDG-119). **Not firm enough for data.js yet — await CENTCOM BDA or congressional testimony.**
  - Sources: [USNI News fleet tracker](https://news.usni.org/2026/03/02/usni-news-fleet-and-marine-tracker-march-2-2026), [Army Recognition](https://www.armyrecognition.com/news/army-news/2026/u-s-conducts-tomahawk-cruise-missile-strikes-on-iranian-targets-under-operation-epic-fury), [19FortyFive](https://www.19fortyfive.com/2026/03/the-iran-war-means-the-u-s-navy-faces-a-tomahawk-missile-shortage-if-china-invades-taiwan/)
- [ ] **Tomahawk restocking**: RTX announced Feb 4, 2026 a DoD framework to scale production to 1,000+/yr (from ~72/yr) — "5 years to replenish" claim may be outdated. Monitor. Source: [Shephard Media](https://www.shephardmedia.com/news/naval-warfare/us-navy-confirms-award-of-contract-in-q2-fy2026-for-the-tomahawk-block-v-modernisation/)
- [ ] **LUCAS drones**: first combat use — unit cost and quantity not yet disclosed
- [ ] **HIMARS Precision Strike Missiles**: quantities and cost unknown
- [ ] **F-35 / F-22 / B-2 sortie costs**: ~30 F-35As, ~12 F-22s deployed; no per-sortie cost breakdown released
- [ ] **F-35 air-to-air kills**: F-35s shot down Iranian MiGs (first air-to-air kills for type) — any US aircraft shot down beyond the 3 F-15Es? No confirmed losses beyond F-15Es.
- [ ] **F-15E replacement cost**: $94M/aircraft × 3 = $282M not yet in tracker — source confirmed ([Air and Space Forces Magazine](https://www.airandspaceforces.com/new-acquisition-report-f-15ex-unit-cost/))

### Indirect costs / economic impact (not in tracker, but worth noting)
- [ ] Penn Wharton (PWBM): direct $40–95B, indirect $50–210B additional — source: [Fortune](https://fortune.com/2026/03/02/how-much-trump-iran-war-operation-epic-fury-cost-taxpayers/)
- [ ] Oil price shock: Strait of Hormuz disruption risk — ~20% of global oil flow; no settled cost figure yet
- [ ] Shipping/insurance premium spike: global trade disruption (war spans 11+ countries as of Mar 3)
- [ ] US embassy damage: Riyadh struck by drones March 3 — minor material damage, no cost estimate yet
- [ ] Interest on war-related emergency appropriations: no figure yet
- [ ] **Israeli ground incursion into Lebanon** (March 3): new front; US support costs TBD

### Chart improvements (r/dataisbeautiful feedback)
- [ ] **Thicker line + better contrast** — `borderWidth: 2` is too thin when image is compressed; try 2.5–3
- [ ] **Shaded bands instead of dotted verticals** for multi-day events (12-Day War, Op Rough Rider) — use `box` annotation type with low-opacity fill instead of stacked line annotations
- [ ] **Inline labels need to be self-explanatory** — "2 CSGs", "H.R.8034" mean nothing to a general audience; expand label text or add a subtitle line
- [ ] **Red dots** — add tooltip/legend clarifying what the data points represent
- [ ] **Y-axis doesn't start at $0** — add a chart subtitle or note explaining why (cost started at $26.38B with H.R.8034, not from zero)
- [ ] **Chart title** — add a standalone title: e.g. "US Direct Military Spending — Iran Conflict, April 2024–Present" so the chart reads without surrounding page context
- [ ] **Use vertical space better** — chart feels sparse; tighten y-axis max or add a projected range band

### Alternatives section — time-scale alignment
- [ ] **Scale comparisons to war duration, not 1 year** — the war has run ~2 years (Apr 2024–Mar 2026); "1 year of EPA budget" framing is misleading if comparing to a 2-year spend. Options:
  - Compute `warDurationYears = (Date.now() - trackerStart) / (365.25 * 86400000)` dynamically
  - Display as "X years of EPA budget" (e.g. 7.2×) — already done for EPA via `format: multiplier`
  - For per-unit items (healthcare, tuition, teachers): label could say "for 1 year" explicitly, or scale the count by war duration so the comparison is 1:1 in time
  - **Decision needed**: show what $43B buys in one year (current), OR show what the equivalent annual spend could have funded each year of the conflict (more honest comparison)

### Data freshness
- [ ] Update `anchor_date` / `anchor_amount` when new appropriations or confirmed expenditure totals are published
- [ ] Add March 3 event: 6th KIA confirmed, Riyadh embassy drone strike, Lebanon ground incursion

---

## Contributing

If you know of a documented cost item that should be included — a specific appropriation, a confirmed weapons expenditure, a credible cost estimate from a named source — please [open an issue](https://github.com/koverda/iranwarcost.com/issues/new?labels=data&title=Cost+item+suggestion).

Requirements for a contribution:
- A publicly available primary source (government document, congressional record, credible defense research organization)
- A specific dollar figure or a sourced range
- A date

We do not accept unsourced estimates, partisan framing, or figures from anonymous sources.

---

## Tech

- Pure HTML, CSS, and JavaScript — no framework, no build step
- [Chart.js](https://www.chartjs.org/) for the spending timeline chart
- [CountUp.js](https://inorganik.github.io/countUp.js/) for animated counters
- [Google Fonts](https://fonts.google.com/) — Oswald + Space Mono
- Hosted on [GitHub Pages](https://pages.github.com/)
- Built with [Claude Code](https://claude.ai/code)

---

## License

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — free to use, share, and adapt with attribution. See [LICENSE](LICENSE).
