require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo").default;
const cors = require("cors");
const path = require("path");

require("./config/passport");

const app = express();

/* ---------- MongoDB ---------- */
mongoose
  .connect("mongodb://127.0.0.1:27017/lostfound")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

/* ---------- Middleware ---------- */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Session configuration
app.use(
  session({
    secret: "secret123",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/lostfound",
    }),
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

/* ---------- AUTH ROUTES ---------- */

// Google login
app.get(
  "/auth/google",
  (req, res, next) => {
    console.log("Google login started");
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000",
  }),
  (req, res) => {
    console.log("Google login success:", req.user?.email);
    res.redirect("http://localhost:3000/dashboard");
  }
);

// Get logged-in user
app.get("/me", (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

// Logout
app.get("/auth/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) console.error("Session destroy error:", err);
      res.clearCookie("connect.sid");
      res.redirect("http://localhost:3000");
    });
  });
});

/* ---------- API ROUTES ---------- */
const lostItemRoutes = require("./routes/LostItem");
const foundItemRoutes = require("./routes/FoundItem");

app.use("/api", lostItemRoutes);
app.use("/api", foundItemRoutes);

const claimRoutes = require("./routes/claimRoutes");
app.use("/api/claim", claimRoutes);

/* 🔥 ADDED PROFILE ROUTES (ONLY ADDITION) */
const profileRoutes = require("./routes/profile");
app.use("/api/profile", profileRoutes);

/* ---------- ERROR HANDLING ---------- */

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

/* ---------- START SERVER ---------- */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
