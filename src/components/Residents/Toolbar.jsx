import React, { useState } from "react";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import ActionButton from "./ActionButton";
import { toast } from "sonner";

const Toolbar = ({
  label,
  searchQuery,
  setSearchQuery,
  filteredResidents,
  setFilteredResidents,
  selectedUsers,
}) => {
  const actionButton = [
    { title: "Default", type: "id" },
    { title: "Sort by age", type: "age" },
    { title: "Sort by date created", type: "created" },
    { title: "Sort by status", type: "status" },
  ];
  const [isActionOpen, setActionOpen] = useState(false);
  const [isFilter, setFilter] = useState(false);
  const [ageSortDirection, setAgeSortDirection] = useState("asc");
  const [dateSortDirection, setDateSortDirection] = useState("asc");
  const [statusSortDirection, setStatusSortDirection] = useState("asc");

  const toggleAction = () => {
    setActionOpen(!isActionOpen);
    setFilter(false);
  };

  const toggleFilter = () => {
    setFilter(!isFilter);
    setActionOpen(false);
  };

  const handleSorting = (field) => {
    let sortedResidents = [...filteredResidents];

    if (field === "id") {
      sortedResidents = sortedResidents.slice().sort((a, b) => {
        return a.id - b.id;
      });
    } else if (field === "age") {
      sortedResidents = sortedResidents.slice().sort((a, b) => {
        const ageA = parseInt(a.age);
        const ageB = parseInt(b.age);
        return ageSortDirection === "asc" ? ageA - ageB : ageB - ageA;
      });
      setAgeSortDirection(ageSortDirection === "asc" ? "desc" : "asc");
    } else if (field === "created") {
      sortedResidents = sortedResidents.slice().sort((a, b) => {
        const dateA = new Date(a.created);
        const dateB = new Date(b.created);
        return dateSortDirection === "asc" ? dateA - dateB : dateB - dateA;
      });
      setDateSortDirection(dateSortDirection === "asc" ? "desc" : "asc");
    } else if (field === "status") {
      sortedResidents = sortedResidents.slice().sort((a, b) => {
        const statusOrder = { "Not Activated": 0, Activated: 1 };
        const statusA = statusOrder[a.status];
        const statusB = statusOrder[b.status];
        return statusSortDirection === "asc"
          ? statusA - statusB
          : statusB - statusA;
      });
      setStatusSortDirection(statusSortDirection === "asc" ? "desc" : "asc");
    }

    setFilteredResidents(sortedResidents);
  };

  return (
    <div className="flex p-4 items-center md:justify-between flex-column gap-2 flex-wrap md:flex-row space-y-0 pb-4 bg-white dark:bg-gray-800 rounded-md">
      <div className="flex flex-row space-y-0 items-center gap-3">
        <div>
          <button
            onClick={toggleAction}
            className="inline-flex justify-between items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            type="button"
          >
            <span className="sr-only">Action button</span>
            Action
            <ArrowDropDown />
          </button>
          {/* Dropdown menu */}
          {isActionOpen && (
            <div
              id="dropdownAction"
              className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
            >
              <ActionButton selectedUsers={selectedUsers} />
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
            >
              {" "}
              <ul className="">
                {actionButton.map((action, key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSorting(action.type)}
                    className={`block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`}
                  >
                    {/* {`Sort by ${ageSortDirection === "asc" ? "youngest" : "oldest"} first`} */}
                    {action.title}
                  </button>
                ))}
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
  );
};

export default Toolbar;
