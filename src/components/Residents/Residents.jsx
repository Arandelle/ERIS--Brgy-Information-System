import React, { useEffect, useState } from "react";
import ActionButton, { HeaderData } from "./ActionButton";
import { useNavigate } from "react-router-dom";
import HeadSide from "../ReusableComponents/HeaderSidebar";
import Pagination from "./Pagination";

const ResidentsList = ({ residents, label }) => {
  const [isActionOpen, setActionOpen] = useState(false);
  const [isFilter, setFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredResidents, setFilteredResidents] = useState(residents.slice());
  const [sortDirection, setSortDirection] = useState("asc"); // Track sort direction

  const itemsPerPage = 10;

  // to show the user using search input
  const [searchQuery, setSearchQuery] = useState("");

 
  useEffect(() => {
    let updatedResidents = residents.filter((resident) =>
      resident.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortDirection === "asc") {
      updatedResidents = updatedResidents.sort((a, b) => parseInt(a.age) - parseInt(b.age));
    } else {
      updatedResidents = updatedResidents.sort((a, b) => parseInt(b.age) - parseInt(a.age));
    }

    setFilteredResidents(updatedResidents);
  }, [residents, searchQuery, sortDirection]);

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

  const toggleAction = () => {
    setActionOpen(!isActionOpen);
    setFilter(false);
  };

  const toggleFilter = () => {
    setFilter(!isFilter);
    setActionOpen(false);
  };

  const handleSorting = () => {
    const sortedResidents = filteredResidents.slice().sort((a, b) => {
      // Convert ages to numbers for numeric comparison
      const ageA = parseInt(a.age);
      const ageB = parseInt(b.age);

      if (sortDirection === "asc") {
        return ageA - ageB; // Sort from younger to older
      } else {
        return ageB - ageA; // Sort from older to younger
      }
    });

    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    setFilteredResidents(sortedResidents);
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
            <div className="flex flex-row space-y-0 items-center gap-3">
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
            <div>
              <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-5"
            >
              <path
                fill-rule="evenodd"
                className="text-gray-400 cursor-pointer hover:text-gray-600 p-2 bg-gray-100"
                onClick={toggleFilter}
                d="M3.792 2.938A49.069 49.069 0 0 1 12 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 0 1 1.541 1.836v1.044a3 3 0 0 1-.879 2.121l-6.182 6.182a1.5 1.5 0 0 0-.439 1.061v2.927a3 3 0 0 1-1.658 2.684l-1.757.878A.75.75 0 0 1 9.75 21v-5.818a1.5 1.5 0 0 0-.44-1.06L3.13 7.938a3 3 0 0 1-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836Z"
                clip-rule="evenodd"
              />
            </svg>

            {isFilter && (
              <div
              id="dropdownAction"
              className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
            > <ul className="">
              <li >
          <a
            href="#"
            onClick={handleSorting}
            className={`block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`}
          >
           Sort by age
          </a>
        </li>
            </ul>
            </div>
            )}
              </div>  
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
              filteredResidents={filteredResidents}
            />
          </div>
        </div>
      }
    />
  );
};

export default ResidentsList;
