const axios = require("axios");
const cheerio = require("cheerio");
const Story = require("../models/Story");

const HN_URL = "https://news.ycombinator.com";

/**
 * Fetches and parses the top 10 stories from Hacker News.
 * Uses Cheerio to scrape the HTML and extracts title, url,
 * points, author, and postedAt from the DOM structure.
 *
 * Duplicate prevention: uses hnId (the HN story item number)
 * with upsert so existing stories are updated, not duplicated.
 */
const scrapeHackerNews = async () => {
  const { data: html } = await axios.get(HN_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; HNScraper/1.0)" },
    timeout: 10000,
  });

  const $ = cheerio.load(html);
  const stories = [];

  // Each HN story occupies two <tr> rows: .athing (title row) and the subtext row
  $("tr.athing").slice(0, 10).each((_, el) => {
    const titleRow = $(el);
    const subtextRow = titleRow.next("tr");

    // Extract the unique HN item id
    const hnId = titleRow.attr("id") || "";

    // Title and URL
    const titleAnchor = titleRow.find("span.titleline > a").first();
    const title = titleAnchor.text().trim() || "No Title";
    const rawUrl = titleAnchor.attr("href") || "";
    // Internal HN links start with "item?id=", prefix with base URL
    const url = rawUrl.startsWith("http") ? rawUrl : `${HN_URL}/${rawUrl}`;

    // Points (score)
    const pointsText = subtextRow.find("span.score").text().trim();
    const points = pointsText ? parseInt(pointsText.replace(" points", ""), 10) : 0;

    // Author
    const author = subtextRow.find("a.hnuser").text().trim() || "unknown";

    // Posted time
    const postedAt = subtextRow.find("span.age").attr("title") || 
                     subtextRow.find("span.age").text().trim() || "";

    stories.push({ hnId, title, url, points, author, postedAt });
  });

  // Upsert each story: update if hnId exists, insert if new
  const bulkOps = stories.map((story) => ({
    updateOne: {
      filter: { hnId: story.hnId },
      update: { $set: story },
      upsert: true,
    },
  }));

  if (bulkOps.length > 0) {
    await Story.bulkWrite(bulkOps);
  }

  console.log(`✅ Scraper: ${stories.length} stories saved/updated.`);
  return stories;
};

module.exports = { scrapeHackerNews };
