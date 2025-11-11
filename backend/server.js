const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();

// Use Render's dynamic port or default to 3000 for local testing
const PORT = process.env.PORT || 3000;

// File paths for storing data
const DATA_FILE = path.join(__dirname, 'campaigns.json');
const USERS_FILE = path.join(__dirname, 'users.json');

// -------------------- Middleware --------------------
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// -------------------- Helper Functions --------------------
function readFile(file) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, '[]');
  return JSON.parse(fs.readFileSync(file));
}

function writeFile(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// -------------------- Campaign APIs --------------------

// Get all campaigns
app.get('/campaigns', (req, res) => {
  const campaigns = readFile(DATA_FILE);
  res.json(campaigns);
});

// Add new campaign
app.post('/campaigns', (req, res) => {
  const { name, client, startDate, status } = req.body;

  if (!name || !client || !startDate || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const campaigns = readFile(DATA_FILE);
  const newCampaign = {
    id: Date.now(),
    name,
    client,
    startDate,
    status
  };
  campaigns.push(newCampaign);
  writeFile(DATA_FILE, campaigns);
  res.json({ message: '✅ Campaign added successfully', campaign: newCampaign });
});

// Update campaign status
app.put('/campaigns/:id', (req, res) => {
  const campaigns = readFile(DATA_FILE);
  const campaign = campaigns.find(c => c.id == req.params.id);

  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });

  campaign.status = status;
  writeFile(DATA_FILE, campaigns);
  res.json({ message: '🔄 Campaign status updated', campaign });
});

// Delete campaign
app.delete('/campaigns/:id', (req, res) => {
  let campaigns = readFile(DATA_FILE);
  const exists = campaigns.some(c => c.id == req.params.id);

  if (!exists) return res.status(404).json({ error: 'Campaign not found' });

  campaigns = campaigns.filter(c => c.id != req.params.id);
  writeFile(DATA_FILE, campaigns);
  res.json({ message: '🗑️ Campaign deleted successfully' });
});

// -------------------- User APIs --------------------

// Signup
app.post('/signup', (req, res) => {
  const users = readFile(USERS_FILE);
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const newUser = { id: Date.now(), name, email, password };
  users.push(newUser);
  writeFile(USERS_FILE, users);

  res.json({ message: '✅ Signup successful', user: newUser });
});

// Login
app.post('/login', (req, res) => {
  const users = readFile(USERS_FILE);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(400).json({ error: 'Invalid email or password' });

  res.json({ message: '✅ Login successful', user });
});

// -------------------- Frontend Routes --------------------

// Default route -> Login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Signup route
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/signup.html'));
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

// Fallback for all other routes (important for Render hosting)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// -------------------- Start Server --------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
