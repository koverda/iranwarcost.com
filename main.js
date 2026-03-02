init(SITE_DATA);

function init(data) {

  // ── CONSTANTS (derived from data.js) ─────────────────────────────────────
  const ANCHOR_DATE   = new Date(data.meta.anchor_date);
  const ANCHOR_AMOUNT = data.meta.anchor_amount;
  const US_TAXPAYERS  = data.meta.us_taxpayers;

  // Burn rate: exponentially weighted average of interval slopes from chart data.
  // Intervals whose midpoint is more recent (closer to ANCHOR_DATE) get higher weight.
  // Half-life is configurable via data.meta.burn_rate_halflife_days (default 30).
  const DAILY_BURN = (function computeDailyBurn() {
    const halfLifeMs = (data.meta.burn_rate_halflife_days || 30) * 86400000;
    const anchorMs   = ANCHOR_DATE.getTime();

    const pts = data.events
      .filter(e => e.chart_y !== null && e.chart_y !== undefined)
      .map(e => ({ t: new Date(e.date).getTime(), y: e.chart_y }))
      .sort((a, b) => a.t - b.t);

    let weightedSum = 0, totalWeight = 0;
    for (let i = 1; i < pts.length; i++) {
      const dtDays = (pts[i].t - pts[i - 1].t) / 86400000;
      const dy     = pts[i].y - pts[i - 1].y;
      if (dtDays <= 0 || dy <= 0) continue;

      const ratePerDay = dy / dtDays;
      const midMs      = (pts[i].t + pts[i - 1].t) / 2;
      const ageMs      = anchorMs - midMs;
      const weight     = Math.exp(-ageMs / halfLifeMs);

      weightedSum  += ratePerDay * weight;
      totalWeight  += weight;
    }

    if (totalWeight === 0) throw new Error('computeDailyBurn: no valid chart intervals in data.js');
    return weightedSum / totalWeight;
  })();

  const DOLLARS_PER_SEC = DAILY_BURN / 86400;
  const DAILY_PER_TX    = DAILY_BURN / US_TAXPAYERS;

  function getCurrentCost() {
    const elapsedSec = (Date.now() - ANCHOR_DATE.getTime()) / 1000;
    return ANCHOR_AMOUNT + elapsedSec * DOLLARS_PER_SEC;
  }

  function getCurrentPerTaxpayer() {
    return getCurrentCost() / US_TAXPAYERS;
  }

  // ── FORMAT HELPERS ─────────────────────────────────────────────────────────
  function fmtUSD(n, decimals = 0) {
    return '$' + n.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function fmtCompact(n) {
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + 'B';
    if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000)         return Math.round(n / 1_000) + 'K';
    return n.toLocaleString('en-US');
  }

  // ── STATIC TEXT (values derived from data.js) ────────────────────────────
  (function initStaticText() {
    const anchorB     = (ANCHOR_AMOUNT / 1e9).toFixed(0);
    const taxpayersM  = (US_TAXPAYERS / 1e6).toFixed(0);
    const dailyM      = (DAILY_BURN / 1e6).toFixed(0);
    const hourlyM     = (DAILY_BURN / 24 / 1e6).toFixed(1);
    const perSec      = Math.round(DOLLARS_PER_SEC).toLocaleString('en-US');
    const perTxTotal  = Math.round(ANCHOR_AMOUNT / US_TAXPAYERS);
    const anchorDateStr = ANCHOR_DATE.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
    });

    const set  = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    const setH = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML   = html; };

    set('counter-label',        `Total Cost Since ${data.meta.tracker_start_label}`);
    set('burn-daily',           `~$${dailyM}M`);
    set('burn-hourly',          `~$${hourlyM}M`);
    set('burn-second',          `~$${perSec}`);
    set('th-label',             `Per US Taxpayer: Total Since ${data.meta.tracker_start_label}`);
    setH('th-sub',              `Live &bull; ${taxpayersM}M US taxpayers`);
    set('compare-war-sublabel', `$${anchorB}B ÷ ${taxpayersM}M taxpayers`);
    set('compare-war-val',      `$${perTxTotal}`);
    set('alt-title',            `What $${anchorB} Billion Could Have Funded Instead`);
    set('realtime-desc',        `Each counter below started at zero when you loaded this page. At $${perSec} per second, watch what crosses the threshold.`);
    set('methodology-heading',  `$${anchorB}B cost breakdown (since ${data.meta.tracker_start_label}):`);
    set('methodology-counter',  `Anchored at $${anchorB}B on ${anchorDateStr} (UTC midnight), incrementing at $${perSec}/second (~$${dailyM}M/day), reflecting the active operations rate since Epic Fury began February 28.`);
    set('footer-anchor',        `Data anchored: ${anchorDateStr} · All figures are estimates from publicly available data`);

    // Hero subtitle — uses tracker start label and first cost_breakdown item
    const hr8034Label = data.cost_breakdown[0].estimate_label; // "$26.38B"
    set('hero-subtitle', `Estimated US military spending since ${data.meta.tracker_start_label} — the day Congress passed ${hr8034Label} in emergency security aid for Israel. Operations, weapons, air defense, and military aid. All figures sourced.`);

    // Twitter share link
    const tweetText = encodeURIComponent(`The US war with Iran has cost $${anchorB}B since ${data.meta.tracker_start_label} — and counting. $${perTxTotal} per taxpayer.`);
    const twitterEl = document.getElementById('share-twitter');
    if (twitterEl) twitterEl.href = `https://twitter.com/intent/tweet?text=${tweetText}&url=https%3A%2F%2Firanwarcost.com`;

    // Methodology intro paragraph
    const mIntro = document.getElementById('methodology-intro');
    if (mIntro) mIntro.innerHTML = `The tracker starts on <strong>${data.meta.tracker_start_label}</strong> — the date President Biden signed H.R.8034, committing ${hr8034Label} in emergency Israel security assistance. This represents the first large, direct US financial commitment in response to escalating Iran-Israel conflict. All subsequent appropriations, operations, and air defense expenditures are counted from that date forward.`;
  })();

  // ── HERO COUNTER ──────────────────────────────────────────────────────────
  const totalEl    = document.getElementById('total-counter');
  const taxpayerEl = document.getElementById('taxpayer-counter');

  const startVal   = getCurrentCost();
  const txStartVal = getCurrentPerTaxpayer();

  const cuTotal = new countUp.CountUp('total-counter', startVal, {
    startVal:      startVal - DOLLARS_PER_SEC * 3,
    duration:      2.5,
    useGrouping:   true,
    separator:     ',',
    prefix:        '$',
    decimalPlaces: 0,
  });

  const cuTaxpayer = new countUp.CountUp('taxpayer-counter', txStartVal, {
    startVal:      txStartVal - (DAILY_PER_TX / 86400) * 3,
    duration:      2.5,
    useGrouping:   true,
    separator:     ',',
    prefix:        '$',
    decimalPlaces: 2,
  });

  if (!cuTotal.error)    cuTotal.start();
  if (!cuTaxpayer.error) cuTaxpayer.start();

  // After animation: switch to live real-time DOM updates
  setTimeout(() => {
    setInterval(() => {
      totalEl.textContent    = fmtUSD(getCurrentCost());
      taxpayerEl.textContent = fmtUSD(getCurrentPerTaxpayer(), 2);
    }, 250);
  }, 3000);

  // ── TAXPAYER SECTION ──────────────────────────────────────────────────────
  const taxBig    = document.getElementById('taxpayer-big');
  const tcDaily   = document.getElementById('tc-daily');
  const tcWeekly  = document.getElementById('tc-weekly');
  const tcMonthly = document.getElementById('tc-monthly');
  const tcAnnual  = document.getElementById('tc-annual');

  function updateTaxpayerSection() {
    const perTx = getCurrentPerTaxpayer();
    taxBig.textContent    = fmtUSD(perTx, 2);
    tcDaily.textContent   = fmtUSD(DAILY_PER_TX, 2);
    tcWeekly.textContent  = fmtUSD(DAILY_PER_TX * 7, 2);
    tcMonthly.textContent = fmtUSD(DAILY_PER_TX * 30.44, 2);
    tcAnnual.textContent  = fmtUSD(DAILY_PER_TX * 365.25, 2);
  }

  updateTaxpayerSection();
  setInterval(updateTaxpayerSection, 1000);

  // ── ALTERNATIVES SECTION (rendered from data.json) ────────────────────────
  const altGrid = document.getElementById('alternatives-grid');
  if (altGrid) {
    altGrid.innerHTML = data.alternatives.map(alt => {
      let numStr;
      if (alt.format === 'multiplier') {
        const mult = ANCHOR_AMOUNT / alt.cost_per_unit;
        numStr = mult.toFixed(1) + '×';
      } else {
        const n = ANCHOR_AMOUNT / alt.cost_per_unit;
        numStr = fmtCompact(n);
      }
      return `<div class="comparison-card">
  <span class="cc-icon">${alt.icon}</span>
  <div class="cc-number">${numStr}</div>
  <div class="cc-label">${alt.label}</div>
  <div class="cc-source">${alt.source}</div>
</div>`;
    }).join('\n');
  }

  // ── SHARE — COPY LINK ─────────────────────────────────────────────────────
  window.copyLink = function copyLink() {
    const btn = document.getElementById('copy-link-btn');
    navigator.clipboard.writeText('https://iranwarcost.com').then(() => {
      const original = btn.textContent;
      btn.textContent = '✓ COPIED';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 2000);
    }).catch(() => {
      prompt('Copy this link:', 'https://iranwarcost.com');
    });
  };

  // ── EVENTS LIST (rendered from data.json) ─────────────────────────────────
  const eventsList = document.getElementById('events-list');
  if (eventsList) {
    const visibleEvents = data.events.filter(e => e.title);
    eventsList.innerHTML = visibleEvents.map(ev => {
      const sourcesHtml = (ev.sources && ev.sources.length)
        ? `<div class="event-sources">${ev.sources.map(s =>
            `<a class="event-source-link" href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`
          ).join('\n')}</div>`
        : '';
      const costHtml = ev.cost_note
        ? `<div class="event-cost">${ev.cost_note}</div>`
        : '';
      const openAttr = ev.open ? ' open' : '';
      const classAttr = ev.class ? ` ${ev.class}` : '';
      return `<div class="event-item${classAttr}">
  <div class="event-date">${ev.date_label}${ev.cumul_label ? ` <span class="event-cumul">${ev.cumul_label}</span>` : ''}</div>
  <details class="event-details"${openAttr}>
    <summary class="event-title">${ev.title}</summary>
    <div class="event-body">
      <div class="event-desc">${ev.desc || ''}</div>
      ${costHtml}
      ${sourcesHtml}
    </div>
  </details>
</div>`;
    }).join('\n');
  }

  // ── CHART DATA (derived from data.json) ───────────────────────────────────
  const chartData = data.events
    .filter(e => e.chart_y !== null && e.chart_y !== undefined)
    .map(e => ({ x: e.date, y: e.chart_y }));

  // ── CHART ANNOTATIONS (derived from data.json) ────────────────────────────
  const annotations = {};
  data.chart_annotations.forEach(a => {
    annotations[a.key] = {
      type: 'line',
      xMin: a.date, xMax: a.date,
      borderColor: a.color,
      borderWidth: a.border_width || 1,
      borderDash: a.border_width === 2 ? [] : [4, 3],
      label: a.label ? {
        display: true,
        content: a.label,
        position: 'end',
        color: a.label_color,
        font: { size: 11, weight: a.weight || 'normal' },
        backgroundColor: 'rgba(10,10,10,0.9)',
        yAdjust: a.y_adjust || 10,
        xAdjust: a.x_adjust || 0,
      } : { display: false }
    };
  });

  // ── REAL-TIME COST TICKER ─────────────────────────────────────────────────
  const PAGE_LOAD_COST = getCurrentCost();

  const TICKERS = data.tickers.map(t => ({
    key:      t.key,
    cost:     t.cost_per_unit,
    decimals: t.decimals,
    prev:     null,
    sectionNum:  document.getElementById('tn-'  + t.key),
    sectionCard: document.getElementById('tc-'  + t.key),
    sidebarNum:  document.getElementById('ls-'  + t.key),
    sidebarItem: document.getElementById('lsi-' + t.key),
  }));

  function fmtSidebarNum(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 10_000)    return (n / 1_000).toFixed(0) + 'K';
    return n.toLocaleString('en-US');
  }

  function popEl(el) {
    if (!el) return;
    el.classList.remove('tick-active');
    void el.offsetWidth;
    el.classList.add('tick-active');
    setTimeout(() => el.classList.remove('tick-active'), 450);
  }

  function updateTickers() {
    const elapsed = getCurrentCost() - PAGE_LOAD_COST;
    TICKERS.forEach(t => {
      const raw = elapsed / t.cost;
      const display = t.decimals ? raw.toFixed(t.decimals) : Math.floor(raw).toLocaleString('en-US');
      if (display === t.prev) return;
      if (t.sectionNum)  t.sectionNum.textContent  = display;
      if (t.sidebarNum)  t.sidebarNum.textContent  = t.decimals ? display : fmtSidebarNum(Math.floor(raw));
      if (t.prev !== null) {
        popEl(t.sectionCard);
        popEl(t.sidebarItem);
      }
      t.prev = display;
    });
  }

  updateTickers();
  setInterval(updateTickers, 250);

  // ── CHART ─────────────────────────────────────────────────────────────────
  const ctx      = document.getElementById('spendingChart').getContext('2d');
  const isMobile = window.innerWidth < 640;

  if (isMobile) {
    Object.values(annotations).forEach(a => { a.label.display = false; });
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, 360);
  gradient.addColorStop(0, 'rgba(204,0,0,0.30)');
  gradient.addColorStop(1, 'rgba(204,0,0,0.01)');

  new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Cumulative US Spending ($)',
        data: chartData,
        parsing: { xAxisKey: 'x', yAxisKey: 'y' },
        borderColor: '#cc0000',
        borderWidth: 2,
        pointBackgroundColor: '#cc0000',
        pointRadius: isMobile ? 3 : 4,
        pointHoverRadius: 5,
        fill: true,
        backgroundColor: gradient,
        tension: 0.25,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: isMobile ? 1.1 : 2,
      interaction: { mode: 'index', intersect: false },
      layout: {
        padding: { top: 16, right: isMobile ? 8 : 16, bottom: isMobile ? 8 : 24 },
      },
      scales: {
        x: {
          type: 'time',
          time: { unit: 'month', displayFormats: { month: isMobile ? 'MMM' : 'MMM yy' } },
          grid: { color: 'rgba(255,255,255,0.03)' },
          ticks: { color: '#8a8a8a', font: { size: 11 }, maxRotation: 0, maxTicksLimit: isMobile ? 6 : 12 },
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.03)' },
          ticks: {
            color: '#8a8a8a',
            font: { size: 11 },
            callback: v => '$' + (v / 1e9).toFixed(0) + 'B',
            maxTicksLimit: isMobile ? 5 : 8,
          },
          title: {
            display: !isMobile,
            text: 'Cumulative Spending (USD)',
            color: '#8a8a8a',
            font: { size: 11 },
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#111111',
          borderColor: '#1e1e1e',
          borderWidth: 1,
          titleColor: '#e8e8e8',
          bodyColor: '#8a8a8a',
          callbacks: {
            label: ctx => ' $' + (ctx.parsed.y / 1e9).toFixed(2) + ' billion'
          }
        },
        annotation: { annotations }
      }
    }
  });

  // ── METHODOLOGY TABLE (rendered from data.json) ───────────────────────────
  const costTable = document.getElementById('cost-breakdown-tbody');
  if (costTable) {
    const rows = data.cost_breakdown.map(item =>
      `<tr>
        <td>${item.component}</td>
        <td>${item.source}</td>
        <td>${item.estimate_label}</td>
      </tr>`
    ).join('\n');
    const total = data.cost_breakdown.reduce((s, i) => s + i.estimate_usd, 0);
    const totalB = (total / 1e9).toFixed(2);
    costTable.innerHTML = rows + `<tr>
      <td><strong>Total anchor: ${data.meta.tracker_start_label} — March 2, 2026 UTC midnight</strong></td>
      <td></td>
      <td><strong>~$${totalB}B</strong></td>
    </tr>`;
  }

} // end init
