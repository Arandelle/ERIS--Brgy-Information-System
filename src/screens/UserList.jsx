import React, { useState } from "react";
import { useFetchData } from "../hooks/useFetchData";
import useFilteredData from "../components/SearchQuery";
import usePagination from "../hooks/usePagination";
import HeadSide from "../components/ReusableComponents/HeaderSidebar";
import Toolbar from "../components/ToolBar";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import { formatDate } from "../helper/FormatDate";
import icons from "../assets/icons/Icons";
import IconButton from "../components/ReusableComponents/IconButton";
import ButtonStyle from "../components/ReusableComponents/Button";
import AddUserModal from "./AccountList/AddUserModal";
import ViewUserModal from "./AccountList/ViewUserModal";

const UserList = ({ data }) => {
  const { data: userData = [] } = useFetchData(data);
  const [searchQuery, setSearchQuery] = useState("");
  const [addUser, setAddUser] = useState(null);
  const [userToViewInfo, setUserToViewInfo] = useState(null);
  const [viewUser, setViewUser] = useState(false);

  const searchField = [
    "firstname",
    "lastname",
    "mobileNum",
    "gender",
    "customId",
    "createdAt",
    "address",
  ];

  const filteredData = useFilteredData(userData, searchQuery, searchField);

  const {
    currentPage,
    setCurrentPage,
    indexOfLastItem,
    indexOfFirstItem,
    currentItems,
    totalPages,
  } = usePagination(filteredData);

  const HeaderData = [
    <div className="flex items-center justify-between space-y-0">
      <input className="w-4 h-4 cursor-pointer text-primary-600 bg-white border-gray-400 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
    </div>,
    "Name",
    "ID",
    "Address",
    "Gender",
    "Phone",
    "Created",
    "Action",
  ];

  const handleAddingUser = () => {
    setAddUser(!addUser);
  };

  // handle to view selected user
  const handleViewUser = (user) => {
    setViewUser(true);
    setUserToViewInfo(user);
  };

  const renderRow = (user) => {
    const anonymous = <p className="italic text-nowrap text-xs">not yet set</p>;
    return (
      <>
        <td className="w-4 p-2 sm:p-4">
          <div className="flex items-center justify-between space-y-0">
            <input
              id="checkbox-table-search-1"
              type="checkbox"
              className="w-4 h-4 cursor-pointer text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </td>
        <th className="flex items-center px-2 py-2 sm:px-4 sm:py-4 text-gray-900 whitespace-nowrap dark:text-white">
          <img
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
            src={user?.img}
            alt="anonymous"
          />
          <div className="ps-2 sm:ps-3">
            {user.firstname && user.lastname ? (
              <div className="text-sm sm:text-base flex flex-row font-semibold space-x-1 text-ellipsis truncate max-w-[100px]">
                <p>
                  {user.firstname}, {user.lastname}
                </p>
              </div>
            ) : (
              anonymous
            )}
            <div className="font-normal text-gray-500 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[200px]">
              {user.email}
            </div>
          </div>
        </th>
        <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm">
          <div className="truncate max-w-[100px] sm:max-w-[200px]">
            {user.customId ?? anonymous}
          </div>
        </td>
        <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm">
          <div className="truncate max-w-[100px] sm:max-w-[200px]">
            {user.address ?? anonymous}
          </div>
        </td>
        <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm hidden sm:table-cell">
          {user.gender ?? anonymous}
        </td>
        <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm hidden md:table-cell">
          {user.mobileNum ?? anonymous}
        </td>
        <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm hidden lg:table-cell">
          {formatDate(user.createdAt)}
        </td>
        <td className="">
          <div className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm hidden lg:flex  items-center justify-center">
            <IconButton
              icon={icons.view}
              color={"blue"}
              bgColor={"bg-blue-100"}
              onClick={(e) => {
                e.stopPropagation();
                handleViewUser(user);
              }}
              tooltip={"Show more details"}
              fontSize={"small"}
            />
          </div>
        </td>
      </>
    );
  };

  return (
    <HeadSide
      child={
        <>
          <Toolbar
            buttons={
              <ButtonStyle
                icon={icons.addCircle}
                color={"gray"}
                label={`Add ${data}`}
                fontSize={"small"}
                onClick={() => setAddUser(!addUser)}
              />
            }
            label={data}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          {addUser && <AddUserModal addUser={handleAddingUser} label={data} />}
          {userToViewInfo && viewUser && (
            <ViewUserModal
              userToViewInfo={userToViewInfo}
              setViewUser={setViewUser}
            />
          )}
          <Table
            headers={HeaderData}
            data={currentItems}
            renderRow={renderRow}
            emptyMessage={`No ${data} found`}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            data={filteredData}
          />
        </>
      }
    />
  );
};

export default UserList;
