const Story = require("../models/Story");
const User = require("../models/User");
const { scrapeHackerNews } = require("../scraper/scraperService");

/**
 * @route   GET /api/stories
 * @desc    Get all stories, sorted by points descending, with pagination
 * @access  Public
 * @query   page (default: 1), limit (default: 10)
 */
const getStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Story.countDocuments();
    const stories = await Story.find()
      .sort({ points: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      stories,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalStories: total,
    });
  } catch (err) {
    console.error("getStories error:", err.message);
    res.status(500).json({ message: err.message || "Failed to fetch stories" });
  }
};

/**
 * @route   GET /api/stories/:id
 * @desc    Get a single story by its MongoDB ID
 * @access  Public
 */
const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.status(200).json(story);
  } catch (err) {
    console.error("getStoryById error:", err.message);
    res.status(500).json({ message: err.message || "Failed to fetch story" });
  }
};

/**
 * @route   POST /api/stories/:id/bookmark
 * @desc    Toggle bookmark for a story (add if not bookmarked, remove if bookmarked)
 * @access  Private (requires JWT)
 */
const toggleBookmark = async (req, res) => {
  try {
    const storyId = req.params.id;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const isBookmarked = user.bookmarks.includes(storyId);

    if (isBookmarked) {
      // Remove bookmark
      user.bookmarks = user.bookmarks.filter((id) => id.toString() !== storyId);
      await user.save();
      return res.status(200).json({ bookmarked: false, message: "Bookmark removed" });
    } else {
      // Add bookmark
      user.bookmarks.push(storyId);
      await user.save();
      return res.status(200).json({ bookmarked: true, message: "Bookmark added" });
    }
  } catch (err) {
    console.error("toggleBookmark error:", err.message);
    res.status(500).json({ message: err.message || "Failed to toggle bookmark" });
  }
};

/**
 * @route   GET /api/stories/bookmarks
 * @desc    Get all bookmarked stories for the logged-in user
 * @access  Private (requires JWT)
 */
const getBookmarkedStories = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("bookmarks");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ stories: user.bookmarks });
  } catch (err) {
    console.error("getBookmarkedStories error:", err.message);
    res.status(500).json({ message: err.message || "Failed to fetch bookmarks" });
  }
};

/**
 * @route   POST /api/scrape
 * @desc    Manually trigger the HackerNews scraper
 * @access  Public
 */
const triggerScrape = async (req, res) => {
  try {
    const stories = await scrapeHackerNews();
    res.status(200).json({ message: "Scrape successful", count: stories.length });
  } catch (err) {
    console.error("triggerScrape error:", err.message);
    res.status(500).json({ message: err.message || "Scrape failed" });
  }
};

module.exports = {
  getStories,
  getStoryById,
  toggleBookmark,
  getBookmarkedStories,
  triggerScrape,
};
