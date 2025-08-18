import express from 'express';
import User from '../models/User.js';
import { authRequired } from '../middleware/auth.js';
import { horoscopeLimiter } from '../middleware/rateLimit.js';
import { HOROSCOPES } from '../utils/horoscopes.js';

const router = express.Router();

function todayISO() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// GET /horoscope/today
router.get('/today', authRequired, horoscopeLimiter, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const date = todayISO();
    const text = HOROSCOPES[user.zodiac] || 'Look within and move with intention.';

    // Bonus: store served horoscope in history (idempotent per date)
    const exists = user.history.some(h => h.date === date);
    if (!exists) {
      user.history.push({ date, sign: user.zodiac, text });
      // Keep most recent 60 only
      if (user.history.length > 60) user.history = user.history.slice(-60);
      await user.save();
    }

    return res.json({ date, sign: user.zodiac, text });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /horoscope/history (last 7 days)
router.get('/history', authRequired, horoscopeLimiter, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const today = todayISO();

    const results = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(today, -i);
      // Prefer stored text if exists, else generate from static
      const stored = user.history.find(h => h.date === date);
      const text = stored?.text || (HOROSCOPES[user.zodiac] || 'Look within and move with intention.');
      results.push({ date, sign: user.zodiac, text });
    }
    return res.json({ sign: user.zodiac, days: results });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
