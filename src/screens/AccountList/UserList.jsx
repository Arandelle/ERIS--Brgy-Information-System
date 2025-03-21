import React, { useState } from "react";
import { useFetchData } from "../../hooks/useFetchData";
import useFilteredData from "../../components/SearchQuery";
import usePagination from "../../hooks/usePagination";
import HeaderAndSideBar from "../../components/ReusableComponents/HeaderSidebar";
import Toolbar from "../../components/ToolBar";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import { formatDate } from "../../helper/FormatDate";
import icons from "../../assets/icons/Icons";
import IconButton from "../../components/ReusableComponents/IconButton";
import ButtonStyle from "../../components/ReusableComponents/Button";
import AddUserModal from "./AddUserModal";
import ViewUserModal from "./ViewUserModal";
import MediaModal from "../MediaModal";
import useSearchParam from "../../hooks/useSearchParam";
import useViewMedia from "../../hooks/useViewMedia";
import { toast } from "sonner";
import handleDeleteData from "../../hooks/handleDeleteData";
import AskCard from "../../components/ReusableComponents/AskCard";
import logAuditTrail from "../../hooks/useAuditTrail";
import { auth } from "../../services/firebaseConfig";
import axios from "axios";

const UserList = ({ data }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { searchParams, setSearchParams } = useSearchParam();
  const userId = searchParams.get("uid");
  const { data: userData = [] } = useFetchData(data);
  const [searchQuery, setSearchQuery] = useState("");
  const [addUser, setAddUser] = useState(null);
  const [userToViewInfo, setUserToViewInfo] = useState(null);
  const [userToDelete, setUserToDelete] = useState("");
  const [isDeleteUser, setIsDeleteUser] = useState(false);
  const { isModalOpen, currentMedia, openModal, closeModal } = useViewMedia();
  const [loading, setLoading] = useState(false);

  const searchField = [
    "fullname",
    "mobileNum",
    "gender",
    "customId",
    "createdAt",
    "address",
    "id",
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
    setSearchParams({ uid: user.id });
    setUserToViewInfo(user);
  };

  const handleCloseViewUser = () => {
    setSearchParams({});
    setUserToViewInfo(null);
  };

  const handleDeleteUserClick = (user) => {
    setUserToDelete(user);
    setIsDeleteUser(prev => !prev)
  }

  const handleConfirmDeleteUser = async (id) => {
    if (!API_URL) {
      console.error("❌ API_URL is undefined! Check your environment variables.");
      toast.error("Server error: API URL is missing.");
      return;
    }
  
    if (!id) {
      console.error("❌ User ID is undefined! Cannot disable user.");
      toast.error("User ID is missing.");
      return;
    }
  
    if (id === auth.currentUser?.uid) {
      toast.error("You cannot delete your own account.");
      return;
    }
  
    setLoading(true);
  
    try {
      const apiEndpoint = `${API_URL}/api/disable-user`; // This should now correctly point to your backend
  
      console.log("📡 Sending request to:", apiEndpoint);
      console.log("📝 With data:", { uid: id });
  
      const response = await axios.post(apiEndpoint, { uid: id });
  
      console.log("✅ Success:", response.data);
      toast.success(response.data?.message || "User disabled successfully.");
    } catch (error) {
      console.error("❌ Error disabling user:", error);
      toast.error(error.response?.data?.error || error.message || "An error occurred.");
    } finally {
      setLoading(false);
      setUserToDelete('');
      setIsDeleteUser(false);
    }
  };
  
  const TableData = ({ data }) => {
    const nullValue = <p className="italic text-nowrap text-xs">-</p>;

    return (
      <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm">
        <div className="truncate max-w-[100px] sm:max-w-[200px]">
          {data || nullValue}
        </div>
      </td>
    );
  };

  const renderRow = (user) => {
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
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer"
            src={user.fileUrl || user?.img}
            alt="anonymous"
            onClick={() => openModal(user.fileUrl || user.img)}
          />
          <div className="ps-2 sm:ps-3">
            <p>{user.fullname ?? "null"}</p>
            <p className="font-normal text-gray-500 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[200px]">
              {user.email}
            </p>
          </div>
        </th>
        <TableData data={user.customId} />
        <TableData data={user.address} />
        <TableData data={user.gender} />
        <TableData data={user.mobileNum} />
        <TableData data={formatDate(user.createdAt)} />
        <td className="flex-1">
          <div className="flex items-center justify-center space-x-2">
            <IconButton
              icon={icons.view}
              color={"blue"}
              onClick={(e) => {
                e.stopPropagation();
                handleViewUser(user);
              }}
              tooltip={"Show more details"}
              fontSize={"small"}
            />
            <IconButton 
              icon={icons.delete}
              color={"red"}
              tooltip={`Delete ${data}`}
              fontSize={"small"}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteUserClick(user);
              }}
            />
          </div>
        </td>
      </>
    );
  };
  

  return (
    <HeaderAndSideBar
      content={
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
          {((userToViewInfo && userId)) && (
            <ViewUserModal
              userToViewInfo={userToViewInfo}
              handleCloseViewUser={handleCloseViewUser}
              loading={loading}
            />
          )}

          {isModalOpen && (
            <MediaModal currentMedia={currentMedia} closeModal={closeModal} />
          )}

          {isDeleteUser && (
            <AskCard 
              toggleModal={handleDeleteUserClick}
              question={`Delete ${userToDelete.fullname} ? `}
              confirmText={"Delete"}
              onConfirm={() => handleConfirmDeleteUser(userToDelete.id)}
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
