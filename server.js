// server.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join('./daily.json');

app.use(bodyParser.json());
app.use(express.static('public')); // serve front-end if needed

// Helper: read data
function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

// Helper: save data
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
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
    const data = readData();
    const today = new Date().toISOString().slice(0, 10);
    data[today] = {}; // reset counts for all users
    saveData(data);
    scheduleMidnightReset(); // schedule next reset
    console.log('Daily pushups reset at midnight');
  }, msUntilMidnight);
}

// Initialize midnight reset
scheduleMidnightReset();

// Get today's pushups
app.get('/counts', (req, res) => {
  const data = readData();
  const today = new Date().toISOString().slice(0, 10);
  if (!data[today]) data[today] = {};
  res.json(data[today]);
});

// Add pushups for a user
app.post('/counts', (req, res) => {
  const { id, push } = req.body;
  if (!id || typeof push !== 'number') {
    return res.status(400).json({ error: 'Invalid data, need id and push number' });
  }

  const data = readData();
  const today = new Date().toISOString().slice(0, 10);
  if (!data[today]) data[today] = {};

  if (!data[today][id]) data[today][id] = 0;
  data[today][id] += push;

  saveData(data);
  res.json({ id, push: data[today][id] });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
