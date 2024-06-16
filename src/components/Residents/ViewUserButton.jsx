import React, { useState } from "react";

const ViewUserButton = ({filteredResidents, isViewingSelected, setIsViewingSelected,selectedUsers }) => {
  const toggleViewSelected = () => {
    setIsViewingSelected(!isViewingSelected);
  };

  return (
    <button
      onClick={toggleViewSelected}
      className={`inline-flex items-center text-nowrap border border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 ${isViewingSelected ? "bg-primary-400 hover:bg-primary-500 text-gray-200" : "bg-white text-gray-500 hover:bg-gray-100 "}`}
    >
      {isViewingSelected ? `All users (${filteredResidents.length})` : `Selected (${selectedUsers.length})`}
    </button>
  );
};

export default ViewUserButton;
