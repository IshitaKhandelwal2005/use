import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for implementing infinite scroll functionality
 * @param {Function} loadMore - Function to call when more items should be loaded
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Number of pixels before the bottom to trigger loading
 * @param {boolean} options.hasMore - Whether there are more items to load
 * @param {boolean} options.initialLoad - Whether to load the first page immediately
 * @param {boolean} options.resetDeps - Dependencies that should trigger a reset when changed
 * @returns {[React.RefObject, boolean, Function]} - [ref to attach to scroll container, loading state, reset function]
 */
const useInfiniteScroll = (
  loadMore,
  {
    threshold = 100,
    hasMore = true,
    initialLoad = false,
    resetDeps = [],
  } = {}
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observer = useRef(null);
  const loadMoreRef = useRef(null);
  const lastLoadTime = useRef(0);
  const initialLoadRef = useRef(initialLoad);

  // Reset state when resetDeps change
  const reset = useCallback(() => {
    setPage(1);
    setIsLoading(false);
    lastLoadTime.current = 0;
  }, []);

  // Reset when resetDeps change
  useEffect(() => {
    reset();
  }, [...resetDeps]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle the actual loading of more items
  const handleLoadMore = useCallback(async () => {
    // Prevent multiple simultaneous loads
    if (isLoading || !hasMore) return;

    // Throttle loading to prevent too many rapid requests
    const now = Date.now();
    if (now - lastLoadTime.current < 1000) return; // 1 second throttle
    lastLoadTime.current = now;

    setIsLoading(true);
    try {
      await loadMore(page);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, loadMore]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!hasMore) return;

    const currentObserver = observer.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoading) {
          handleLoadMore();
        }
      },
      {
        root: null, // viewport
        rootMargin: `${threshold}px`,
        threshold: 0.1,
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      currentObserver.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        currentObserver.unobserve(currentRef);
      }
    };
  }, [handleLoadMore, hasMore, isLoading, threshold]);

  // Initial load if needed
  useEffect(() => {
    if (initialLoadRef.current && hasMore) {
      initialLoadRef.current = false;
      handleLoadMore();
    }
  }, [handleLoadMore, hasMore]);

  return [loadMoreRef, isLoading, reset];
};

export default useInfiniteScroll;
