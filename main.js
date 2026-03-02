// ── COST CONSTANTS ───────────────────────────────────────────────────────────
// Anchor: $16B as of March 2, 2026 UTC midnight
// Breakdown: FMF $3.3B + JINSA interceptors $3.5B + Op. Midnight Hammer $400M
//            + Op. Rough Rider $1.5B + weapons drawdowns $1B
//            + theater presence $2B + Op. Epic Fury (3 days) $4.3B
const ANCHOR_DATE     = new Date('2026-03-02T00:00:00Z');
const ANCHOR_AMOUNT   = 16_000_000_000;
const DOLLARS_PER_SEC = 2314.81;   // $200M/day ÷ 86,400 sec
const US_TAXPAYERS    = 150_000_000;
const DAILY_PER_TX    = 200_000_000 / US_TAXPAYERS;  // $1.333.../day per taxpayer

function getCurrentCost() {
  const elapsedSec = (Date.now() - ANCHOR_DATE.getTime()) / 1000;
  return ANCHOR_AMOUNT + elapsedSec * DOLLARS_PER_SEC;
}

function getCurrentPerTaxpayer() {
  return getCurrentCost() / US_TAXPAYERS;
}

// ── FORMAT HELPERS ────────────────────────────────────────────────────────────
function fmtUSD(n, decimals = 0) {
  return '$' + n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

// ── HERO COUNTER ─────────────────────────────────────────────────────────────
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

// ── TAXPAYER SECTION ─────────────────────────────────────────────────────────
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

// ── SHARE — COPY LINK ─────────────────────────────────────────────────────────
function copyLink() {
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
    // Fallback for browsers without clipboard API
    prompt('Copy this link:', 'https://iranwarcost.com');
  });
}

// ── CHART ─────────────────────────────────────────────────────────────────────
// Cumulative US spending since Jan 1, 2025 (Y=0 at baseline)
// Key data corrections vs. prior versions:
//   - Added Op. Rough Rider point (Mar 2025)
//   - 12-Day War ends June 24, 2025 (not July 5)
//   - Anchor updated to $16B
const chartData = [
  { x: '2025-01-01', y: 0 },
  { x: '2025-03-15', y: 500_000_000 },     // H.R.1968 signed; Rough Rider begins
  { x: '2025-06-13', y: 2_000_000_000 },   // 12-Day War begins
  { x: '2025-06-24', y: 7_500_000_000 },   // 12-Day War ends (interceptors + Midnight Hammer)
  { x: '2025-09-01', y: 9_500_000_000 },   // Sanctions snapback; ongoing theater
  { x: '2025-12-01', y: 12_000_000_000 },
  { x: '2026-01-29', y: 13_000_000_000 },  // CSG buildup
  { x: '2026-02-28', y: 14_200_000_000 },  // Epic Fury begins
  { x: '2026-03-02', y: 16_000_000_000 },  // Anchor
];

const annotations = {
  roughRider: {
    type: 'line',
    xMin: '2025-03-15', xMax: '2025-03-15',
    borderColor: 'rgba(138,138,138,0.4)',
    borderWidth: 1,
    borderDash: [3, 3],
    label: {
      display: true, content: 'Op. Rough Rider', position: 'end',
      color: '#8a8a8a', font: { size: 11 },
      backgroundColor: 'rgba(10,10,10,0.9)',
      yAdjust: 10,
    }
  },
  war12day: {
    type: 'line',
    xMin: '2025-06-13', xMax: '2025-06-13',
    borderColor: 'rgba(255,209,102,0.5)',
    borderWidth: 1,
    borderDash: [4, 3],
    label: {
      display: true, content: '12-Day War', position: 'end',
      color: '#ffd166', font: { size: 11 },
      backgroundColor: 'rgba(10,10,10,0.9)',
      yAdjust: 10,
    }
  },
  // midnightHammer and war12dayEnd are only 2 days apart from war12day —
  // labels would always overlap; the events list below provides full detail.
  midnightHammer: {
    type: 'line',
    xMin: '2025-06-22', xMax: '2025-06-22',
    borderColor: 'rgba(255,209,102,0.6)',
    borderWidth: 1,
    borderDash: [4, 3],
    label: { display: false }
  },
  war12dayEnd: {
    type: 'line',
    xMin: '2025-06-24', xMax: '2025-06-24',
    borderColor: 'rgba(255,209,102,0.3)',
    borderWidth: 1,
    borderDash: [4, 3],
    label: { display: false }
  },
  jan26: {
    type: 'line',
    xMin: '2026-01-29', xMax: '2026-01-29',
    borderColor: 'rgba(138,138,138,0.4)',
    borderWidth: 1,
    borderDash: [4, 3],
    label: {
      display: true, content: '2 CSGs', position: 'end',
      color: '#8a8a8a', font: { size: 11 },
      backgroundColor: 'rgba(10,10,10,0.9)',
      yAdjust: 10,
    }
  },
  epicFury: {
    type: 'line',
    xMin: '2026-02-28', xMax: '2026-02-28',
    borderColor: 'rgba(204,0,0,0.9)',
    borderWidth: 2,
    label: {
      display: true, content: 'Op. Epic Fury', position: 'end',
      color: '#cc0000', font: { size: 11, weight: 'bold' },
      backgroundColor: 'rgba(10,10,10,0.95)',
      yAdjust: 30,
      xAdjust: -55,
    }
  },
};

const ctx = document.getElementById('spendingChart').getContext('2d');
const isMobile = window.innerWidth < 640;

// On mobile: hide all annotation labels (lines remain as visual guides).
// Labels overlap badly on narrow screens; the events list below provides full context.
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
    aspectRatio: isMobile ? 1.4 : 2,
    interaction: { mode: 'index', intersect: false },
    layout: {
      padding: { top: 16, right: isMobile ? 8 : 100, bottom: isMobile ? 8 : 40 },
    },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'month', displayFormats: { month: isMobile ? 'MMM' : 'MMM yy' } },
        grid: { color: 'rgba(255,255,255,0.03)' },
        ticks: { color: '#8a8a8a', font: { size: isMobile ? 9 : 11 }, maxRotation: 0, maxTicksLimit: isMobile ? 6 : 12 },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.03)' },
        ticks: {
          color: '#8a8a8a',
          font: { size: isMobile ? 9 : 11 },
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
