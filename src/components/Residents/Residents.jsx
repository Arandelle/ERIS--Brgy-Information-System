import React, { useState } from "react";
import ActionButton, { HeaderData } from "./ActionButton";
import { useNavigate } from "react-router-dom";
import HeadSide from "../ReusableComponents/HeaderSidebar";
import Pagination from "./Pagination";

const ResidentsList = ({ residents, label }) => {
  const [isActionOpen, setActionOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpToPage, setJumpToPage] = useState("");
  const itemsPerPage = 2;

  // to show the user using search input
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResidents = residents.filter((resident) =>
    resident.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate the indices for the current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResidents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // calculate the item per page
  const totalPages = Math.ceil(filteredResidents.length / itemsPerPage);
  const lastPageItems = filteredResidents.length % itemsPerPage || itemsPerPage;

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

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
                ? "flex items-center justify-center px-3 h-8 leading-tight text-gray-900 bg-primary-300 border border-gray-400 hover:bg-primary-400 hover:text-gray-700 dark:bg-primary-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
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

  const toggleAction = () => {
    setActionOpen(!isActionOpen);
  };
  const navigate = useNavigate();

  const handleActionMenu = (link) => {
    setActionOpen(false);
    navigate(link); // Use navigate for React Router navigation
  };

  const baseLink = `/residents/${label.toLowerCase()}`;

  return (
    <HeadSide
      child={
        <div className="flex flex-col justify-center m-3 rounded-lg">
          <div className="flex p-4 items-center md:justify-between flex-column gap-2 flex-wrap md:flex-row space-y-0 pb-4 bg-white dark:bg-gray-800">
            <div>
              <button
                onClick={toggleAction}
                id="dropdownActionButton"
                data-dropdown-toggle="dropdownAction"
                className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                type="button"
              >
                <span className="sr-only">Action button</span>
                Action
                <svg
                  className="w-2.5 h-2.5 ms-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              {/* Dropdown menu */}
              {isActionOpen && (
                <div
                  id="dropdownAction"
                  className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                >
                  <ActionButton
                    baseLink={baseLink}
                    handleActionMenu={handleActionMenu}
                  />
                </div>
              )}
            </div>
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <label
              htmlFor=""
              className="text-md lg:text-lg text-center dark:text-green-500"
            >
              {label}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="table-search-users"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder={`Search for residents of ${label}`}
              />
            </div>
          </div>
          <div className="overflow-auto w-full">
            {filteredResidents == 0 ? (
              <div className="py-32 text-gray-500 text-center justify-center items-center">
                No data found
              </div>
            ) : (
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-all-search"
                          type="checkbox"
                          className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="checkbox-all-search"
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </th>
                    {HeaderData.map((header) => (
                      <th scope="col" className="px-6 py-3">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((residents, key) => (
                    <tr
                      key={key}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="w-4 p-4">
                        <div className="flex items-center">
                          <input
                            id="checkbox-table-search-1"
                            type="checkbox"
                            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label
                            htmlFor={`checkbox-table-search-${residents.id}`}
                            className="sr-only"
                          >
                            checkbox
                          </label>
                        </div>
                      </td>
                      <th
                        scope="row"
                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        <img
                          className="w-10 h-10 rounded-full"
                          src={residents.img}
                          alt="Jese image"
                        />
                        <div className="ps-3">
                          <div className="text-base font-semibold">
                            {residents.name}
                          </div>
                          <div className="font-normal text-gray-500">
                            {residents.email}
                          </div>
                        </div>
                      </th>
                      <td className="px-6 py-4">{residents.address}</td>
                      <td className="px-6 py-4">{residents.age}</td>
                      <td className="px-6 py-4">{residents.gender}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div
                            className={`h-2.5 w-2.5 rounded-full bg-green-500 me-2 ${
                              residents.status === "Activated"
                                ? "bg-green-500"
                                : "bg-red-500"
                            } me-2`}
                          />{" "}
                          {residents.status === "Activated"
                            ? "Activated"
                            : "Not Activated"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href="#"
                          className="font-medium text-primary-600 dark:text-primary-500 hover:underline"
                        >
                          View user
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div>
      <nav
        className="flex items-center dark:bg-gray-800 bg-white flex-column flex-wrap md:flex-row justify-between p-4 space-y-0"
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

        <ul className="inline-flex  -space-x-px rtl:space-x-reverse text-sm h-8">
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
        <form onSubmit={handleJumpToPage} className="mt-4">
        <label htmlFor="jumpToPage" className="mr-2 text-gray-600 dark:text-gray-400">Jump to page:</label>
        <input
          type="number"
          id="jumpToPage"
          value={jumpToPage}
          onChange={(e) => setJumpToPage(e.target.value)}
          className="border px-2 py-1 h-6 dark:bg-gray-600 dark:text-white"
          min="1"
          max={totalPages}
        />
        <button
          type="submit"
          className="ml-2 px-4 py-1 h-8 bg-primary-500 dark:ng-primary-400 text-white rounded"
        >
          Go
        </button>
      </form>
      </nav>
    </div>
        </div>
      }
    />
  );
};

export default ResidentsList;
