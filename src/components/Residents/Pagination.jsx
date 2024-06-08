import React, { useState } from 'react';

const Pagination = ({residents}) => {
  const handleJumpToPage = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(jumpToPage);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
    setJumpToPage('');
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
            className={`px-3 py-2 leading-tight ${
              currentPage === i
                ? "flex items-center justify-center px-3 h-8 leading-tight text-gray-900 bg-primary-300 border border-gray-400 hover:bg-primary-400 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                : "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-primary-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            }`}
          >
            {i}
          </button>
        </li>
      );
    }
    return pages;
  };

  return (
         <div>
      <nav
        className="flex items-center dark:bg-gray-800 bg-white flex-column flex-wrap md:flex-row justify-between p-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {filteredResidents.length > 0
              ? `${indexOfFirstItem + 1} - ${
                  indexOfLastItem > filteredResidents.length
                    ? filteredResidents.length
                    : indexOfLastItem
                }`
              : "0"}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {filteredResidents.length}
          </span>
        </span>

        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
          <button
            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={nextPage}
            disabled={indexOfLastItem >= filteredResidents.length}
          >
            Next
          </button>
        </ul>
      </nav>

      <form onSubmit={handleJumpToPage} className="mt-4">
        <label htmlFor="jumpToPage" className="mr-2">Jump to page:</label>
        <input
          type="number"
          id="jumpToPage"
          value={jumpToPage}
          onChange={(e) => setJumpToPage(e.target.value)}
          className="border px-2 py-1"
          min="1"
          max={totalPages}
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-primary-300 text-white rounded"
        >
          Go
        </button>
      </form>
    </div>
  );
};

export default Pagination;
