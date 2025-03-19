import React from "react";

const SelectStyle = ({ value, onChange, options = [],disabledOption="Select Option"} ) => {
  return (
    <select className="px-4 py-2 text-sm text-gray-600 border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-gray-400 focus:border-gray-400 dark:placeholder:text-gray-200 dark:text-gray-200 dark:bg-gray-600 w-full cursor-pointer"
    value={value}
    onChange={onChange}
    > 
    <option value="" disabled>{disabledOption}</option>
      {options.length > 0 &&
        options.map((option) => (
          <option key={option} value={option} className="text-gray-600">
            {option}
          </option>
        ))}
    </select>
  );
};

export default SelectStyle;
