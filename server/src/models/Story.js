const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    url: {
      type: String,
      default: "",
      trim: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    author: {
      type: String,
      default: "unknown",
      trim: true,
    },
    // When the story was posted on HackerNews (scraped field)
    postedAt: {
      type: String,
      default: "",
    },
    // Unique HackerNews story ID used to prevent duplicates
    hnId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

// Index on points for fast descending sort queries
storySchema.index({ points: -1 });

module.exports = mongoose.model("Story", storySchema);
