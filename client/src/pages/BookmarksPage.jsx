import { useState, useEffect } from "react";
import { fetchBookmarks } from "../api/apiService";
import StoryCard from "../components/StoryCard";
import SkeletonList from "../components/SkeletonList";

const BookmarksPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const loadBookmarks = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchBookmarks();
      setStories(data.stories);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bookmarks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  // When a bookmark is removed from within this page, remove the card instantly
  const handleBookmarkToggle = (storyId, newState) => {
    if (!newState) {
      setStories((prev) => prev.filter((s) => s._id !== storyId));
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title"> My Bookmarks</h1>
        <p className="page-subtitle">
          {loading ? "Loading…" : `${stories.length} saved ${stories.length === 1 ? "story" : "stories"}`}
        </p>
      </div>

      {error && <div className="error-banner"> {error}</div>}

      {loading ? (
        <SkeletonList count={5} />
      ) : stories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-title">No bookmarks yet</div>
          <p className="empty-state-text">
            Browse the home page and click the bookmark icon on any story to save it here.
          </p>
        </div>
      ) : (
        <div className="stories-list">
          {stories.map((story, idx) => (
            <StoryCard
              key={story._id}
              story={story}
              rank={idx + 1}
              isBookmarked={true}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;
