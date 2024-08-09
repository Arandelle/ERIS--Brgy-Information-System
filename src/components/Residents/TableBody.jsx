import React from 'react'
import { formatDate } from '../../helper/FormatDate';

const TableBody = ({selectedUsers,data, handleCheckbox, handleViewUser, setUserToViewInfo,key}) => {

  const notYetSet = <p className='italic text-nowrap'>not yet set</p>;

  return (
    <tr
    onClick={() => handleCheckbox(data.id)}
    className={`border-b dark:border-gray-700
    ${
      selectedUsers.includes(data.id)
        ? "bg-gray-300 dark:bg-gray-800 dark:bg-opacity-40 hover:bg-gray-400 hover:dark:bg-gray-700 dark:hover:bg-opacity-40"
        : "bg-white hover:bg-gray-100 dark:bg-gray-800 hover:dark:bg-gray-700 "
    }`}
  >
    <td className="w-4 p-4">
      <div className="flex items-center justify-between space-y-0">
        <input
        key={key}
          id="checkbox-table-search-1"
          type="checkbox"
          onChange={() => handleCheckbox(data.id)}
          checked={selectedUsers.includes(data.id)}
          className="w-4 h-4 cursor-pointer text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
    </td>
    <th
      scope="row"
      className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
    >
      <img
        className="w-10 h-10 rounded-full"
        src={data.img}
        alt="notYetSet"
      />
      <div className="ps-3">
        {data.firstname && data.lastname ? <div className="text-base flex flex-row font-semibold space-x-1">
          <p>{data.firstname}</p><p>{data.lastname}</p>
        </div> : notYetSet}
        <div className="font-normal text-gray-500">
          {data.email}
        </div>
      </div>
    </th>
    <td className="px-6 py-4">{data.address ? data.address : notYetSet}</td>
    <td className="px-6 py-4">{data.age ? data.age : notYetSet}</td>
    <td className="px-6 py-4">{data.gender ? data.gender : notYetSet}</td>
    <td className="px-6 py-4">
      {/* <div className="flex items-center">
        <div
          className={`h-2.5 w-2.5 rounded-full me-2 ${
            data.status.toLowerCase().trim() ===
            "verified"
              ? "bg-green-500"
              : "bg-red-500"
          } me-2`}
        />{" "}
        {data.status.toLowerCase().trim() === "verified"
          ? "Verified"
          : "Not Verified"}
      </div> */}
      {data.mobileNum ? data.mobileNum : notYetSet}
    </td>
    <td className="px-6 py-4">
      {formatDate(data.createdAt)}
    </td>
    <td className="px-6 py-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleViewUser(data);
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
