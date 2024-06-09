import React, { useEffect, useState } from "react";
import HeadSide from "../ReusableComponents/HeaderSidebar";
import Pagination from "./Pagination";
import Toolbar from "./Toolbar";
import { toast } from "sonner";

export const HeaderData = ["Name", "Address", "Age", "Gender", "Status","Date Creatd", "Action"];

const ResidentsList = ({ residents, label}) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredResidents, setFilteredResidents] = useState(residents.slice());
  const [sortDirection, setSortDirection] = useState("asc"); // Track sort direction

  const itemsPerPage = 10;

  // to show the user using search input
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let updatedResidents = residents.filter((resident) =>
      resident.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredResidents(updatedResidents);
  }, [residents, searchQuery]);

  // Calculate the indices for the current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResidents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // calculate the item per page
  const totalPages = Math.ceil(filteredResidents.length / itemsPerPage);
  const lastPageItems = filteredResidents.length % itemsPerPage || itemsPerPage;

  const handleCheckbox = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  }

  const handleViewUser = (id) => {
    toast.warning(`view ${id}`);
  }

  return (
    <HeadSide
      child={
        <div className="flex flex-col justify-center m-3">
          <Toolbar
            label={label}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredResidents={filteredResidents}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            setFilteredResidents={setFilteredResidents}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />

          <div className="overflow-auto w-full">
            {filteredResidents == 0 ? (
              <div className="py-32 text-gray-500 text-center justify-center items-center">
                No data found
              </div>
            ) : (
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-all-search"
                          type="checkbox"
                          className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="checkbox-all-search"
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </th>
                    {HeaderData.map((header) => (
                      <th scope="col" className="px-6 py-3">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((residents, key) => (
                    <tr
                      key={key}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="w-4 p-4">
                        <div className="flex items-center">
                          <input
                            id="checkbox-table-search-1"
                            type="checkbox"
                            onChange={() => handleCheckbox(residents.id)}
                            checked={selectedUsers.includes(residents.id)}
                            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label
                            htmlFor={`checkbox-table-search-${residents.id}`}
                            className="sr-only"
                          >
                            checkbox
                          </label>
                        </div>
                      </td>
                      <th
                        scope="row"
                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        <img
                          className="w-10 h-10 rounded-full"
                          src={residents.img}
                          alt="Jese image"
                        />
                        <div className="ps-3">
                          <div className="text-base font-semibold">
                            {residents.name}
                          </div>
                          <div className="font-normal text-gray-500">
                            {residents.email}
                          </div>
                        </div>
                      </th>
                      <td className="px-6 py-4">{residents.address}</td>
                      <td className="px-6 py-4">{residents.age}</td>
                      <td className="px-6 py-4">{residents.gender}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div
                            className={`h-2.5 w-2.5 rounded-full bg-green-500 me-2 ${
                              residents.status === "Activated"
                                ? "bg-green-500"
                                : "bg-red-500"
                            } me-2`}
                          />{" "}
                          {residents.status === "Activated"
                            ? "Activated"
                            : "Not Activated"}
                        </div>
                      </td>
                      <td className="px-6 py-4">{residents.created}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewUser(residents.name)}
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
            />
          </div>
        </div>
      }
    />
  );
};

export default ResidentsList;
