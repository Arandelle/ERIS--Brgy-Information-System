import React from "react";
import FilterAltIcon from "@mui/icons-material/FilterAltOutlined";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

const FilterButton = ({ toggleFilter, isFiltered }) => {
  return (
    <div>
      <button
        onClick={toggleFilter}
        className={`inline-flex justify-between items-center text-nowrap text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 
        ${!isFiltered && ("bg-primary-400 text-gray-200 hover:bg-primary-500")}`}

        type="button"
      >
        {isFiltered ? (
          <FilterAltIcon style={{ fontSize: "large" }} />
        ) : (
          <FilterAltOffIcon style={{ fontSize: "large" }} />
        )}
        <span>Filter</span>
      </button>
    </div>
  );
};

export default FilterButton;
