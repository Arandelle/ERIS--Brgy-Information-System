import { formatDate } from '../../helper/FormatDate';

const TableBody = ({selectedUsers, data, handleCheckbox, handleViewUser, setUserToViewInfo, key}) => {
  const notYetSet = <p className='italic text-nowrap text-xs'>not yet set</p>;

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
      <td className="w-4 p-2 sm:p-4">
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
        className="flex items-center px-2 py-2 sm:px-4 sm:py-4 text-gray-900 whitespace-nowrap dark:text-white"
      >
        <img
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
          src={data.img}
          alt="notYetSet"
        />
        <div className="ps-2 sm:ps-3">
          {data.firstname && data.lastname ? (
            <div className="text-sm sm:text-base flex flex-row font-semibold space-x-1 truncate max-w-[100px]">
              <p>{data.firstname}</p>
            </div>
          ) : notYetSet}
          <div className="font-normal text-gray-500 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[200px]">
            {data.email}
          </div>
        </div>
      </th>
      <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm">
        <div className="truncate max-w-[100px] sm:max-w-[200px]">
          {data.address ? data.address : notYetSet}
        </div>
      </td>
      <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm">{data.age ? data.age : notYetSet}</td>
      <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm hidden sm:table-cell">{data.gender ? data.gender : notYetSet}</td>
      <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm hidden md:table-cell">
        {data.mobileNum ? data.mobileNum : notYetSet}
      </td>
      <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm hidden lg:table-cell">
        {formatDate(data.createdAt)}
      </td>
      <td className="px-2 py-2 sm:px-4 sm:py-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewUser(data);
          }}
          className="font-medium text-primary-600 dark:text-primary-500 hover:underline text-xs sm:text-sm"
        >
          View
        </button>
      </td>
    </tr>
  )
}

export default TableBody