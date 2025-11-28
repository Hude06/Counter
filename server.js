import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage
const data = {};

app.use(bodyParser.json());
app.use(express.static('public')); // serve front-end if needed

// Helper: get current date in PT (YYYY-MM-DD)
function getPTDateKey() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000; // UTC timestamp
  const PToffset = -8 * 60 * 60 * 1000; // Eugene offset (manual DST adjustment if needed)
  const ptDate = new Date(utc + PToffset);
  return ptDate.toISOString().slice(0, 10);
}

// Reset at midnight
function scheduleMidnightReset() {
  const now = new Date();
  const msUntilMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0, 0, 0, 0
  ) - now;

  setTimeout(() => {
    const today = getPTDateKey();
    data[today] = {}; // reset counts for all users
    console.log('Daily pushups and pullups reset at PT midnight:', today);
    scheduleMidnightReset(); // schedule next reset
  }, msUntilMidnight);
}

// Initialize midnight reset
scheduleMidnightReset();

// Get today's counts
app.get('/counts', (req, res) => {
  const today = getPTDateKey();
  if (!data[today]) data[today] = {};
  res.json(data[today]);
});

// Add pushups and pullups for a user
app.post('/counts', (req, res) => {
  const { id, push = 0, pull = 0 } = req.body;

  if (!id || typeof push !== 'number' || typeof pull !== 'number') {
    return res.status(400).json({ error: 'Invalid data, need id, push number, and pull number' });
  }

  const today = getPTDateKey();
  if (!data[today]) data[today] = {};
  if (!data[today][id]) data[today][id] = { push: 0, pull: 0 };

  data[today][id].push += push;
  data[today][id].pull += pull;

  res.json({ id, push: data[today][id].push, pull: data[today][id].pull });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
