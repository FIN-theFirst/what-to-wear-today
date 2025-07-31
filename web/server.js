const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = 3000;

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query(
      "SELECT id, password_hash FROM users WHERE username = $1",
      [username]
    );
    if (result.rows.length === 0) {
      return res.render("login", { error: "User not defined" });
    }
    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.render("login", { error: "Wrong Password" });
    }
    req.session.loggedIn = true;
    req.session.userId = user.id;
    res.redirect("/");
  } catch (err) {
    console.error("Error while logging in", err);
    res.status(500).render("login", { error: "Internal Error" });
  }
});

function requireLogin(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
}

app.get("/", requireLogin, async (req, res) => {
  const userId = req.session.userId;
  let data = {};
  try {
    const result = await db.query(
      "SELECT * FROM clothing_profile WHERE user_id = $1 LIMIT 1",
      [userId]
    );
    if (result.rows.length > 0) {
      data = result.rows[0];
    }
  } catch (err) {
    console.error("Error while loading", err);
  }

  res.render("index", data);
});

app.post("/save-profile", requireLogin, async (req, res) => {
  const userId = req.session.userId;
  const profile = {
    hasCap: req.body.hasCap,
    hasBeanie: req.body.hasBeanie,
    hasTShirt: req.body.hasTShirt,
    hasLongShirt: req.body.hasLongShirt,
    hasHoodie: req.body.hasHoodie,
    hasRainJacket: req.body.hasRainJacket,
    hasWinterJacket: req.body.hasWinterJacket,
    hasLightJacket: req.body.hasLightJacket,
    hasLongPants: req.body.hasLongPants,
    hasShortPants: req.body.hasShortPants,
    hasShoes: req.body.hasShoes,
    hasWarmShoes: req.body.hasWarmShoes,
    hasOpenShoes: req.body.hasOpenShoes,
    hasGloves: req.body.hasGloves,
    hasScarf: req.body.hasScarf,
    hasUmbrella: req.body.hasUmbrella,
    hasSunglasses: req.body.hasSunglasses,
  };

  try {
    await db.query("DELETE FROM clothing_profile WHERE user_id = $1", [userId]);

    await db.query(
      `
      INSERT INTO clothing_profile (
        user_id, hasCap, hasBeanie, hasTShirt, hasLongShirt,
        hasHoodie, hasRainJacket, hasWinterJacket, hasLightJacket,
        hasLongPants, hasShortPants, hasShoes, hasWarmShoes, hasOpenShoes,
        hasGloves, hasScarf, hasUmbrella, hasSunglasses
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12, $13, $14,
        $15, $16, $17, $18
      )
      `,
      [userId, ...Object.values(profile)]
    );

    res.redirect("/");
  } catch (err) {
    console.error("Error while Saving", err);
    res.status(500).send("❌ Error while Saving");
  }
});
app.get("/api/profile/:userId", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${process.env.INTERNAL_API_KEY}`) {
    return res.status(403).json({ error: "Access Denied" });
  }
  const userId = parseInt(req.params.userId, 10);
  try {
    const result = await db.query(
      "SELECT * FROM clothing_profile WHERE user_id = $1",
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Profile not Found" })
    }
    res.json(result.row[0]);
  } catch (err) {
    console.log("Error loading Profile via API", err);
    return res.status(500).json({ error: "Internal Error" });
  }
})

app.listen(port, () => {
  console.log(`🌐 Webinterface is running on http://localhost:${port}`);
});
