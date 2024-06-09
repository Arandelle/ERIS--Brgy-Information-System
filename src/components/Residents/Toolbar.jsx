import React, { useState } from "react";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import ActionButton from "./ActionButton";
import SwapVertIcon from '@mui/icons-material/SwapVert';

const Toolbar = ({
  label,
  searchQuery,
  setSearchQuery,
  filteredResidents,
  setFilteredResidents,
  selectedUsers,
  residents
}) => {
  const actionButton = [
    { title: "Default", type: "id" },
    { title: "Name", type: "name" },
    { title: "Age", type: "age" },
    { title: "Gender", type: "gender" },
    { title: "Status", type: "status" },
    { title: "Date created", type: "created" },
    
  ];
  const [isActionOpen, setActionOpen] = useState(false);
  const [isFilter, setFilter] = useState(false);
  const [nameSortDirection, setNameSortDirection] = useState("asc");
  const [ageSortDirection, setAgeSortDirection] = useState("asc");
  const [genderSortDirection, setGenderSortDirection] = useState("asc");
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
    }     
    else if(field === "name"){
      sortedResidents = sortedResidents.slice().sort((a,b)=>{
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        
        if(nameA < nameB){
          return nameSortDirection === "asc" ? -1 : 1;
        } else if (nameA > nameB){
          return nameSortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
      setNameSortDirection(nameSortDirection === "asc" ? "desc" : "asc");
    }
    else if (field === "age") {
      sortedResidents = sortedResidents.slice().sort((a, b) => {
        const ageA = parseInt(a.age);
        const ageB = parseInt(b.age);
        return ageSortDirection === "asc" ? ageA - ageB : ageB - ageA;
      });
      setAgeSortDirection(ageSortDirection === "asc" ? "desc" : "asc");
    }
    else if (field === "gender") {
      sortedResidents = sortedResidents.slice().sort((a, b) => {
        const genderType = {"Male": 1, "Female": 0}
        const genderA = genderType[a.gender];
        const genderB = genderType[b.gender];
        return genderSortDirection === "asc" ? genderA - genderB : genderB - genderA;
      });
      setGenderSortDirection(genderSortDirection === "asc" ? "desc" : "asc");
    } 
    else if (field === "created") {
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
    setFilter(false)
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
            Action Button
            <ArrowDropDown />
          </button>
          {/* Dropdown menu */}
          {isActionOpen && (
            <div
              id="dropdownAction"
              className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
            >
              <ActionButton selectedUsers={selectedUsers} residents={residents} filteredResidents={filteredResidents} />
            </div>
          )}
        </div>

        <div>
        <button
        onClick={toggleFilter}
        className="inline-flex justify-between items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        type="button"
       >
        <SwapVertIcon/>
          Sort By:  
        </button>

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
