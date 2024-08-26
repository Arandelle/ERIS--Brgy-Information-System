import React from "react";

// Header data for the table
export const HeaderData = [
  { key: "name", label: "Name", showOn: "all" },
  { key: "address", label: "Address", showOn: "all" },
  { key: "age", label: "Age", showOn: "all" },
  { key: "gender", label: "Gender", showOn: "sm" },
  { key: "mobile", label: "Mobile", showOn: "md" },
  { key: "created", label: "Created", showOn: "lg" },
  { key: "action", label: "Action", showOn: "all" },
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
    <thead className="text-xs sm:text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:bg-opacity-70 dark:text-gray-400">
      <tr>
        <th scope="col" className="p-2 sm:p-4">
          <input
            type="checkbox"
            className="w-4 h-4 cursor-pointer text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            checked={selectedUsers.length === filteredResidents.length}
            onChange={handleMainCheckboxChange}
          />
        </th>
        {HeaderData.map((header, index) => (
          <th 
            key={index} 
            scope="col" 
            className={`px-2 py-2 sm:px-4 sm:py-3 text-nowrap ${
              header.showOn === 'sm' ? 'hidden sm:table-cell' :
              header.showOn === 'md' ? 'hidden md:table-cell' :
              header.showOn === 'lg' ? 'hidden lg:table-cell' : ''
            }`}
          >
            {isFiltered ? (
              header.label
            ) : (
              <select
                className="px-1 cursor-pointer bg-transparent text-primary-700 py-1 rounded focus:outline-none focus:border-transparent border-none uppercase text-xs sm:text-sm w-full dark:text-gray-200"
                value={filters[header.key]}
                onChange={(e) => handleFilterChange(header.key, e.target.value)}
              >
                <option className="dark:text-gray-600" value="">
                  {header.label}
                </option>
                {getUniqueSortedValues(header.key).map((value, i) => (
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