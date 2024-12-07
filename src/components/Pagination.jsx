import { useState } from "react";

const Pagination = ({
  currentPage,
  setCurrentPage,
  indexOfFirstItem,
  indexOfLastItem,
  totalPages,
  data = [],
}) => {
  const [jumpToPage, setJumpToPage] = useState("");
  const isDisable = indexOfLastItem >= data.length;
  const getShowingText = () => {
    const totalItems = data.length;
    const startItem = totalItems > 0 ? indexOfFirstItem + 1 : 0;
    const endItem = Math.min(indexOfLastItem, totalItems);
    return `Showing ${startItem} - ${endItem} of ${totalItems}`;
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const renderPageNumbers = () => {
    const pages = [];
    let startPage, endPage;

    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i}>
          <button
            onClick={() => setCurrentPage(i)}
            className={`hidden sm:flex items-center justify-center px-3 h-8 leading-tight ${
              currentPage === i
                ? "text-gray-900 bg-primary-300 border border-gray-400 hover:bg-primary-400 hover:text-gray-700 dark:bg-gray-600 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                : "text-gray-500 bg-white border border-gray-300 hover:bg-primary-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            }`}
          >
            {i}
          </button>
        </li>
      );
    }

    return pages;
  };

  const handleJumpToPage = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(jumpToPage);

    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
    setJumpToPage("");
  };

  return (
    <nav
      className="flex flex-col sm:flex-row items-center justify-between p-4 space-y-4 sm:space-y-0 bg-white dark:bg-gray-800"
      aria-label="Table navigation"
    >
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400 w-full sm:w-auto">
        <span className="font-semibold text-gray-900 dark:text-white">
          {getShowingText()}
        </span>
      </span>

      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
          <button
            className={`flex items-center justify-center px-3 h-8 ms-0 rounded-s-lg leading-tight border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
              currentPage === 1
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "hover:bg-gray-100 hover:text-gray-700 text-gray-600 bg-white"
            }`}
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 rounded-e-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
              isDisable
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "hover:bg-gray-100 hover:text-gray-700 text-gray-600 bg-white"
            }`}
            onClick={nextPage}
            disabled={isDisable}
          >
            Next
          </button>
        </ul>

        <form onSubmit={handleJumpToPage} className="flex items-center">
          <label
            htmlFor="jumpToPage"
            className="mr-2 text-gray-600 dark:text-gray-400 text-sm"
          >
            Jump to:
          </label>
          <input
            type="number"
            id="jumpToPage"
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            className="border px-2 py-1 h-8 w-16 dark:bg-gray-600 dark:text-white text-sm"
            min="1"
            max={totalPages}
          />
          <button
            type="submit"
            className="ml-2 px-3 py-1 h-8 bg-primary-500 dark:bg-primary-400 text-white rounded text-sm"
          >
            Go
          </button>
        </form>
      </div>
      <div></div>
    </nav>
  );
};

export default Pagination;
