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

MIT — see [LICENSE](LICENSE)
