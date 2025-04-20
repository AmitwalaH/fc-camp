require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();

const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));

// Simulated in-memory DB (array of { original_url, short_url })
const urlDatabase = [];

// Root route
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Test API
app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' });
});

// POST a new URL
app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  const urlRegex = /^(http|https):\/\/[^ "]+$/;

  // Validate URL
  if (!urlRegex.test(url)) {
    return res.json({ error: 'invalid url' });
  }

  // Check if already exists
  const existing = urlDatabase.find(entry => entry.original_url === url);
  if (existing) {
    return res.json(existing);
  }

  // Generate a random short URL (e.g., 5-char alphanumeric)
  const shortUrl = crypto.randomBytes(3).toString('hex');

  const newEntry = {
    original_url: url,
    short_url: shortUrl
  };

  urlDatabase.push(newEntry);

  res.json(newEntry);
});

// Redirect to original URL
app.get('/api/shorturl/:shortid', (req, res) => {
  const shortId = req.params.shortid;
  const entry = urlDatabase.find(e => e.short_url === shortId);

  if (entry) {
    res.redirect(entry.original_url);
  } else {
    res.json({ error: 'invalid url' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
