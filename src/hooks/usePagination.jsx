import { useState, useMemo } from 'react';

const usePagination = (data) => {
  const sortedData = useMemo(() => {
    const sortedStatus = {
      "resolved": 1,
      "on-going": 2,
      "pending": 3,
      "expired": 0,
    };

    return [...data].sort((a, b) => {
      // Get status priority, default to -1 if status is missing
      const statusA = sortedStatus[a.status] ?? -1;
      const statusB = sortedStatus[b.status] ?? -1;
      if (a.isLocked && !b.isLocked) return 1;  // a is locked, b is not → a goes below
      if (!a.isLocked && b.isLocked) return -1;

      // Compare status priority
      const statusDiff = statusB - statusA;
      if (statusDiff !== 0) return statusDiff; // Prioritize status order

      // If status is the same or missing, sort by timestamp (latest first)
      return new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt);
    });
  }, [data]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = useMemo(() => {
    return sortedData.slice(indexOfFirstItem, indexOfLastItem);
  }, [sortedData, indexOfFirstItem, indexOfLastItem]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  return {
    currentPage,
    setCurrentPage,
    indexOfLastItem, 
    indexOfFirstItem,
    currentItems,
    totalPages,
  };
};

export default usePagination;
