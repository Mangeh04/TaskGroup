"use client";

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  type MouseEvent,
} from "react";

/**
 * Manages the state for a paginated and dynamically-sized list.
 * @param fullData The complete, unfiltered array of data items.
 * @param initialItemsPerPage Default items per page (can be updated later).
 * @param initialLoadTimeMs Duration of the initial skeleton loading state.
 */
export function usePaginatedView<T>(
  fullData: T[],
  initialItemsPerPage: number = 6,
  initialLoadTimeMs: number = 350
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Separate loading states:
  // 1. isLoading: For the initial page load (shows skeletons)
  // 2. isPaginating: For page changes (shows spinner)
  const [isLoading, setIsLoading] = useState(true);
  const [isPaginating, setIsPaginating] = useState(false);

  // --- Memoized Calculations ---

  const totalPages = useMemo(
    () => Math.ceil(fullData.length / itemsPerPage) || 1,
    [fullData.length, itemsPerPage]
  );

  const startIndex = useMemo(
    () => (currentPage - 1) * itemsPerPage,
    [currentPage, itemsPerPage]
  );

  const currentData = useMemo(
    () => fullData.slice(startIndex, startIndex + itemsPerPage),
    [fullData, startIndex, itemsPerPage]
  );

  const visibleCount = useMemo(() => {
    const remaining = Math.max(0, fullData.length - startIndex);
    return Math.min(itemsPerPage, remaining);
  }, [fullData.length, startIndex, itemsPerPage]);

  // --- Effects ---

  // Effect for initial load (skeletons)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, initialLoadTimeMs);
    return () => clearTimeout(timer);
  }, [initialLoadTimeMs]); // Only runs once on mount

  // Effect to correct current page if totalPages changes
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
    if (currentPage < 1 && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // --- Handlers (with useCallback) ---

  /**
   * Briefly shows the pagination spinner.
   */
  const flashPaginating = useCallback((minMs = 250) => {
    setIsPaginating(true);
    const id = setTimeout(() => setIsPaginating(false), minMs);
    return () => clearTimeout(id);
  }, []); // Setter state functions are stable

  const handlePrevious = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (currentPage === 1) return;
      flashPaginating();
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    },
    [currentPage, flashPaginating]
  );

  const handleNext = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (currentPage === totalPages) return;
      flashPaginating();
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    },
    [currentPage, totalPages, flashPaginating]
  );

  const handlePageClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, page: number) => {
      e.preventDefault();
      if (page === currentPage) return;
      flashPaginating();
      setCurrentPage(page);
    },
    [currentPage, flashPaginating]
  );

  return {
    currentPage,
    totalPages,
    currentData,
    visibleCount,
    isLoading,
    isPaginating,
    setItemsPerPage, // Expose setter for dynamic updates
    handlePrevious,
    handleNext,
    handlePageClick,
  };
}