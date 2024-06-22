import React from "react";

// Header data for the table
export const HeaderData = [
  "Name",
  "Address",
  "Age",
  "Gender",
  "Status",
  "created",
  "Action",
];

const TableHeader = ({
  selectedUsers,
  filteredResidents,
  handleMainCheckboxChange,
  isFiltered,
  filters,
  handleFilterChange,
  getUniqueSortedValues,
}) => {
  return (
    <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="p-4">
          <input
            type="checkbox"
            className="w-4 h-4 cursor-pointer text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            checked={selectedUsers.length === filteredResidents.length}
            onChange={handleMainCheckboxChange}
          />
        </th>
        {HeaderData.map((header, index) => (
          <th key={index} scope="col" className="px-6 py-3 text-nowrap">
            {isFiltered ? (
              header
            ) : (
              <select
                className="px-1 cursor-pointer bg-transparent text-primary-700 py-1 rounded focus:outline-none focus:border-transparent border-none uppercase text-sm w-full dark:text-gray-200"
                value={filters[header.toLowerCase().replace(/ /g, "")]}
                onChange={(e) =>
                  handleFilterChange(
                    header.toLowerCase().replace(/ /g, ""),
                    e.target.value
                  )
                }
              >
                <option className="dark:text-gray-600" value="">
                  {header}
                </option>
                {getUniqueSortedValues(
                  header.toLowerCase().replace(/ /g, "")
                ).map((value, i) => (
                  <option className="dark:text-gray-600" key={i} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
