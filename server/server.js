require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const { scrapeHackerNews } = require("./src/scraper/scraperService");

const PORT = process.env.PORT || 5000;

/**
 * Start sequence:
 * 1. Connect to MongoDB
 * 2. Run initial scrape to populate stories on startup
 * 3. Start Express server
 */
const startServer = async () => {
  await connectDB();

  // Auto-run scraper on startup (non-blocking — errors are logged, not fatal)
  scrapeHackerNews().catch((err) =>
    console.error("⚠️  Startup scrape failed:", err.message)
  );

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
