import React from 'react'
import { formatDate } from '../../helper/FormatDate';

const TableBody = ({selectedUsers,resident, handleCheckbox, handleViewUser, setUserToViewInfo,key}) => {
  return (
    <tr
    onClick={() => handleCheckbox(resident.id)}
    className={`border-b dark:border-gray-700
    ${
      selectedUsers.includes(resident.id)
        ? "bg-gray-300 dark:bg-gray-900 hover:bg-gray-400 hover:dark:bg-gray-700"
        : "bg-white hover:bg-gray-100 dark:bg-gray-800 hover:dark:bg-gray-700 "
    }`}
  >
    <td className="w-4 p-4">
      <div className="flex items-center">
        <input
        key={key}
          id="checkbox-table-search-1"
          type="checkbox"
          onChange={() => handleCheckbox(resident.id)}
          checked={selectedUsers.includes(resident.id)}
          className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
    </td>
    <th
      scope="row"
      className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
    >
      <img
        className="w-10 h-10 rounded-full"
        src={resident.img}
        alt="user image"
      />
      <div className="ps-3">
        <div className="text-base font-semibold">
          {resident.name}
        </div>
        <div className="font-normal text-gray-500">
          {resident.email}
        </div>
      </div>
    </th>
    <td className="px-6 py-4">{resident.address}</td>
    <td className="px-6 py-4">{resident.age}</td>
    <td className="px-6 py-4">{resident.gender}</td>
    <td className="px-6 py-4">
      <div className="flex items-center">
        <div
          className={`h-2.5 w-2.5 rounded-full me-2 ${
            resident.status.toLowerCase().trim() ===
            "verified"
              ? "bg-green-500"
              : "bg-red-500"
          } me-2`}
        />{" "}
        {resident.status.toLowerCase().trim() === "verified"
          ? "Verified"
          : "Not Verified"}
      </div>
    </td>
    <td className="px-6 py-4">
      {formatDate(resident.created)}
    </td>
    <td className="px-6 py-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleViewUser(resident);
        }}
        className="font-medium text-primary-600 dark:text-primary-500 hover:underline"
      >
        View user
      </button>
    </td>
  </tr>
  )
}

export default TableBody
