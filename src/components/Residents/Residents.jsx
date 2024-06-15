import React, { useEffect, useState } from "react";
import HeadSide from "../ReusableComponents/HeaderSidebar";
import Pagination from "./Pagination";
import Toolbar from "./Toolbar";
import { toast } from "sonner";

export const HeaderData = [
  "Name",
  "Address",
  "Age",
  "Gender",
  "Status",
  "Date Created",
  "Action",
];

const ResidentsList = ({ residents, label }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredResidents, setFilteredResidents] = useState(residents.slice());
  const [isViewingSelected, setIsViewingSelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    address: "",
    age: "",
    gender: "",
    status: "",
    created: "",
  });

  const itemsPerPage = 10;

  useEffect(() => {
    let updatedResidents = residents.filter((resident) =>
      resident.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        updatedResidents = updatedResidents.filter((resident) => {
          const value = resident[key] ? resident[key].toString().toLowerCase().trim() : "";
          const filterValue = filters[key].toLowerCase().trim();
          return value === filterValue;  // Use exact match instead of includes
        });
      }
    });

    setFilteredResidents(updatedResidents);
  }, [residents, searchQuery, filters]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = isViewingSelected
    ? selectedUsers.map((id) => residents.find((res) => res.id === id))
    : filteredResidents.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = isViewingSelected
    ? Math.ceil(selectedUsers.length / itemsPerPage)
    : Math.ceil(filteredResidents.length / itemsPerPage);

  const handleCheckbox = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleViewUser = (id) => {
    toast.warning(`view ${id}`);
  };

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const getUniqueValues = (key) => {
    return [...new Set(residents.map((resident) => resident[key] ? resident[key].toString().toLowerCase().trim() : ""))].filter(value => value !== "");
  };

  return (
    <HeadSide
      child={
        <div className="flex flex-col justify-center m-3">
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
          />

          <div className="overflow-auto w-full">
            {currentItems.length === 0 ? (
              <div className="py-32 text-gray-500 text-center justify-center items-center">
                No data found
              </div>
            ) : (
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="p-4">
                    <input
                            type="checkbox"
                            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                    </th>
                    {HeaderData.map((header, index) => (
                      <th key={index} scope="col" className="px-6 py-3">
                        {header}
                        <select
                          className="ml-2"
                          value={filters[header.toLowerCase().replace(/ /g, "")]}
                          onChange={(e) => handleFilterChange(header.toLowerCase().replace(/ /g, ""), e.target.value)}
                        >
                          <option value="">All</option>
                          {getUniqueValues(header.toLowerCase().replace(/ /g, "")).map((value, i) => (
                            <option key={i} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((resident, key) => (
                    <tr
                      key={key}
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
                          src={residents.img}
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
                              resident.status.toLowerCase().trim() === "verified"
                                ? "bg-green-500"
                                : "bg-red-500"
                            } me-2`}
                          />{" "}
                          {resident.status.toLowerCase().trim() === "verified"
                            ? "Verified"
                            : "Not Verified"}
                        </div>
                      </td>
                      <td className="px-6 py-4">{resident.created}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewUser(resident.name)}
                          className="font-medium text-primary-600 dark:text-primary-500 hover:underline"
                        >
                          View user
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
            />
          </div>
        </div>
      }
    />
  );
};

export default ResidentsList;
