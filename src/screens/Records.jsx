import HeadSide from "../components/ReusableComponents/HeaderSidebar";
import Table from "../components/Table";
import { useFetchData } from "../hooks/useFetchData";
import { capitalizeFirstLetter } from "../helper/CapitalizeFirstLetter";
import Toolbar from "../components/ToolBar";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import SearchQuery from "../components/SearchQuery";
import { useState, useEffect } from "react";

const Records = () => {
  const { data: emergencyHistory } = useFetchData("emergencyRequest");
  const { data: users } = useFetchData("users");
  const { data: responders } = useFetchData("responders");

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(emergencyHistory.slice());

  useEffect(() => {
    // Combine emergencyHistory and users data
    const updatedData = emergencyHistory?.map((emergency) => {
      const user = users?.find((user) => user.id === emergency.userId);
      const responder = responders?.find((responder) => responder.id === emergency.responderId )
      return {
        ...emergency,
        userName: `${user?.firstname} ${user?.lastname}` || "",
        responderName: `${responder?.firstname} ${responder?.lastname}` || "",
        userID: user?.customId || "",
        responderID: responder?.customId || ""
      };
    });

    // Handle search query across all relevant fields
    let filteredResults = updatedData;
    if (searchQuery) {
      filteredResults = updatedData.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();

        return (
          item.userName.toLowerCase().includes(searchTerm) ||
          item.responderName.toLowerCase().includes(searchTerm) ||
          item.userID.toLowerCase().includes(searchTerm) ||
          item.responderID.toLowerCase().includes(searchTerm) ||
          item.emergencyId.toLowerCase().includes(searchTerm) ||
          item.status.toLowerCase().includes(searchTerm) ||
          item.type.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.location.address.toLowerCase().includes(searchTerm)
        );
      });
    }

    setFilteredData(filteredResults);
  }, [emergencyHistory, users, searchQuery]);

  const {
    currentPage,
    setCurrentPage,
    indexOfLastItem,
    indexOfFirstItem,
    currentItems,
    totalPages,
  } = usePagination(filteredData); // pass the filtered data instead of default emergencyHistory

  const HeaderData = [
    "emergency id",
    "Type",
    "Name",
    "Decription",
    "Location",
    "Status",
    "Submitted",
    "Responder",
  ];

  const renderRow = (emergency) => {
    const userDetails = users?.find((user) => user.id === emergency.userId);
    const responderDetails = responders?.find(
      (responder) => responder.id === emergency.responderId
    );

    const userName =  `${userDetails?.firstname} ${userDetails?.lastname}` || "";
    const responderName =
    `${responderDetails?.firstname} ${responderDetails?.lastname}` ||
      "Waiting for Responder";

    const statusStyle =
      "flex items-center justify-center font-bold p-0.5 rounded-md";
    const statusColor = {
      resolved: `text-green-500 bg-green-200 ${statusStyle}`,
      "awaiting response": `text-yellow-500 bg-yellow-200 ${statusStyle}`,
      "on-going": `text-blue-500 bg-blue-200 ${statusStyle}`,
      expired: `text-red-500 bg-red-200 ${statusStyle}`,
    };

    return (
      <>
        <td className="px-6 py-4 whitespace-nowrap">{emergency.emergencyId}</td>
        <td className="px-6 py-4">{emergency.type}</td>
        <td className="px-6 py-4 whitespace-nowrap">{userName}</td>
        <td className="px-6 py-4">{emergency.description}</td>
        <td className="px-6 py-4">{emergency.location.address}</td>
        <td>
          <p className={`${statusColor[emergency.status]} whitespace-nowrap`}>
            {capitalizeFirstLetter(emergency.status)}
          </p>
        </td>
        <td className="px-6 py-4">
          {new Date(emergency.date).toLocaleString()}
        </td>
        <td className="px-6 py-4">{responderName}</td>
      </>
    );
  };

  return (
    <HeadSide
      child={
        <>
          <Toolbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <Table
            headers={HeaderData}
            data={currentItems} // pass the currentItems from usePagination
            renderRow={renderRow}
            emptyMessage={"No records found"}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            data={filteredData} // pass the filteredData instead of default emergencyHistory
          />
        </>
      }
    />
  );
};

export default Records;
