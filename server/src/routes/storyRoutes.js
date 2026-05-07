const express = require("express");
const router = express.Router();
const {
  getStories,
  getStoryById,
  toggleBookmark,
  getBookmarkedStories,
  triggerScrape,
} = require("../controllers/storyController");
const { protect } = require("../middleware/authMiddleware");

// GET  /api/stories              → All stories with pagination (public)
router.get("/", getStories);

// GET  /api/stories/bookmarks    → Logged-in user's bookmarked stories (protected)
router.get("/bookmarks", protect, getBookmarkedStories);

// GET  /api/stories/:id          → Single story by ID (public)
router.get("/:id", getStoryById);

// POST /api/stories/:id/bookmark → Toggle bookmark (protected)
router.post("/:id/bookmark", protect, toggleBookmark);

// POST /api/scrape               → Manually trigger scraper (public)
router.post("/scrape", triggerScrape);

module.exports = router;
