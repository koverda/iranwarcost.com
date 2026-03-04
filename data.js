const SITE_DATA = {
  "meta": {
    "anchor_date": "2026-03-04T00:00:00Z",
    "anchor_amount": 44900000000,
    "burn_rate_halflife_days": 30,
    "us_taxpayers": 150000000,
    "tracker_start": "2024-04-20",
    "tracker_start_label": "April 20, 2024"
  },

  "cost_breakdown": [
    {
      "component": "H.R.8034 Israel Security Supplemental: FMF, Iron Dome, war reserve restocking (Apr 2024)",
      "source": "Congress.gov, CBO",
      "estimate_usd": 26380000000,
      "estimate_label": "$26.38B"
    },
    {
      "component": "US interceptor costs: Op. True Promise II + Oct–Dec 2024 theater ops",
      "source": "DoD estimates, USNI News",
      "estimate_usd": 600000000,
      "estimate_label": "~$0.6B"
    },
    {
      "component": "FY2025 Foreign Military Financing for Israel (H.R.1968)",
      "source": "Congress.gov, CRS RL33222",
      "estimate_usd": 3300000000,
      "estimate_label": "$3.3B"
    },
    {
      "component": "US air defense: Twelve-Day War (THAAD, SM-3, PAC-3, SM-6)",
      "source": "JINSA July 2025 Report",
      "estimate_usd": 3500000000,
      "estimate_label": "~$3.5B"
    },
    {
      "component": "Operation Midnight Hammer: B-2 sorties, GBU-57 MOPs, Tomahawks (June 22)",
      "source": "CSIS, USAF Fact Sheet, unit costs",
      "estimate_usd": 400000000,
      "estimate_label": "~$400M"
    },
    {
      "component": "Operation Rough Rider: Houthi strikes, Mar–May 2025",
      "source": "DoD / media estimates",
      "estimate_usd": 1500000000,
      "estimate_label": "~$1.5B"
    },
    {
      "component": "FY2025 weapons drawdown transfers to Israel",
      "source": "Pentagon DSCA notifications",
      "estimate_usd": 1000000000,
      "estimate_label": "~$1B"
    },
    {
      "component": "US theater force presence, Jul 2025–Jan 2026 (2 CSG rotations)",
      "source": "USNI News, DoD cost-per-day estimates",
      "estimate_usd": 2000000000,
      "estimate_label": "~$2B"
    },
    {
      "component": "Operation Epic Fury: 3 days at ~$200M/day + surge munitions (Feb 28–Mar 2)",
      "source": "Published unit costs, DoD statements",
      "estimate_usd": 4300000000,
      "estimate_label": "~$4.3B"
    },
    {
      "component": "US equipment destroyed by Iranian retaliatory strikes: AN/FPS-132, AN/TPY-2 radars, SATCOM (Feb 28–Mar 4)",
      "source": "NYT satellite imagery, TRT World, Defence Security Asia",
      "estimate_usd": 1900000000,
      "estimate_label": "~$1.9B"
    }
  ],

  "alternatives": [
    {
      "key": "health",
      "icon": "🏥",
      "cost_per_unit": 14570,
      "label": "Americans' full annual healthcare costs covered ($14,570/person avg.)",
      "source": "CMS National Health Expenditure Accounts, 2023"
    },
    {
      "key": "college",
      "icon": "🎓",
      "cost_per_unit": 11610,
      "label": "Students' full-year in-state tuition at a public university ($11,610 avg.)",
      "source": "College Board, 2024–25"
    },
    {
      "key": "housing",
      "icon": "🏠",
      "cost_per_unit": 100000,
      "label": "Affordable housing units at $100,000/unit",
      "source": "National Association of Home Builders, 2024",
      "decimals": 1
    },
    {
      "key": "teacher",
      "icon": "👩‍🏫",
      "cost_per_unit": 65000,
      "label": "Public school teachers for one year ($65,000 avg. salary)",
      "source": "NCES/BLS, 2024",
      "decimals": 1
    },
    {
      "key": "chip",
      "icon": "👶",
      "cost_per_unit": 1700,
      "label": "Children insured for one year through CHIP (~$1,700/child)",
      "source": "CMS CHIP Expenditure Data, FY2024"
    },
    {
      "key": "lunches",
      "icon": "🍎",
      "cost_per_unit": 765,
      "label": "Students receiving free school lunches for one year ($4.25/lunch × 180 days)",
      "source": "USDA NSLP, FY2024"
    },
    {
      "key": "epa",
      "icon": "🌱",
      "cost_per_unit": 6000000000,
      "label": "The entire annual EPA budget (~$6B), funded more than 7× over",
      "source": "EPA FY2025 Congressional Justification",
      "format": "multiplier"
    },
    {
      "key": "pell",
      "icon": "🎒",
      "cost_per_unit": 5300,
      "label": "Pell Grant recipients for one year ($5,300 avg. grant)",
      "source": "Dept. of Education, AY2023–24"
    }
  ],

  "tickers": [
    { "key": "lunches",  "cost_per_unit": 765,    "decimals": 0 },
    { "key": "chip",     "cost_per_unit": 1700,   "decimals": 0 },
    { "key": "pell",     "cost_per_unit": 5300,   "decimals": 0 },
    { "key": "college",  "cost_per_unit": 11610,  "decimals": 0 },
    { "key": "health",   "cost_per_unit": 14570,  "decimals": 0 },
    { "key": "teacher",  "cost_per_unit": 65000,  "decimals": 1 },
    { "key": "housing",  "cost_per_unit": 100000, "decimals": 1 }
  ],

  "events": [
    {
      "date": "2024-04-01",
      "date_label": "April 1, 2024",
      "cumul_label": null,
      "class": null,
      "title": null,
      "chart_y": 0
    },
    {
      "date": "2024-04-20",
      "date_label": "April 20, 2024",
      "cumul_label": "TRACKER START",
      "class": "notable",
      "title": "$95B Foreign Aid Package — $26.38B for Israel (H.R.8034)",
      "desc": "H.R.8034 allocated $26.38B for Israel within a $95B package (Ukraine: $60.84B; Indo-Pacific: $8.12B). Funds covered Iron Dome replenishment, Foreign Military Financing, and US war reserve stock drawdowns.",
      "cost_note": "Israel allocation: $26.38B · FMF, Iron Dome replenishment, war reserve drawdown",
      "sources": [
        { "label": "Congress.gov H.R.8034", "url": "https://www.congress.gov/bill/118th-congress/house-bill/8034" },
        { "label": "CBO Cost Estimate", "url": "https://www.cbo.gov/publication/60221" },
        { "label": "PBS Breakdown", "url": "https://www.pbs.org/newshour/politics/a-breakdown-of-whats-in-the-95-billion-foreign-aid-package-passed-by-the-house" }
      ],
      "chart_y": 26380000000,
      "chart_label": "H.R.8034"
    },
    {
      "date": "2024-10-01",
      "date_label": "October 1, 2024",
      "cumul_label": "~$26.6B",
      "class": "notable",
      "title": "Iran fires ~180–200 ballistic missiles at Israel (Operation True Promise II)",
      "desc": "Iran launched ~180–200 ballistic missiles at Israel. The IDF cited ~180; the White House cited more than 200. US forces fired interceptors alongside Israeli air defenses, depleting stockpiles that required replenishment in 2025. US interceptor expenditure estimated at $200–400M.",
      "cost_note": "US interceptor costs est. $200–400M",
      "sources": [
        { "label": "Wikipedia", "url": "https://en.wikipedia.org/wiki/October_2024_Iranian_strikes_on_Israel" },
        { "label": "NPR", "url": "https://www.npr.org/2024/10/01/g-s1-25707/iran-israel-hezbollah-lebanon-attack" },
        { "label": "Al Jazeera", "url": "https://www.aljazeera.com/news/2024/10/1/irans-missile-attack-against-israel-what-we-know-and-what-comes-next" }
      ],
      "chart_y": 26630000000,
      "chart_label": "True Promise II"
    },
    {
      "date": "2025-01-01",
      "date_label": "January 2025",
      "cumul_label": null,
      "class": null,
      "title": null,
      "chart_y": 27000000000,
      "chart_label": "Theater ops"
    },
    {
      "date": "2025-03-15",
      "date_label": "March 15, 2025",
      "cumul_label": "~$27.5B",
      "class": "notable",
      "title": "FY2025 Full-Year Appropriations: $3.3B Foreign Military Financing for Israel",
      "desc": "H.R.1968 funded Israel's baseline Foreign Military Financing at $3.3B, the annual level under the US–Israel MOU. The act also included $450M for Israeli offshore procurement and missile defense replenishment.",
      "cost_note": "FY2025 FMF: $3.3B · Plus $450M offshore procurement",
      "sources": [
        { "label": "Congress.gov H.R.1968", "url": "https://www.congress.gov/bill/119th-congress/house-bill/1968/text" },
        { "label": "CRS Report RL33222", "url": "https://www.congress.gov/crs-product/RL33222" }
      ],
      "chart_y": 27500000000,
      "chart_label": "FY2025 FMF"
    },
    {
      "date": "2025-03-15",
      "date_label": "March–May 2025",
      "cumul_label": "~$27.5B–$29B",
      "class": "support",
      "title": "Operation Rough Rider: US airstrikes on Houthi forces in Yemen",
      "desc": "Sustained US air campaign against Houthi infrastructure in Yemen. The Houthis, an Iranian-backed proxy, had disrupted global shipping since late 2023. Strikes used Tomahawk missiles (~$2M each), B-2 sorties, and carrier air wing operations.",
      "cost_note": "Est. cost: $1.5–2.5B · Iran-backed proxy operations",
      "sources": [
        { "label": "CSIS: Houthi Threat", "url": "https://www.csis.org/programs/middle-east-program/houthi-threat" },
        { "label": "Breaking Defense", "url": "https://breakingdefense.com/tag/houthis/" }
      ],
      "chart_y": null
    },
    {
      "date": "2025-06-13",
      "date_label": "June 13–24, 2025",
      "cumul_label": "$29B to $34.5B",
      "class": "notable",
      "title": "Twelve-Day War: US depletes 14% of its THAAD stockpile",
      "desc": "Israel struck Iranian military and nuclear sites on June 13 (Operation Rising Lion); Iran retaliated with 550+ missiles and 1,000+ drones over 12 days. US forces expended ~92 THAAD interceptors at $12.7M each, 14% of the total US stockpile. Total US air defense costs reached $2.7–4.7B (JINSA, July 2025). Restocking is projected to take 3–8 years.",
      "cost_note": "THAAD alone: 92 x $12.7M = $1.17B · Total US air defense: $2.7–4.7B (JINSA)",
      "sources": [
        { "label": "Wikipedia: Twelve-Day War", "url": "https://en.wikipedia.org/wiki/Twelve-Day_War" },
        { "label": "JINSA Insights", "url": "https://jinsa.org/jinsa_report/insights-from-12-day-war/" },
        { "label": "JINSA Cost Report (PDF)", "url": "https://jinsa.org/wp-content/uploads/2025/07/Cost-Estimates-During-the-U.S.-Israel-Iran-War-07-21-25.pdf" }
      ],
      "chart_y": 29000000000,
      "chart_label": "12-Day War begins"
    },
    {
      "date": "2025-06-22",
      "date_label": "June 22, 2025",
      "cumul_label": "~$32B",
      "class": "major",
      "title": "Operation Midnight Hammer: First direct US strikes on Iranian nuclear facilities",
      "desc": "Seven B-2 bombers from Diego Garcia carried 14 GBU-57 Massive Ordnance Penetrators; submarines launched Tomahawks simultaneously. Targets: Fordow, Natanz, Isfahan. B-2 round-trip: ~30 flight hours at $130,000/hr. GBU-57 cost: $3.5M–$14M per bomb.",
      "cost_note": "7 B-2 sorties (~30 hr each): ~$27M · Tomahawks: ~$50–100M · Day-1 total est.: $150–300M+",
      "sources": [
        { "label": "Wikipedia", "url": "https://en.wikipedia.org/wiki/United_States_strikes_on_Iranian_nuclear_sites" },
        { "label": "CSIS Analysis", "url": "https://www.csis.org/analysis/what-operation-midnight-hammer-means-future-irans-nuclear-ambitions" },
        { "label": "USAF B-2 Fact Sheet", "url": "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104482/b-2-spirit/" }
      ],
      "chart_y": null
    },
    {
      "date": "2025-06-24",
      "date_label": "June 24, 2025",
      "cumul_label": null,
      "class": null,
      "title": null,
      "chart_y": 34500000000,
      "chart_label": "Post 12-Day War"
    },
    {
      "date": "2025-09-01",
      "date_label": "September 27, 2025",
      "cumul_label": "~$36.5B",
      "class": "support",
      "title": "UN Sanctions Snapback: Iran nuclear sanctions reimposed",
      "desc": "The UK, France, and Germany invoked the JCPOA snapback mechanism; UN sanctions were reimposed September 27. US military posture remained elevated with 2 carrier strike groups in the region at ~$13M/day.",
      "cost_note": "Theater baseline (pre-Epic Fury): $17–30M/day · 2 CSG ship ops: ~$13M/day",
      "sources": [
        { "label": "US State Dept", "url": "https://www.state.gov/releases/office-of-the-spokesperson/2025/09/completion-of-un-sanctions-snapback-on-iran/" },
        { "label": "EU Council", "url": "https://www.consilium.europa.eu/en/press/press-releases/2025/09/29/iran-sanctions-snapback-council-reimposes-restrictive-measures/" },
        { "label": "Wikipedia: Snapback", "url": "https://en.wikipedia.org/wiki/Snapback_mechanism_of_sanctions_against_Iran" }
      ],
      "chart_y": 36500000000,
      "chart_label": "Sanctions snapback"
    },
    {
      "date": "2025-12-01",
      "date_label": "December 2025",
      "cumul_label": null,
      "class": null,
      "title": null,
      "chart_y": 39000000000,
      "chart_label_x": -90,
      "chart_label_callout": true,
      "chart_label": "Theater presence"
    },
    {
      "date": "2026-01-29",
      "date_label": "Late January 2026",
      "cumul_label": "~$40B",
      "class": "support",
      "title": "Largest US Middle East naval buildup since 2003: 2 carrier strike groups repositioned",
      "desc": "Each CSG costs ~$6.5M/day in theater operations, ~$13M/day combined.",
      "cost_note": "2 CSG daily ship ops: ~$13M/day · Theater total (all forces): ~$40–80M/day",
      "sources": [
        { "label": "USNI News", "url": "https://news.usni.org" }
      ],
      "chart_y": 40000000000,
      "chart_label": "2 CSGs deployed",
      "chart_label_x": -60,
      "chart_label_callout": true
    },
    {
      "date": "2026-02-28",
      "date_label": "February 28, 2026",
      "cumul_label": "~$41.2B",
      "class": "major",
      "open": true,
      "title": "Operation Epic Fury: 1,000+ Iranian military targets struck in the first 24 hours",
      "desc": "US and Israeli forces struck 1,000+ Iranian military sites in the first 24 hours. Weapons included B-2 bombers, Tomahawk missiles (~$2M each), HIMARS rockets, and F-35C sorties. Supreme Leader Khamenei was killed. Three US service members were killed.",
      "cost_note": "Day-1 munitions estimate: $1–2B · Ongoing operations rate: ~$200M/day",
      "sources": [
        { "label": "USNI News", "url": "https://news.usni.org" }
      ],
      "chart_y": 41200000000,
      "chart_label": "Op. Epic Fury",
      "chart_label_x": -60,
      "chart_label_y": 30,
      "chart_label_callout": true
    },
    {
      "date": "2026-03-01",
      "date_label": "March 1, 2026",
      "cumul_label": "~$42B",
      "class": "major",
      "open": true,
      "title": "6 US service members killed by Iranian drone strike in Kuwait",
      "desc": "Six Army Reservists from the 103rd Sustainment Command (Des Moines, Iowa) were killed by an Iranian drone strike on Port Shuaiba, Kuwait. 18 additional service members were wounded. Strikes continued against Iranian military and IRGC targets.",
      "cost_note": "2-day operational cost estimate: $2–4B cumulative",
      "sources": [
        { "label": "CBS News", "url": "https://www.cbsnews.com/live-updates/iran-us-war-day-3-american-deaths-israel-gulf-allies-hit-missile-strikes/" },
        { "label": "NPR", "url": "https://www.npr.org/2026/03/02/g-s1-112151/iran-war-widens-threatens-to-engulf-lebanon" },
        { "label": "CNN", "url": "https://www.cnn.com/2026/03/02/politics/six-soldiers-killed-in-iranian-strike-kuwait" }
      ],
      "chart_y": null
    },
    {
      "date": "2026-03-02",
      "date_label": "March 2, 2026",
      "cumul_label": "$43B",
      "class": "major",
      "open": true,
      "title": "Friendly fire: Kuwait downs 3 US F-15s. Hezbollah opens a third front.",
      "desc": "Three F-15Es shot down by Kuwaiti air defense in a friendly fire incident. All six aircrew ejected and were recovered. Original F-15E cost: ~$31M (FY1998); F-15EX replacement: ~$94M. Hezbollah simultaneously opened a sustained assault on Israel's northern border.",
      "cost_note": "3 F-15E airframes: ~$93M original / ~$282M replacement · Tracker anchor: $43B",
      "sources": [
        { "label": "F-15E Wikipedia", "url": "https://en.wikipedia.org/wiki/McDonnell_Douglas_F-15E_Strike_Eagle" },
        { "label": "F-15EX Cost", "url": "https://www.airandspaceforces.com/new-acquisition-report-f-15ex-unit-cost/" }
      ],
      "chart_y": 43000000000,
      "chart_label": "$43B (Mar 2)",
      "chart_label_x": -50,
      "chart_label_callout": true
    },
    {
      "date": "2026-03-03",
      "date_label": "March 3–4, 2026",
      "cumul_label": "~$44.9B",
      "class": "notable",
      "open": true,
      "title": "Satellite imagery confirms Iran destroyed ~$1.9B in US radar/air defense infrastructure across 5 Gulf states",
      "desc": "NYT satellite imagery confirmed Iranian strikes systematically destroyed US radar and communication systems across bases in Qatar, UAE, Kuwait, Bahrain, and Saudi Arabia. The AN/FPS-132 early warning radar at Al Udeid (~$1.1B) — the nerve center of US missile defense coordination — was hit by a single missile. Two AN/TPY-2 THAAD radars were destroyed in the UAE and Jordan. SATCOM terminals and radomes were cracked open across multiple installations. Iran mapped the communication layer that makes US missile defense function as a unified system, then dismantled it base by base.",
      "cost_note": "AN/FPS-132: ~$1.1B · 2× AN/TPY-2: ~$500M each · SATCOM/radomes: additional · Total equipment losses: ~$1.9B",
      "sources": [
        { "label": "Defence Security Asia", "url": "https://defencesecurityasia.com/en/iran-missile-strikes-destroy-us-satcom-an-tpy2-radar-gulf-bases-satellite-images/" },
        { "label": "TRT World", "url": "https://www.trtworld.com/article/35eac28b7995" },
        { "label": "Stars and Stripes", "url": "https://www.stripes.com/theaters/middle_east/2026-03-04/air-base-qatar-missile-20946551.html" },
        { "label": "Army Recognition", "url": "https://www.armyrecognition.com/news/army-news/2026/iran-claims-destruction-of-an-fps-132-radar-in-qatar-used-for-u-s-missile-warning" }
      ],
      "chart_y": 44900000000,
      "chart_label": "$44.9B (Mar 4)",
      "chart_label_x": -60,
      "chart_label_callout": true
    }
  ],

  "chart_annotations": [
    {
      "key": "hr8034",
      "date": "2024-04-20",
      "label": "$26.4B Israel aid package",
      "color": "rgba(255,209,102,0.5)",
      "label_color": "#ffd166",
      "weight": "normal",
      "y_adjust": -15,
      "x_adjust": 50
    },
    {
      "key": "roughRider",
      "type": "box",
      "date_start": "2025-03-01",
      "date_end": "2025-05-31",
      "label": "US strikes on Yemen (Houthis)",
      "color": "rgba(138,138,138,0.08)",
      "border_color": "rgba(138,138,138,0.25)",
      "label_color": "#8a8a8a",
      "weight": "normal",
      "y_adjust": -15
    },
    {
      "key": "war12day",
      "type": "box",
      "date_start": "2025-06-13",
      "date_end": "2025-06-24",
      "label": "12-Day War",
      "color": "rgba(255,209,102,0.10)",
      "border_color": "rgba(255,209,102,0.35)",
      "label_color": "#ffd166",
      "weight": "normal",
      "y_adjust": -45
    },
    {
      "key": "jan26",
      "date": "2026-01-29",
      "label": "2 carrier strike groups deployed",
      "color": "rgba(138,138,138,0.4)",
      "label_color": "#8a8a8a",
      "weight": "normal",
      "y_adjust": -15,
      "x_adjust": -70
    },
    {
      "key": "epicFury",
      "date": "2026-02-28",
      "label": "Op. Epic Fury Start",
      "color": "rgba(204,0,0,0.5)",
      "label_color": "#cc0000",
      "weight": "bold",
      "y_adjust": -55,
      "x_adjust": -55
    }
  ]
};
