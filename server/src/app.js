const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const storyRoutes = require("./routes/storyRoutes");

const app = express();

// ─── CORS ──────────────────────────────────────────────────────────────────────
// Allow requests from the React dev server (and any CLIENT_URL set in .env).
// Using the cors package's native origin array — avoids calling next(err)
// internally which breaks in Express 5 when 404 handler has no next param.
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (Postman, curl) where origin is undefined
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Return false (blocked) instead of throwing — safe in Express 5
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Body Parser ───────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/stories", storyRoutes);

// Manual scrape endpoint at /api/scrape (delegates to story controller)
const { triggerScrape } = require("./controllers/storyController");
app.post("/api/scrape", async (req, res) => {
  try {
    await triggerScrape(req, res);
  } catch (error) {
    res.status(500).json({ message: "Scrape failed", error: error.message });
  }
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
