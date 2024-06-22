import React, { useEffect, useState } from "react";
import HeadSide from "../ReusableComponents/HeaderSidebar";
import Pagination from "./buttons/Pagination";
import Toolbar from "./Toolbar";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import AddUserModal from "./buttons/AddUserModal";
import { toast } from "sonner";
import { handleImportFile, handleExport } from "./utils";

const ResidentsList = ({ residents: initialResidents, label }) => {
  const [residents, setResidents] = useState(initialResidents || []); // state for holding the list of residents
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredResidents, setFilteredResidents] = useState(residents.slice());
  const [isViewingSelected, setIsViewingSelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltered, setIsFiltered] = useState(true);
  const itemsPerPage = 10;

  const [addUser, setAddUser] = useState(false);
  const [next, setNext] = useState(false);

  const [filters, setFilters] = useState({
    // state object for holding filter values
    name: "",
    address: "",
    age: "",
    gender: "",
    status: "",
    created: "",
  });

  useEffect(() => {
    let updatedResidents = residents;

    // Handle search query
    if (searchQuery) {
      updatedResidents = updatedResidents.filter((resident) =>
        resident.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Handle filters
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        updatedResidents = updatedResidents.filter((resident) => {
          const value = resident[key]
            ? resident[key].toString().toLowerCase().trim()
            : "";
          const filterValue = filters[key].toLowerCase().trim();
          return value === filterValue; // exact match comparison
        });
      }
    });

    setFilteredResidents(updatedResidents);
  }, [residents, searchQuery, filters]); // original list ,filter for search of name and filter for specific data

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = isViewingSelected
    ? selectedUsers.map((id) => residents.find((res) => res.id === id))
    : filteredResidents.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = isViewingSelected
    ? Math.ceil(selectedUsers.length / itemsPerPage)
    : Math.ceil(filteredResidents.length / itemsPerPage);

  const handleMainCheckboxChange = () => {
    if (selectedUsers.length === filteredResidents.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredResidents.map((resident) => resident.id));
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
  const handleViewUser = (id) => {
    toast.warning(`view ${id}`);
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
        residents.map((resident) =>
          resident[key] ? resident[key].toString().toLowerCase().trim() : ""
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
            isFiltered={isFiltered}
            setIsFiltered={setIsFiltered}
            setAddUser={setAddUser}
          />
          <div className="overflow-auto w-full">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <TableHeader
                selectedUsers={selectedUsers}
                filteredResidents={filteredResidents}
                handleMainCheckboxChange={handleMainCheckboxChange}
                isFiltered={isFiltered}
                filters={filters}
                handleFilterChange={handleFilterChange}
                getUniqueSortedValues={getUniqueSortedValues}
              />

              {currentItems.length === 0 ? (
                <tr className="py-32 h-96 text-gray-500 text-center justify-center items-center">
                  <td rowSpan={6} colSpan={8}>
                    No data found
                  </td>
                </tr>
              ) : (
                <tbody>

                  <AddUserModal addUser={addUser} setAddUser={setAddUser} next={next} setNext={setNext}/>

                  {currentItems.map((resident, key) => (
                    <TableBody
                      key={key}
                      selectedUsers={selectedUsers}
                      resident={resident}
                      handleCheckbox={handleCheckbox}
                      handleViewUser={handleViewUser}
                    />
                  ))}
                </tbody>
              )}
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
                  residents,
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
