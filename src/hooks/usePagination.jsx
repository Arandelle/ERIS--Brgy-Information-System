import {useState, useMemo} from 'react'

const usePagination = (data) => {

    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
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
