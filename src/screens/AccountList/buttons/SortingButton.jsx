import React, { useState } from 'react';
import icons from '../../../assets/icons/Icons';

const SortingButton = ({ filteredResidents, setFilteredResidents, toggleSort, isSort, setSort }) => {
  const actionButton = [
    { title: "Default", type: "id" },
    { title: "Name", type: "name" },
    { title: "Age", type: "age" },
    { title: "Gender", type: "gender" },
    // { title: "Status", type: "status" },
    { title: "Date created", type: "created" },
  ];

  const [currentSortField, setCurrentSortField] = useState(null); // to know the current sort
  const [nameSortDirection, setNameSortDirection] = useState("asc");
  const [ageSortDirection, setAgeSortDirection] = useState("asc");
  const [genderSortDirection, setGenderSortDirection] = useState("asc");
  const [dateSortDirection, setDateSortDirection] = useState("asc");
  const [statusSortDirection, setStatusSortDirection] = useState("asc");

  const handleSorting = (field) => {
    let sortedResidents = [...filteredResidents];

    if (field === "id") {
      sortedResidents = sortedResidents.slice().sort((a, b) => {
        return a.id - b.id;
      });
    } else if (field === "name") {
      sortedResidents = sortedResidents.slice().sort((a, b) => {
        const nameA = a.firstname.toUpperCase();
        const nameB = b.firstname.toUpperCase();
        return nameSortDirection === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      });
      setNameSortDirection(nameSortDirection === "asc" ? "desc" : "asc");
    } else if (field === "age") {
      sortedResidents = sortedResidents.slice().sort((a, b) => {
        const ageA = parseInt(a.age);
        const ageB = parseInt(b.age);
        return ageSortDirection === "asc" ? ageA - ageB : ageB - ageA;
      });
      setAgeSortDirection(ageSortDirection === "asc" ? "desc" : "asc");
    } else if (field === "gender") {
      sortedResidents = sortedResidents.slice().sort((a, b) => {
        const genderType = { "Male": 1, "Female": 0 };
        const genderA = genderType[a.gender];
        const genderB = genderType[b.gender];
        return genderSortDirection === "asc" ? genderA - genderB : genderB - genderA;
      });
      setGenderSortDirection(genderSortDirection === "asc" ? "desc" : "asc");
    } else if (field === "created") {
      sortedResidents = sortedResidents.slice().sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateSortDirection === "asc" ? dateA - dateB : dateB - dateA;
      });
      setDateSortDirection(dateSortDirection === "asc" ? "desc" : "asc");
    } else if (field === "status") {
      sortedResidents = sortedResidents.slice().sort((a, b) => {
        const statusOrder = { "Not Verified": 0, "Verified": 1 };
        const statusA = statusOrder[a.status];
        const statusB = statusOrder[b.status];
        return statusSortDirection === "asc" ? statusA - statusB : statusB - statusA;
      });
      setStatusSortDirection(statusSortDirection === "asc" ? "desc" : "asc");
    }

    setFilteredResidents(sortedResidents);
    setCurrentSortField(field);
    setSort(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleSort}
        className="inline-flex justify-between items-center text-nowrap text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        type="button"
      >
        <icons.sortIcon style={{ fontSize: "large" }} />
        {currentSortField ? `Sorted By: ${actionButton.find(action => action.type === currentSortField).title}` : "Sort By:"}
      </button>

      {isSort && (
        <div
          id="dropdownAction"
          className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
        >
          <ul className="">
            {actionButton.map((action, key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleSorting(action.type)}
                className={`block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`}
              >
                {action.title}
              </button>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SortingButton;
