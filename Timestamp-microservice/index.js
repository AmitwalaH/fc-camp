// index.js
var express = require('express');
var app = express();
var cors = require('cors');

// Enable CORS for API testing
app.use(cors({ optionsSuccessStatus: 200 }));

// Serve static files (like the HTML file)
app.use(express.static('public'));

// Serve the HTML page
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Timestamp API Endpoint
app.get("/api/:date?", function (req, res) {
  let date = req.params.date;
  let unix;
  let utc;

  // If no date is provided (empty or missing date parameter), return current timestamp
  if (!date) {
    unix = new Date().getTime();
    utc = new Date().toUTCString();
    return res.json({ unix: unix, utc: utc });
  }

  // Handle the case where date is a number (Unix timestamp)
  let parsedDate = isNaN(date) ? new Date(date) : new Date(parseInt(date));

  // If the date is invalid, return error
  if (parsedDate == 'Invalid Date') {
    return res.json({ error: "Invalid Date" });
  } else {
    unix = parsedDate.getTime();
    utc = parsedDate.toUTCString();
    res.json({ unix: unix, utc: utc });
  }
});

// Start the server on a dynamic port (or default to 3000)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
