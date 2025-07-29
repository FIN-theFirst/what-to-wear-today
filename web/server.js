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
  console.log("SQL Login Query:", username);
  try {
    const result = await db.query(
      "SELECT id, password_hash FROM users WHERE username = $1",
      [username]
    );
    if (result.rows.length === 0) {
      return res.render("login", { error: "Benutzer nicht gefunden" });
    }
    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.render("login", { error: "Falsches Passwort" });
    }
    req.session.loggedIn = true;
    req.session.userId = user.id;
    res.redirect("/");
  } catch (err) {
    console.error("Fehler beim Login", err);
    res.status(500).render("login", { error: "Interner Fehler" });
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
  const profile = {
    has_cap: !!req.body.hasCap,
    has_beanie: !!req.body.hasBeanie,
    has_tshirt: !!req.body.hasTShirt,
    has_longshirt: !!req.body.hasLongShirt,
    has_hoodie: !!req.body.hasHoodie,
    has_rainjacket: !!req.body.hasRainJacket,
    has_winterjacket: !!req.body.hasWinterJacket,
    has_lightjacket: !!req.body.hasLightJacket,
    has_longpants: !!req.body.hasLongPants,
    has_shortpants: !!req.body.hasShortPants,
    has_shoes: !!req.body.hasShoes,
    has_warmshoes: !!req.body.hasWarmShoes,
    has_openshoes: !!req.body.hasOpenShoes,
    has_gloves: !!req.body.hasGloves,
    has_scarf: !!req.body.hasScarf,
    has_umbrella: !!req.body.hasUmbrella,
    has_sunglasses: !!req.body.hasSunglasses,
  };
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
    const clothing_profile = await db.query(
      `
      SELECT * FROM clothing_profile WHERE user_id = $1
      `,
      [userId, ...Object.values(profile)]
    );
    console.log(clothing_profile);

  } catch (err) {
    console.error("Fehler beim Laden:", err);
  }

  res.render("index", data);
});

app.post("/save-profile", requireLogin, async (req, res) => {
  const userId = req.session.userId;
  const profile = {
    has_cap: !!req.body.hasCap,
    has_beanie: !!req.body.hasBeanie,
    has_tshirt: !!req.body.hasTShirt,
    has_longshirt: !!req.body.hasLongShirt,
    has_hoodie: !!req.body.hasHoodie,
    has_rainjacket: !!req.body.hasRainJacket,
    has_winterjacket: !!req.body.hasWinterJacket,
    has_lightjacket: !!req.body.hasLightJacket,
    has_longpants: !!req.body.hasLongPants,
    has_shortpants: !!req.body.hasShortPants,
    has_shoes: !!req.body.hasShoes,
    has_warmshoes: !!req.body.hasWarmShoes,
    has_openshoes: !!req.body.hasOpenShoes,
    has_gloves: !!req.body.hasGloves,
    has_scarf: !!req.body.hasScarf,
    has_umbrella: !!req.body.hasUmbrella,
    has_sunglasses: !!req.body.hasSunglasses,
  };

  try {
    await db.query("DELETE FROM clothing_profile WHERE user_id = $1", [userId]);

    await db.query(
      `
      INSERT INTO clothing_profile (
        user_id, has_cap, has_beanie, has_tshirt, has_longshirt,
        has_hoodie, has_rainjacket, has_winterjacket, has_lightjacket,
        has_longpants, has_shortpants, has_shoes, has_warmshoes, has_openshoes,
        has_gloves, has_scarf, has_umbrella, has_sunglasses
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
    console.error("Fehler beim Speichern:", err);
    res.status(500).send("❌ Fehler beim Speichern");
  }
});

app.listen(port, () => {
  console.log(`🌐 Webinterface läuft auf http://localhost:${port}`);
});
