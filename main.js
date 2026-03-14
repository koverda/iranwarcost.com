init(SITE_DATA);

function init(data) {

  // ── CONSTANTS (derived from data.js) ─────────────────────────────────────
  const ANCHOR_DATE   = new Date(data.meta.anchor_date);
  const ANCHOR_AMOUNT = data.meta.anchor_amount;
  const US_TAXPAYERS  = data.meta.us_taxpayers;

  // Burn rate: exponentially weighted average of interval slopes from chart data.
  // Intervals whose midpoint is more recent (closer to ANCHOR_DATE) get higher weight.
  // Half-life is configurable via data.meta.burn_rate_halflife_days (default 30).
  let BURN_INTERVALS = []; // populated below; used by the burn-rate tooltip
  const DAILY_BURN = (function computeDailyBurn() {
    const halfLifeMs = (data.meta.burn_rate_halflife_days || 30) * 86400000;
    const anchorMs   = ANCHOR_DATE.getTime();

    const pts = data.events
      .filter(e => e.chart_y !== null && e.chart_y !== undefined)
      .map(e => ({ t: new Date(e.date).getTime(), y: e.chart_y, date: e.date }))
      .sort((a, b) => a.t - b.t);

    let weightedSum = 0, totalWeight = 0;
    const intervals = [];
    for (let i = 1; i < pts.length; i++) {
      const dtDays = (pts[i].t - pts[i - 1].t) / 86400000;
      const dy     = pts[i].y - pts[i - 1].y;
      if (dtDays <= 0 || dy <= 0) continue;

      const ratePerDay = dy / dtDays;
      const midMs      = (pts[i].t + pts[i - 1].t) / 2;
      const ageMs      = anchorMs - midMs;
      const weight     = Math.exp(-ageMs / halfLifeMs);

      intervals.push({ from: pts[i - 1].date, to: pts[i].date, ratePerDay, weight });
      weightedSum  += ratePerDay * weight;
      totalWeight  += weight;
    }

    if (totalWeight === 0) throw new Error('computeDailyBurn: no valid chart intervals in data.js');
    BURN_INTERVALS = intervals.map(iv => ({ ...iv, weightPct: (iv.weight / totalWeight) * 100 }));
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
    const fmtRate = (val) => val >= 1e9 ? `${(val / 1e9).toFixed(1)}B` : `${(val / 1e6).toFixed(0)}M`;
    const fmtSmall = (val) => val >= 1000 ? `${(val / 1000).toFixed(1)}K` : Math.round(val).toLocaleString('en-US');
    const dailyFmt    = fmtRate(DAILY_BURN);
    const hourlyFmt   = fmtRate(DAILY_BURN / 24);
    const perSec      = fmtSmall(DOLLARS_PER_SEC);
    const perTxTotal  = Math.round(ANCHOR_AMOUNT / US_TAXPAYERS);
    const anchorDateStr = ANCHOR_DATE.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
    });

    const set  = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    const setH = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML   = html; };

    set('counter-label',        `Total Cost Since ${data.meta.tracker_start_label}`);
    set('burn-daily',           `~$${dailyFmt}`);
    set('burn-hourly',          `~$${hourlyFmt}`);
    set('burn-second',          `~$${perSec}`);
    set('th-label',             `Per US Taxpayer: Total Since ${data.meta.tracker_start_label}`);
    setH('th-sub',              `Live &bull; ${taxpayersM}M US taxpayers`);
    set('compare-war-sublabel', `$${anchorB}B ÷ ${taxpayersM}M taxpayers`);
    set('compare-war-val',      `$${perTxTotal}`);
    set('alt-title',            `What $${anchorB} Billion Could Have Funded Instead`);
    set('realtime-rate',        `$${perSec}`);
    set('methodology-heading',  `$${anchorB}B cost breakdown (since ${data.meta.tracker_start_label}):`);
    set('methodology-counter',  `Anchored at $${anchorB}B on ${anchorDateStr} (UTC midnight), incrementing at $${perSec}/second (~$${dailyFmt}/day), reflecting the active operations rate since Epic Fury began February 28.`);
    set('footer-anchor',        `Data anchored: ${anchorDateStr} · All figures are estimates from publicly available data`);

    // Hero subtitle — uses tracker start label and first cost_breakdown item
    const hr8034Label = data.cost_breakdown[0].estimate_label;
    set('hero-subtitle', `Estimated US military spending since ${data.meta.tracker_start_label}, the day Congress passed H.R.8034 (${hr8034Label} in military provisions for Israel). Operations, weapons, air defense, and military aid — humanitarian spending excluded. All figures sourced.`);

    // Twitter share link
    const tweetText = encodeURIComponent(`The US war with Iran has cost $${anchorB}B since ${data.meta.tracker_start_label} — and counting. $${perTxTotal} per taxpayer.`);
    const twitterEl = document.getElementById('share-twitter');
    if (twitterEl) twitterEl.href = `https://twitter.com/intent/tweet?text=${tweetText}&url=https%3A%2F%2Firanwarcost.com`;

    // Methodology intro paragraph
    const mIntro = document.getElementById('methodology-intro');
    if (mIntro) mIntro.innerHTML = `The tracker starts on <strong>${data.meta.tracker_start_label}</strong> — when President Biden signed H.R.8034. The full bill appropriated $26.38B, of which ${hr8034Label} was military (FMF, missile defense, CENTCOM ops, ammunition). The remaining $9.15B in humanitarian aid for Gaza is excluded. This tracker counts only military spending: appropriations, operations, air defense, and equipment losses.`;

    // Burn rate tooltip
    const tooltipEl = document.getElementById('burn-tooltip');
    const infoBtn   = document.getElementById('burn-info-btn');
    if (tooltipEl && infoBtn) {
      const halfLife = data.meta.burn_rate_halflife_days || 30;
      const fmtDate  = iso => new Date(iso).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'
      });
      const fmtRate  = r => {
        if (r >= 1e9) return '$' + (r / 1e9).toFixed(2) + 'B';
        if (r >= 1e6) return '$' + (r / 1e6).toFixed(0) + 'M';
        return '$' + Math.round(r).toLocaleString('en-US');
      };

      const maxPct = Math.max(...BURN_INTERVALS.map(iv => iv.weightPct));
      const rows = BURN_INTERVALS.slice().reverse().map(iv => {
        const cls = iv.weightPct === maxPct ? ' class="highlight"' : '';
        return `<tr${cls}><td>${fmtDate(iv.from)} – ${fmtDate(iv.to)}</td><td>${fmtRate(iv.ratePerDay)}/day</td><td>${iv.weightPct.toFixed(1)}%</td></tr>`;
      }).join('');

      tooltipEl.innerHTML =
        `<div class="burn-tooltip-title">How This Rate Is Calculated</div>` +
        `<p>The daily burn rate is an <strong>exponentially weighted average</strong> of spending intervals ` +
        `derived from our cost timeline. Intervals whose midpoint falls closer to the anchor date receive ` +
        `higher weight, with a ${halfLife}-day half-life.</p>` +
        `<table class="burn-tooltip-table">` +
          `<thead><tr><th>Interval</th><th>Rate/day</th><th>Weight</th></tr></thead>` +
          `<tbody>${rows}</tbody>` +
        `</table>` +
        `<p>Result: <strong style="color:var(--text)">~$${dailyFmt}/day</strong>, weighted toward the most recent period. <a class="burn-tooltip-link" href="#sources">Full methodology →</a></p>`;

      infoBtn.addEventListener('click', e => {
        e.stopPropagation();
        const opening = tooltipEl.hidden;
        tooltipEl.hidden = !opening;
        infoBtn.setAttribute('aria-expanded', String(opening));
      });

      // Click outside closes the tooltip
      document.addEventListener('click', () => {
        if (!tooltipEl.hidden) {
          tooltipEl.hidden = true;
          infoBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Clicks inside the tooltip don't close it
      tooltipEl.addEventListener('click', e => e.stopPropagation());
    }
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

  // ── ALTERNATIVES SECTION (rendered from data.js) ─────────────────────────
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

  // ── EVENTS LIST (rendered from data.js) ──────────────────────────────────
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
      const slug = 'event-' + ev.date;
      return `<div id="${slug}" class="event-item${classAttr}">
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

  // ── CHART DATA (derived from data.js) ────────────────────────────────────
  const chartData = data.events
    .filter(e => e.chart_y !== null && e.chart_y !== undefined)
    .map(e => ({ x: e.date, y: e.chart_y }));

  // ── CHART ANNOTATIONS (derived from data.js) ─────────────────────────────
  const annotations = {};
  data.chart_annotations.forEach(a => {
    const callout = {
      display: true,
      borderColor: a.label_color || a.color,
      borderWidth: 1,
      margin: 4,
    };
    if (a.type === 'box') {
      annotations[a.key] = {
        type: 'box',
        xMin: a.date_start, xMax: a.date_end,
        backgroundColor: a.color,
        borderColor: a.border_color || 'transparent',
        borderWidth: 1,
        label: a.label ? {
          display: true,
          content: a.label,
          color: a.label_color,
          font: { size: 11, weight: a.weight || 'normal' },
          position: { x: 'center', y: 'end' },
          yAdjust: a.y_adjust || 0,
          callout,
        } : { display: false }
      };
    } else {
      annotations[a.key] = {
        type: 'line',
        xMin: a.date, xMax: a.date,
        borderColor: a.color,
        borderWidth: a.border_width || 1,
        borderDash: [4, 3],
        label: a.label ? {
          display: true,
          content: a.label,
          position: 'start',
          color: a.label_color,
          font: { size: 11, weight: a.weight || 'normal' },
          backgroundColor: 'rgba(10,10,10,0.9)',
          yAdjust: a.y_adjust || 10,
          xAdjust: a.x_adjust || 0,
          callout,
        } : { display: false }
      };
    }
  });

  // ── POINT LABELS (from chart_label fields on events) ─────────────────────
  const pointLabelKeys = [];
  data.events.forEach((e, i) => {
    if (!e.chart_label || e.chart_y === null || e.chart_y === undefined) return;
    const key = 'ptLabel_' + i;
    pointLabelKeys.push(key);
    annotations[key] = {
      type: 'label',
      xValue: e.date,
      yValue: e.chart_y,
      content: e.chart_label,
      color: '#e8e8e8',
      font: { size: 10, family: 'Space Mono, monospace' },
      backgroundColor: 'rgba(10,10,10,0.85)',
      padding: { top: 2, bottom: 2, left: 4, right: 4 },
      xAdjust: e.chart_label_x || 0,
      yAdjust: e.chart_label_y || -18,
      callout: (e.chart_label_x || e.chart_label_y) ? {
        display: true,
        borderColor: 'rgba(138,138,138,0.5)',
        borderWidth: 1,
        margin: 4,
      } : { display: false },
      display: false,
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
    Object.values(annotations).forEach(a => {
      if (a.label) a.label.display = false;
      else if (a.type === 'label') a.display = false;
    });
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, 360);
  gradient.addColorStop(0, 'rgba(204,0,0,0.30)');
  gradient.addColorStop(1, 'rgba(204,0,0,0.01)');

  const watermarkPlugin = {
    id: 'watermark',
    afterDraw(chart) {
      const { ctx: c, chartArea: { right, top } } = chart;
      c.save();
      c.font = '12px Oswald, sans-serif';
      c.fillStyle = 'rgba(138,138,138,0.33)';
      c.textAlign = 'right';
      c.textBaseline = 'top';
      c.fillText('IRANWARCOST.COM', right - 4, top + 4);
      c.restore();
    }
  };

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Cumulative US Spending ($)',
        data: chartData,
        parsing: { xAxisKey: 'x', yAxisKey: 'y' },
        borderColor: '#cc0000',
        borderWidth: 3,
        pointBackgroundColor: '#cc0000',
        pointRadius: isMobile ? 3 : 5,
        pointHoverRadius: 6,
        fill: true,
        backgroundColor: gradient,
        tension: 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: isMobile ? 1.1 : 1.2,
      interaction: { mode: 'index', intersect: false },
      layout: {
        padding: { top: 16, right: isMobile ? 8 : 24, bottom: isMobile ? 8 : 24 },
      },
      scales: {
        x: {
          type: 'time',
          time: { unit: 'month', displayFormats: { month: isMobile ? 'MMM' : 'MMM yy' } },
          grid: { color: 'rgba(255,255,255,0.03)' },
          ticks: { color: '#8a8a8a', font: { size: 11 }, maxRotation: 0, maxTicksLimit: isMobile ? 6 : 12 },
        },
        y: {
          min: 0,
          suggestedMax: 50000000000,
          grid: { color: 'rgba(255,255,255,0.03)' },
          ticks: {
            color: '#8a8a8a',
            font: { size: 11 },
            callback: v => '$' + (v / 1e9).toFixed(0) + 'B',
            maxTicksLimit: isMobile ? 5 : 8,
          },
          title: {
            display: !isMobile,
            text: 'Est. Cumulative Spending (USD)',
            color: '#8a8a8a',
            font: { size: 11 },
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'US Direct Military Spending — Iran Conflict, April 2024–Present',
          color: '#e8e8e8',
          font: { size: 18, family: 'Oswald, sans-serif', weight: 'normal' },
          padding: { bottom: 4 },
        },
        subtitle: {
          display: true,
          text: 'Estimated figures — sources cited below',
          color: '#8a8a8a',
          font: { size: 12, family: 'Oswald, sans-serif', weight: 'normal' },
          padding: { bottom: 12 },
        },
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
        annotation: { clip: false, annotations }
      }
    },
    plugins: [watermarkPlugin]
  });

  // ── CHART LABEL TOGGLE ───────────────────────────────────────────────────
  const labelToggle = document.getElementById('chart-label-toggle');
  if (labelToggle) {
    labelToggle.addEventListener('change', () => {
      const show = labelToggle.checked;
      pointLabelKeys.forEach(key => {
        chart.options.plugins.annotation.annotations[key].display = show;
      });
      chart.update('none');
    });
  }

  // ── METHODOLOGY TABLE (rendered from data.js) ────────────────────────────
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
