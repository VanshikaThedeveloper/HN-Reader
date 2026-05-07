import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchBookmarks } from "../api/apiService";
import useStories from "../hooks/useStories";
import StoryCard from "../components/StoryCard";
import SkeletonList from "../components/SkeletonList";
import Pagination from "../components/Pagination";
import { triggerScrape } from "../api/apiService";
import toast from "react-hot-toast";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { stories, setStories, loading, error, currentPage, setCurrentPage, totalPages, totalStories, refetch } = useStories(1);
  const [bookmarkedIds, setBookmarkedIds]   = useState(new Set());
  const [bookmarksLoaded, setBookmarksLoaded] = useState(false);
  const [scraping, setScraping]             = useState(false);

  // Load the user's bookmark IDs once when authenticated, to mark cards correctly
  const loadBookmarks = async () => {
    if (!isAuthenticated || bookmarksLoaded) return;
    try {
      const { data } = await fetchBookmarks();
      setBookmarkedIds(new Set(data.stories.map((s) => s._id)));
      setBookmarksLoaded(true);
    } catch {
      // silently ignore — bookmarks are non-critical
    }
  };

  // Load the user's bookmark IDs once on mount when authenticated, to mark cards correctly
  useEffect(() => {
    loadBookmarks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleBookmarkToggle = (storyId, newState) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      newState ? next.add(storyId) : next.delete(storyId);
      return next;
    });
  };

  const handleScrape = async () => {
    setScraping(true);
    try {
      const { data } = await triggerScrape();
      toast.success(`Scraper ran: ${data.count} stories updated`);
      refetch();
    } catch {
      toast.error("Scraper failed. Try again.");
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="page-title">Top HackerNews Stories</h1>
          <p className="page-subtitle">
            {loading ? "Loading stories…" : `${totalStories} stories · Page ${currentPage} of ${totalPages}`}
          </p>
        </div>
        <button
          className="nav-btn nav-btn-ghost"
          onClick={handleScrape}
          disabled={scraping}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.825rem" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: scraping ? "spin 1s linear infinite" : "none" }}>
            <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          {scraping ? "Scraping…" : "Re-scrape"}
        </button>
      </div>

      {/* Error */}
      {error && <div className="error-banner">⚠️ {error}</div>}

      {/* Stories or skeleton */}
      {loading ? (
        <SkeletonList count={10} />
      ) : stories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">No stories found</div>
          <p className="empty-state-text">Try re-scraping to fetch the latest stories.</p>
        </div>
      ) : (
        <div className="stories-list">
          {stories.map((story, idx) => (
            <StoryCard
              key={story._id}
              story={story}
              rank={(currentPage - 1) * 10 + idx + 1}
              isBookmarked={bookmarkedIds.has(story._id)}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default HomePage;
