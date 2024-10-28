import HeadSide from "../components/ReusableComponents/HeaderSidebar";
import Table from "../components/Table";
import { useFetchData } from "../hooks/useFetchData";
import { capitalizeFirstLetter } from "../helper/CapitalizeFirstLetter";
import Toolbar from "../components/ToolBar";
import Pagination from "../components/Pagination";
import { useState, useMemo } from "react";

const Records = () => {
  const { data: emergencyHistory } = useFetchData("emergencyRequest");
  const { data: users } = useFetchData("users");
  const { data: responders } = useFetchData("responders");
  
  const sortedEmergencyHistory = useMemo(() => {
    return [...emergencyHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [emergencyHistory]);

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Use useMemo to memoize the currentItems calculation
  const currentItems = useMemo(() => {
    return sortedEmergencyHistory.slice(indexOfFirstItem, indexOfLastItem);
  }, [sortedEmergencyHistory, indexOfFirstItem, indexOfLastItem]);
  
  const totalPages = Math.ceil(sortedEmergencyHistory.length / itemsPerPage);

  const renderRow = (emergency) => {
    const userDetails = users?.find((user) => user.id === emergency.userId);
    const responderDetails = responders?.find(
      (responder) => responder.id === emergency.responderId
    );

    const userName = userDetails?.firstname + userDetails?.lastname;
    const responderName =
      responderDetails?.firstname + responderDetails?.lastname ||
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
          <Toolbar />
          <Table
            headers={HeaderData}
            data={currentItems} // Pass currentItems instead of full emergencyHistory
            renderRow={renderRow}
            emptyMessage={"No records found"}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            data={sortedEmergencyHistory}
          />
        </>
      }
    />
  );
};

export default Records;