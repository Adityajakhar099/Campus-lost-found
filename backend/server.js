require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo").default;
const cors = require("cors");
const path = require("path");
const isProduction = process.env.NODE_ENV === "production";

require("./config/passport");

const app = express();


/* ---------- MongoDB ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

/* ---------- Middleware ---------- */
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: {
      httpOnly: true,
      secure: isProduction,              // ✅ true on Render
      sameSite: isProduction ? "none" : "lax", // ✅ OAuth-safe
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());


/* ---------- AUTH ROUTES ---------- */

app.get(
  "/auth/google",
  (req, res, next) => {
    console.log("Google login started");
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URL,
  }),
  (req, res) => {
    console.log("Google login success:", req.user?.email);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

/* ---------- USER ---------- */

app.get("/me", (req, res) => {
  if (req.user) res.json(req.user);
  else res.status(401).json({ message: "Not logged in" });
});

app.get("/auth/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) console.error("Session destroy error:", err);
      res.clearCookie("connect.sid");
      res.redirect(process.env.FRONTEND_URL);
    });
  });
});

/* ---------- API ROUTES ---------- */

const lostItemRoutes = require("./routes/LostItem");
const foundItemRoutes = require("./routes/FoundItem");
const claimRoutes = require("./routes/claimRoutes");
const profileRoutes = require("./routes/profile");

app.use("/api", lostItemRoutes);
app.use("/api", foundItemRoutes);
app.use("/api/claim", claimRoutes);
app.use("/api/profile", profileRoutes);

/* ---------- ERROR HANDLING ---------- */

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

/* ---------- START SERVER ---------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
