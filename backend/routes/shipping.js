const router = require('express').Router();

const METHODS = {
  collect: { label: 'Click & Collect (Cape Town / JHB)', cost: 0, days: '0 — pick up same day' },
  standard: { label: 'Standard Courier (3–5 business days)', cost: 5000, days: '3–5 business days' },
  express: { label: 'Express Courier (2–3 business days)', cost: 9900, days: '2–3 business days' },
  overnight: { label: 'Overnight (next business day)', cost: 14900, days: '1 business day' },
};

const REGIONS = {
  // South Africa provinces (free over R800)
  ZA: { name: 'South Africa', surcharge: 0, note: 'Free shipping on orders over R800' },
  // SADC neighbours
  BW: { name: 'Botswana', surcharge: 8000, note: 'Additional surcharge applies' },
  NA: { name: 'Namibia', surcharge: 8000, note: 'Additional surcharge applies' },
  ZW: { name: 'Zimbabwe', surcharge: 10000, note: 'Additional surcharge applies' },
  MZ: { name: 'Mozambique', surcharge: 12000, note: 'Additional surcharge applies' },
  SZ: { name: 'Eswatini (Swaziland)', surcharge: 6000, note: 'Additional surcharge applies' },
  LS: { name: 'Lesotho', surcharge: 5000, note: 'Additional surcharge applies' },
};

// GET /api/shipping/rates?subtotal=50000&country=ZA
router.get('/rates', (req, res) => {
  const subtotal = parseInt(req.query.subtotal) || 0;
  const country = (req.query.country || 'ZA').toUpperCase();
  const region = REGIONS[country] || REGIONS.ZA;

  const freeThreshold = country === 'ZA' ? 80000 : null;
  const isFreeEligible = freeThreshold && subtotal >= freeThreshold;

  const rates = Object.entries(METHODS).map(([key, m]) => {
    let cost = (isFreeEligible && key !== 'overnight') ? 0 : m.cost;
    cost += region.surcharge;
    return {
      method: key,
      label: m.label,
      cost,
      cost_zar: (cost / 100).toFixed(2),
      days: m.days,
      free: cost === 0,
    };
  });

  res.json({
    rates,
    region: { ...region, country },
    free_shipping_threshold: freeThreshold ? (freeThreshold / 100).toFixed(2) : null,
    free_shipping_eligible: isFreeEligible,
    subtotal_zar: (subtotal / 100).toFixed(2),
  });
});

// GET /api/shipping/countries
router.get('/countries', (req, res) => {
  res.json({ countries: Object.entries(REGIONS).map(([code, r]) => ({ code, ...r })) });
});

module.exports = router;
