import React, { useEffect, useState } from "react";
import HeadSide from "../../components/ReusableComponents/HeaderSidebar";
import Pagination from "../AccountList/buttons/Pagination";
import Toolbar from "./Toolbar";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import AddUserModal from "./AddUserModal";
import { toast } from "sonner";
import { handleImportFile, handleExport } from "../../helper/utils";
import EmptyLogo from "../../components/ReusableComponents/EmptyLogo";
import icons from "../../assets/icons/Icons";

const ResidentsList = ({ label, data }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredResidents, setFilteredResidents] = useState(data.slice());
  const [isViewingSelected, setIsViewingSelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltered, setIsFiltered] = useState(true);
  const itemsPerPage = 10;

  const [addUser, setAddUser] = useState(null);
  const [next, setNext] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [userToViewInfo, setUserToViewInfo] = useState(null);

  const [filters, setFilters] = useState({
    // state object for holding filter values
    name: "",
    address: "",
    age: "",
    gender: "",
  });

  useEffect(() => {
    let updatedResidents = data;

    // Handle search query
    if (searchQuery) {
      updatedResidents = updatedResidents.filter((user) =>
        user.firstname?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Handle filters
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        updatedResidents = updatedResidents.filter((user) => {
          const value = user[key]
            ? user[key].toString().toLowerCase().trim()
            : "";
          const filterValue = filters[key].toLowerCase().trim();
          return value === filterValue; // exact match comparison
        });
      }
    });

    setFilteredResidents(updatedResidents);
  }, [data, searchQuery, filters]); // original list ,filter for search of name and filter for specific data

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = isViewingSelected
    ? selectedUsers.map((id) => data.find((res) => res.id === id))
    : filteredResidents.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = isViewingSelected
    ? Math.ceil(selectedUsers.length / itemsPerPage)
    : Math.ceil(filteredResidents.length / itemsPerPage);

  const handleMainCheckboxChange = () => {
    if (selectedUsers.length === filteredResidents.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredResidents.map((user) => user.id));
    }
  };

  const handleCheckbox = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // handle to view selected user
  const handleViewUser = (user) => {
    setUserToViewInfo(user);
    setShowUserInfoModal(true);
  };

  // Function to handle changes in filter inputs
  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };
  // Function to get unique, sorted values for a specific key from the residents list
  const getUniqueSortedValues = (key) => {
    let uniqueValues = [
      ...new Set(
        data.map((user) =>
          user[key] ? user[key].toString().toLowerCase().trim() : ""
        )
      ),
    ].filter((value) => value !== "");
    // Sort uniqueValues in ascending order
    uniqueValues.sort((a, b) => a.localeCompare(b));

    return uniqueValues;
  };

  return (
    <HeadSide
      child={
        <div className="flex flex-col justify-center">
          <Toolbar
            label={label}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredResidents={filteredResidents}
            setFilteredResidents={setFilteredResidents}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            isViewingSelected={isViewingSelected}
            setIsViewingSelected={setIsViewingSelected}
            isFiltered={isFiltered}
            setIsFiltered={setIsFiltered}
            setAddUser={setAddUser}
          />
          <div className="overflow-auto w-full">
            <table className="min-w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <TableHeader
                selectedUsers={selectedUsers}
                filteredResidents={filteredResidents}
                handleMainCheckboxChange={handleMainCheckboxChange}
                isFiltered={isFiltered}
                filters={filters}
                handleFilterChange={handleFilterChange}
                getUniqueSortedValues={getUniqueSortedValues}
              />
              <tbody>
                <AddUserModal
                  addUser={addUser}
                  setAddUser={setAddUser}
                  label={label}
                  next={next}
                  setNext={setNext}
                />

                {showUserInfoModal && userToViewInfo && (
                  <div className="fixed flex items-center justify-center inset-0 z-50">
                    <div
                      className="fixed h-full w-full bg-gray-600 bg-opacity-50"
                      onClick={() => setShowUserInfoModal(false)}
                    ></div>
                    <div className="relative p-5 text-lg bg-white rounded-md shadow-md">
                      <h2>User Information</h2>
                      <button
                        className="absolute top-2 right-2"
                        onClick={() => setShowUserInfoModal(false)}
                      >
                        Close
                      </button>
                      <div className="flex flex-col justify-between space-y-2">
                        <p className="flex items-center justify-center p-2">
                          <img
                            src={userToViewInfo.img}
                            alt=""
                            className="h-24 w-24 rounded-full"
                          />
                        </p>
                        <div className="flex flex-col space-y-2 w-[400px]">
                          <div className="space-y-2">
                            <p className="flex flex-row items-center justify-center space-x-2 font-bold text-gray-500 text-lg border-b-2 border-b-gray-300">
                              <p>
                                {userToViewInfo?.firstname
                                  ? (`${userToViewInfo.firstname} ${userToViewInfo.lastname}`
                                   )
                                  : "fullname"}
                              </p>
                              {userToViewInfo.gender === "male" ? (
                                <icons.male className="text-gray-500" />
                              ) : (
                                <icons.female className="text-gray-500" />
                              )}
                            </p>
                            <div className="text-center text-gray-500 flex flex-row justify-evenly">
                              <p className="italic text-gray-900">
                                {userToViewInfo.email}{" "}
                              </p>
                              <p className="italic text-gray-900">
                                {userToViewInfo.mobileNum
                                  ? userToViewInfo.mobileNum
                                  : "mobile number"}
                              </p>
                            </div>
                            <p className="text-center flex flex-row justify-evenly bg-gray-200 p-2 text-sm text-gray-900 font-thin lowercase italic">
                              <p className="font-bold">user id:</p>{" "}
                              {userToViewInfo.customId}
                            </p>

                            <div className="bg-gray-100 p-4 rounded-sm">
                              <p className="text-gray-900 text-lg">
                                {userToViewInfo.address}
                              </p>

                              <p className="text-gray-900 text-lg">
                                {userToViewInfo?.age
                                  ? `${userToViewInfo.age} years old`
                                  : "user details"}
                              </p>
                            </div>
                          </div>
                          <p className="text-center text-lg uppercase">
                            {userToViewInfo?.profileComplete ? (
                              <p className="text-green-500 font-bold bg-green-100 p-2">
                                completed
                              </p>
                            ) : (
                              <p className="text-red-500 font-bold bg-red-100">
                                not completed
                              </p>
                            )}
                          </p>
                        </div>
                        <button
                          className="p-2 text-gray-200 bg-primary-500"
                          onClick={() => {
                            setShowUserInfoModal(false);
                          }}
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentItems.length === 0 ? (
                  <tr className="h-screen">
                    <td colSpan={8}>
                      <EmptyLogo message={"No users registered"} />
                    </td>
                  </tr>
                ) : (
                  currentItems.map((data, index) => (
                    <TableBody
                      key={index}
                      selectedUsers={selectedUsers}
                      data={data}
                      handleCheckbox={handleCheckbox}
                      handleViewUser={handleViewUser}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
              filteredResidents={filteredResidents}
              isViewingSelected={isViewingSelected}
              selectedUsers={selectedUsers}
              onClickExport={() =>
                handleExport(
                  isViewingSelected,
                  selectedUsers,
                  data,
                  filteredResidents
                )
              }
              onClickImport={(event) => handleImportFile(event, setResidents)}
            />
          </div>
        </div>
      }
    />
  );
};

export default ResidentsList;
