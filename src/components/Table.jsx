import React from 'react';
import EmptyLogo from './ReusableComponents/EmptyLogo';

const Table = ({ headers = [], data, renderRow, emptyMessage = "No records found" }) => {
  return (
    <div className="flex flex-col justify-center h-full">
      <div className="overflow-auto w-full">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:bg-opacity-70 dark:text-gray-400">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className={`px-6 py-3 sm:text-sm ${header === "Action" ? "text-center" : "text-start"}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {data?.length > 0 ? (
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b dark:border-gray-700 bg-white ${item.isLocked && "opacity-50"} hover:bg-gray-100 dark:bg-gray-800 hover:dark:bg-gray-700`}
                >
                  {renderRow(item)}
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={headers.length} className="px-6 py-4 text-center">
                <EmptyLogo message={emptyMessage}/>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default Table;
