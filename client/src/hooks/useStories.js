import { useState, useEffect, useCallback } from "react";
import { fetchStories } from "../api/apiService";

/**
 * Custom hook to fetch paginated stories from the backend.
 * Returns stories, pagination info, loading and error states,
 * and a refetch function.
 */
const useStories = (initialPage = 1) => {
  const [stories, setStories]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages]   = useState(1);
  const [totalStories, setTotalStories] = useState(0);

  const loadStories = useCallback(async (page) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchStories(page, 10);
      setStories(data.stories);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalStories(data.totalStories);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch stories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStories(currentPage);
  }, [currentPage, loadStories]);

  return {
    stories,
    setStories,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    totalStories,
    refetch: () => loadStories(currentPage),
  };
};

export default useStories;
