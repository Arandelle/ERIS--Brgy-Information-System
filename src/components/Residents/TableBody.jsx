import React from 'react'
import { formatDate } from '../../helper/FormatDate';

const TableBody = ({selectedUsers,users, handleCheckbox, handleViewUser, setUserToViewInfo,key}) => {

  const notYetSet = <p className='italic text-nowrap'>not yet set</p>;

  return (
    <tr
    onClick={() => handleCheckbox(users.id)}
    className={`border-b dark:border-gray-700
    ${
      selectedUsers.includes(users.id)
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
          onChange={() => handleCheckbox(users.id)}
          checked={selectedUsers.includes(users.id)}
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
        src={users.img}
        alt="notYetSet"
      />
      <div className="ps-3">
        {users.firstname && users.lastname ? <div className="text-base flex flex-row font-semibold space-x-1">
          <p>{users.firstname}</p><p>{users.lastname}</p>
        </div> : notYetSet}
        <div className="font-normal text-gray-500">
          {users.email}
        </div>
      </div>
    </th>
    <td className="px-6 py-4">{users.address ? users.address : notYetSet}</td>
    <td className="px-6 py-4">{users.age ? users.age : notYetSet}</td>
    <td className="px-6 py-4">{users.gender ? users.gender : notYetSet}</td>
    <td className="px-6 py-4">
      {/* <div className="flex items-center">
        <div
          className={`h-2.5 w-2.5 rounded-full me-2 ${
            users.status.toLowerCase().trim() ===
            "verified"
              ? "bg-green-500"
              : "bg-red-500"
          } me-2`}
        />{" "}
        {users.status.toLowerCase().trim() === "verified"
          ? "Verified"
          : "Not Verified"}
      </div> */}
      {users.mobileNum ? users.mobileNum : notYetSet}
    </td>
    <td className="px-6 py-4">
      {formatDate(users.createdAt)}
    </td>
    <td className="px-6 py-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleViewUser(users);
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
