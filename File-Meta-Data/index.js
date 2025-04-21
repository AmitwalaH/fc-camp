const express = require("express");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));
app.use(express.static("views"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/fileanalyse", upload.single("upfile"), function (req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = path.join(__dirname, "uploads", req.file.filename);
  const fileStats = fs.statSync(filePath);

  const fileInfo = {
    name: req.file.originalname,
    type: req.file.mimetype,
    size: fileStats.size,
  };

  res.json(fileInfo);
});

app.get("/api/fileanalyse", function (req, res) {
  res.json({ error: "No file uploaded" });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
