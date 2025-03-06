import {useState, useMemo} from 'react'

const usePagination = (data) => {

  const sortedData = useMemo(() => {
    const sortedStatus = {
      "resolved": 1,
      "pending": 3,
      "on-going": 2,
      "expired": 0,
    };
  
    return [...data].sort((a, b) => {
      // First, sort by status
      const statusDiff = sortedStatus[b.status] - sortedStatus[a.status];
      if (statusDiff !== 0) return statusDiff; // If different, use status order
  
      // If status is the same, sort by timestamp (latest first)
      return new Date(b.date) - new Date(a.date);
    });
  }, [data]);
  
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    // Use useMemo to memoize the currentItems calculation
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
    totalPages
    }
}

export default usePagination
