import React, { useState } from "react";

const ViewUserButton = ({filteredResidents, isViewingSelected, setIsViewingSelected,selectedUsers }) => {
  const toggleViewSelected = () => {
    setIsViewingSelected(!isViewingSelected);
  };

  return (
    <button
    onClick={toggleViewSelected}
    className={`inline-flex items-center text-nowrap border border-gray-300 focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-3 py-1.5 
      ${isViewingSelected 
        ? "bg-primary-500 hover:bg-primary-600 text-white dark:bg-primary-400 dark:hover:bg-primary-500 dark:text-gray-300 focus:ring-primary-100 dark:focus:ring-primary-600" 
        : "bg-white hover:bg-gray-100 text-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 focus:ring-gray-100 dark:focus:ring-gray-700"}`
    }
  >
    {isViewingSelected ? `All users (${filteredResidents.length})` : `Selected (${selectedUsers.length})`}
  </button>
  
  );
};

export default ViewUserButton;
