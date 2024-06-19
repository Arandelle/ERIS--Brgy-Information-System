import React, { useEffect, useState } from "react";
import HeadSide from "../ReusableComponents/HeaderSidebar";
import Pagination from "./Pagination";
import Toolbar from "./Toolbar";
import { toast } from "sonner";
import { formatDate } from "../../helper/FormatDate";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

// Header data for the table
export const HeaderData = [
  "Name",
  "Address",
  "Age",
  "Gender",
  "Status",
  "created",
  "Action",
];

// function to export data to excel
const exportToExcel = (data, fileName = "residents.xlsx") => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
  saveAs(blob, fileName);
};

// function to convert string to arrayBuffer
const s2ab = (s) => {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buf;
};

const ResidentsList = ({ residents: initialResidents, label }) => {
  const [residents, setResidents] = useState(initialResidents || []); // state for holding the list of residents
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredResidents, setFilteredResidents] = useState(residents.slice());
  const [isViewingSelected, setIsViewingSelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltered, setIsFiltered] = useState(true);
  const itemsPerPage = 10;

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

  // Export the current view (filtered or selected users)
  const handleExport = () => {
    const dataToExport = isViewingSelected
      ? selectedUsers.map((id) => residents.find((res) => res.id === id))
      : filteredResidents;

    const formattedData = dataToExport.map((resident) => ({
      Id: resident.id || "",
      Image: resident.img || "",
      Name: resident.name,
      Email: resident.email || "",
      Address: resident.address || "",
      Age: resident.age || "",
      Gender: resident.gender || "",
      Status: resident.status || "",
      Date: formatDate(resident.created) || "",
    }));

    exportToExcel(formattedData);
  };
  // Function to handle importing data from Excel file
  const handleImportFile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    // Check file type
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      toast.error("Only .xlsx or .xls files are allowed!");
      return;
    }
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target.result;
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const formattedData = jsonData.map((item, index) => ({
          id: index + Math.random(), // Generate a unique ID for each item, if not already present
          img: item["Image"] || "",
          name: item["Name"] || "",
          email: item["Email"] || "",
          address: item["Address"] || "",
          age: item["Age"] || "",
          gender: item["Gender"] || "",
          status: item["Status"] || "",
          created: new Date(item["Date"]), // Ensure Date is correctly parsed as a Date object
        }));

        setResidents((prevResidents) => [...prevResidents, ...formattedData]);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        // Optionally, show a notification or toast to the user about the error
        toast.error("Error Please try again");
      }
    };

    reader.readAsArrayBuffer(file);
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
          />
          <div className="overflow-auto w-full">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={
                        selectedUsers.length === filteredResidents.length
                      }
                      onChange={handleMainCheckboxChange}
                    />
                  </th>
                  {HeaderData.map((header, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-6 py-3 text-nowrap"
                    >
                      {isFiltered ? (
                        header
                      ) : (
                        <select
                          className="px-1 cursor-pointer bg-transparent text-primary-700 py-1 rounded focus:outline-none focus:border-transparent border-none uppercase text-sm w-full dark:text-gray-200"
                          value={
                            filters[header.toLowerCase().replace(/ /g, "")]
                          }
                          onChange={(e) =>
                            handleFilterChange(
                              header.toLowerCase().replace(/ /g, ""),
                              e.target.value
                            )
                          }
                        >
                          <option className="dark:text-gray-600" value="">
                            {header}
                          </option>
                          {getUniqueSortedValues(
                            header.toLowerCase().replace(/ /g, "")
                          ).map((value, i) => (
                            <option
                              className="dark:text-gray-600"
                              key={i}
                              value={value}
                            >
                              {value}
                            </option>
                          ))}
                        </select>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              {currentItems.length === 0 ? (
                <tr className="py-32 h-96 text-gray-500 text-center justify-center items-center">
                  <td rowSpan={6} colSpan={8}>
                    No data found
                  </td>
                </tr>
              ) : (
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
                            handleViewUser(resident.name);
                          }}
                          className="font-medium text-primary-600 dark:text-primary-500 hover:underline"
                        >
                          View user
                        </button>
                      </td>
                    </tr>
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
              onClickExport={handleExport}
              onClickImport={handleImportFile}
            />
          </div>
        </div>
      }
    />
  );
};

export default ResidentsList;
