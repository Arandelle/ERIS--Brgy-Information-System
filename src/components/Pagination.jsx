import React, { useState } from "react";
import FileHandlerButtons from "../screens/AccountList/buttons/FileHandlerButtons";

const Pagination = ({}) => {
    const currentPage = 1
    const isDisable = true
  return (
    <nav
      className="flex flex-col sm:flex-row items-center justify-between p-4 space-y-4 sm:space-y-0 bg-white dark:bg-gray-800"
      aria-label="Table navigation"
    >
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400 w-full sm:w-auto">
        <span className="font-semibold text-gray-900 dark:text-white">
          Showing of 1 - 1 of 1
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
            // onClick={prevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>

            1

          <button
            className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 rounded-e-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
              isDisable
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "hover:bg-gray-100 hover:text-gray-700 text-gray-600 bg-white"
            }`}
            // onClick={nextPage}
            disabled={isDisable}
          >
            Next
          </button>
        </ul>

        <form  className="flex items-center">
          <label
            htmlFor="jumpToPage"
            className="mr-2 text-gray-600 dark:text-gray-400 text-sm"
          >
            Jump to:
          </label>
          <input
            type="number"
            id="jumpToPage"
            className="border px-2 py-1 h-8 w-16 dark:bg-gray-600 dark:text-white text-sm"
            min="1"
          />
          <button
            type="submit"
            className="ml-2 px-3 py-1 h-8 bg-primary-500 dark:bg-primary-400 text-white rounded text-sm"
          >
            Go
          </button>
        </form>
      </div>

      <FileHandlerButtons />
    </nav>
  );
};

export default Pagination;