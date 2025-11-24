// server.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join('./daily.json');

app.use(bodyParser.json());
app.use(express.static('public')); // serve your front-end if needed

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

// Reset daily counts (optional route)
app.post('/reset', (req, res) => {
  const data = readData();
  const today = new Date().toISOString().slice(0, 10);
  data[today] = { push: 0, pull: 0 };
  saveData(data);
  res.json({ success: true });
});

// Get today's counts
app.get('/counts', (req, res) => {
  const data = readData();
  const today = new Date().toISOString().slice(0, 10);
  if (!data[today]) data[today] = { push: 0, pull: 0 };
  res.json(data[today]);
});

// Update counts
app.post('/counts', (req, res) => {
  const { push, pull } = req.body;
  if (typeof push !== 'number' || typeof pull !== 'number') {
    return res.status(400).json({ error: 'Invalid data' });
  }

  const data = readData();
  const today = new Date().toISOString().slice(0, 10);
  if (!data[today]) data[today] = { push: 0, pull: 0 };

  data[today].push += push;
  data[today].pull += pull;

  saveData(data);
  res.json(data[today]);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
