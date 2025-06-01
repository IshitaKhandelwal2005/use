import { useState, useEffect, useMemo, useCallback } from 'react';
import config from '../config';

/**
 * Custom hook for handling pagination
 * @param {Array} items - The array of items to paginate
 * @param {Object} options - Pagination options
 * @param {number} options.initialPage - The initial page number (1-based)
 * @param {number} options.pageSize - The number of items per page
 * @param {boolean} options.autoResetPage - Whether to reset to page 1 when items change
 * @returns {Object} Pagination state and methods
 */
const usePagination = (
  items = [],
  {
    initialPage = 1,
    pageSize = config.app.defaultPageSize,
    autoResetPage = true,
  } = {}
) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);

  // Reset to first page when items change and autoResetPage is true
  useEffect(() => {
    if (autoResetPage) {
      setCurrentPage(1);
    }
  }, [items, autoResetPage]);

  // Calculate total pages
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / itemsPerPage)),
    [items.length, itemsPerPage]
  );

  // Ensure current page is within valid range
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (currentPage < 1 && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Get current items for the current page
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [currentPage, items, itemsPerPage]);

  // Go to specific page
  const goToPage = useCallback((page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  }, [totalPages]);

  // Go to next page
  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  // Go to previous page
  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  // Change items per page
  const changeItemsPerPage = useCallback((newSize) => {
    setItemsPerPage(prev => {
      const size = Number(newSize) || config.app.defaultPageSize;
      // Adjust current page if needed when changing page size
      const newTotalPages = Math.ceil(items.length / size) || 1;
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
      return size;
    });
  }, [currentPage, items.length]);

  // Get page numbers for pagination controls
  const getPageNumbers = useCallback(({ maxPages = 5 } = {}) => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = startPage + maxPages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

  // Calculate start and end item indices (1-based)
  const startItem = items.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, items.length);

  return {
    // State
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems: items.length,
    currentItems,
    
    // Navigation methods
    nextPage,
    prevPage,
    goToPage,
    changeItemsPerPage,
    getPageNumbers,
    
    // Helper properties
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    startItem,
    endItem,
    
    // Set state directly if needed
    setCurrentPage,
    setItemsPerPage: changeItemsPerPage,
  };
};

export default usePagination;
