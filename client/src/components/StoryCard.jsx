import { useState } from "react";
import { toggleBookmarkApi } from "../api/apiService";
import { useAuth } from "../context/AuthContext";
import { formatRelativeTime, formatDomain } from "../utils/formatters";
import toast from "react-hot-toast";

/**
 * StoryCard displays a single HackerNews story.
 * Props:
 *   story        – the story object
 *   rank         – display number (1-based)
 *   isBookmarked – boolean, controlled by parent
 *   onBookmarkToggle – callback(storyId, newBookmarkedState) to sync parent state
 */
const StoryCard = ({ story, rank, isBookmarked, onBookmarkToggle }) => {
  const { isAuthenticated } = useAuth();
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [toggling, setToggling]     = useState(false);

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to bookmark stories.");
      return;
    }
    setToggling(true);
    try {
      const { data } = await toggleBookmarkApi(story._id);
      setBookmarked(data.bookmarked);
      onBookmarkToggle?.(story._id, data.bookmarked);
      toast.success(data.bookmarked ? "Bookmarked!" : "Bookmark removed");
    } catch {
      toast.error("Failed to update bookmark.");
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="story-card">
      {/* Rank number */}
      <span className="story-rank">#{rank}</span>

      {/* Main content */}
      <div className="story-content">
        <a
          href={story.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="story-title"
        >
          {story.title}
        </a>

        <div className="story-meta">
          {/* Points badge */}
          <span className="meta-badge points">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {story.points} pts
          </span>

          {/* Author badge */}
          <span className="meta-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            {story.author}
          </span>

          {/* Time badge */}
          <span className="meta-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
            {formatRelativeTime(story.postedAt)}
          </span>

          {/* Domain badge */}
          {story.url && (
            <span className="meta-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              {formatDomain(story.url)}
            </span>
          )}
        </div>
      </div>

      {/* Bookmark button */}
      <button
        className={`bookmark-btn ${bookmarked ? "bookmarked" : ""}`}
        onClick={handleBookmark}
        disabled={toggling}
        title={bookmarked ? "Remove bookmark" : "Add bookmark"}
        aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </div>
  );
};

export default StoryCard;
