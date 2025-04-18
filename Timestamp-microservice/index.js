const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Default timestamp route - current time
app.get("/api", (req, res) => {
    const now = new Date();
    res.json({
        unix: now.getTime(),
        utc: now.toUTCString()
    });
});

// Timestamp with date parameter
app.get("/api/:date", (req, res) => {
    const dateParam = req.params.date;
    let date;

    // If it's a number, treat it as Unix timestamp (milliseconds)
    if (!isNaN(dateParam)) {
        date = new Date(parseInt(dateParam));
    } else {
        // Try parsing the date string using a more standardized format (e.g., YYYY-MM-DD)
        date = new Date(dateParam);
        if (date.toString() === "Invalid Date") {
            // Try ISO format if it's not valid
            date = new Date(`${dateParam}T00:00:00Z`);
        }
    }

    // Handle invalid date
    if (date.toString() === "Invalid Date") {
        return res.json({ error: "Invalid Date" });
    }

    res.json({
        unix: date.getTime(),
        utc: date.toUTCString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
