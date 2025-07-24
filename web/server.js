const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// JSON-File
const profilePath = path.join(__dirname, "userProfile.json");

// Routen
app.get("/", (req, res) => {
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(profilePath));
  } catch (e) { }
  res.render("index", data);
});

app.post("/save-profile", (req, res) => {
  const profile = {
    hasHat: !!req.body.hasHat,
    hasRaincoat: !!req.body.hasRaincoat,
    hasWarmShoes: !!req.body.hasWarmShoes,
  };
  fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2));
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`🌐 Webinterface läuft auf http://localhost:${port}`);
});

