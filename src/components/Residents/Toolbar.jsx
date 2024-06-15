import React, { useState } from "react";
import ActionButton from "./ActionButton";
import SortingButton from "./SortingButton";
import ViewUserButton from "./ViewUserButton";
import FilterButton from "./FilterButton";

const Toolbar = ({
  label,
  searchQuery,
  setSearchQuery,
  filteredResidents,
  setFilteredResidents,
  selectedUsers,
  isViewingSelected,
  setIsViewingSelected,
}) => {

  const [isActionOpen, setActionOpen] = useState(false);
  const [isSort, setSort] = useState(false);
  const [isFilter, setFilter] = useState(false);

  const toggleAction = () => {
    setActionOpen(!isActionOpen);
    setSort(false);
    setFilter(false);
  };

  const toggleSort = () => {
    setSort(!isSort);
    setActionOpen(false);
    setFilter(false);
  };
  const toggleFilter = () => {
    setFilter(!isFilter)
    setSort(false);
    setActionOpen(false);
  };

  return (
    <div className="flex p-4 items-center md:justify-between flex-column gap-2 flex-wrap md:flex-row space-y-0 pb-4 bg-white dark:bg-gray-800">
      <div className="flex flex-col md:flex-row space-y-0 gap-2">
        <ActionButton
          selectedUsers={selectedUsers}
          filteredResidents={filteredResidents}
          toggleAction={toggleAction}
          isActionOpen={isActionOpen}
        />

        <SortingButton
          filteredResidents={filteredResidents}
          setFilteredResidents={setFilteredResidents}
          toggleSort={toggleSort}
          isSort={isSort}
          setSort={setSort}
        />

        <FilterButton toggleFilter={toggleFilter}/>

        <ViewUserButton
          filteredResidents={filteredResidents}
          isViewingSelected={isViewingSelected}
          setIsViewingSelected={setIsViewingSelected}
          selectedUsers={selectedUsers}
        />
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
  );
};

export default Toolbar;
