import React from 'react'
import SwapVertIcon from "@mui/icons-material/SwapVert";

const FilterButton = ({toggleFilter}) => {

    const actionButton = [
        {title: "Status", type: "status"},
        {title: "Gender", type: "gender"},
    ]
  return (
    <div>
    <button
    onClick={toggleFilter}
    className="inline-flex justify-between items-center text-nowrap text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
    type="button"
  >
    <SwapVertIcon />
    Filter By:
  </button>
    </div>
  )
}

export default FilterButton
