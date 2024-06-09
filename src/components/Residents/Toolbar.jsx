import React, { useState } from "react";
import ActionButton from "./ActionButton";
import SortingButton from "./SortingButton";
import ViewUserButton from "./ViewUserButton";

const Toolbar = ({
  label,
  searchQuery,
  setSearchQuery,
  filteredResidents,
  setFilteredResidents,
  selectedUsers,
  isViewingSelected,
  setIsViewingSelected
}) => {
  const [isActionOpen, setActionOpen] = useState(false);
  const [isSort, setSort] = useState(false);

  const toggleAction = () => {
    setActionOpen(!isActionOpen);
    setSort(false);
  };

  const toggleFilter = () => {
    setSort(!isSort);
    setActionOpen(false);
  };

  return (
    <div className="flex p-4 items-center md:justify-between flex-column gap-2 flex-wrap md:flex-row space-y-0 pb-4 bg-white dark:bg-gray-800 rounded-md">
      <div className="flex flex-row space-y-0 items-center gap-3">

        <ActionButton
          selectedUsers={selectedUsers}
          filteredResidents={filteredResidents}
          toggleAction={toggleAction}
          isActionOpen={isActionOpen}
        />

        <SortingButton
          filteredResidents={filteredResidents}
          setFilteredResidents={setFilteredResidents}
          toggleFilter={toggleFilter}
          isSort={isSort}
          setSort={setSort}
        />
        <ViewUserButton isViewingSelected={isViewingSelected} setIsViewingSelected={setIsViewingSelected}/>
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
