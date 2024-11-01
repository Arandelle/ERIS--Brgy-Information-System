import HeadSide from "../components/ReusableComponents/HeaderSidebar";
import Table from "../components/Table";
import { useFetchData } from "../hooks/useFetchData";
import { capitalizeFirstLetter } from "../helper/CapitalizeFirstLetter";
import Toolbar from "../components/ToolBar";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import { useState, useEffect } from "react";
import useFilteredData from "../components/SearchQuery";
import { formatDateWithTime } from "../helper/FormatDate";
import IconButton from "../components/ReusableComponents/IconButton";
import { toast } from "sonner";
import icons from "../assets/icons/Icons";
import { Tooltip } from "@mui/material";

const Records = () => {
  const { data: emergencyHistory } = useFetchData("emergencyRequest");
  const { data: users } = useFetchData("users");
  const { data: responders } = useFetchData("responders");

  const [searchQuery, setSearchQuery] = useState("");

  // updated data to include the name of users and responder which not included in original list of emergencyHistory
  const updatedData = emergencyHistory?.map((emergency) => {
    const user = users?.find((user) => user.id === emergency.userId);
    const responder = responders?.find(
      (responder) => responder.id === emergency.responderId
    );
    return {
      ...emergency,
      userName: `${user?.firstname} ${user?.lastname}` || "",
      responderName: `${responder?.firstname} ${responder?.lastname}` || "",
      userID: user?.customId || "",
      responderID: responder?.customId || "",
    };
  });

  // search field to get the value with
  const searchFields = [
    "userName",
    "responderName",
    "userID",
    "responderID",
    "emergencyId",
    "status",
    "type",
    "description",
    "location.address",
  ];

  // to updated the value of filteredData which is the searchQuery
  const filteredData = useFilteredData(updatedData, searchQuery, searchFields); // used for searchQuery

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
    "Name",
    "Location",
    "Submitted",
    "Status",
    "Responder",
    "Action",
  ];

  const renderRow = (emergency) => {
    const userDetails = users?.find((user) => user.id === emergency.userId);
    const responderDetails = responders?.find(
      (responder) => responder.id === emergency.responderId
    );

    const userName = `${userDetails?.firstname} ${userDetails?.lastname}` || "";
    const responderName =
      `${responderDetails?.firstname} ${responderDetails?.lastname}` ||
      "Waiting for Responder";

    const statusStyle =
      "flex items-center justify-center font-bold py-1 rounded-r-sm";
    const statusColor = {
      resolved: `text-green-500 bg-green-100 border-l-2 border-l-green-500 ${statusStyle}`,
      "awaiting response": `text-yellow-500 bg-yellow-100 ${statusStyle}`,
      "on-going": `text-blue-500 bg-blue-100 ${statusStyle}`,
      expired: `text-red-500 bg-red-100 ${statusStyle}`,
    };
    return (
      <>
        <td className="px-6 py-4 whitespace-nowrap">{emergency.emergencyId}</td>
        <Tooltip title={userDetails.customId} placement="top" arrow><td className="px-6 py-4 whitespace-nowrap">{userName}</td></Tooltip>
        <Tooltip title={emergency.location.address} placement="top" arrow>
          <td className="px-6 py-4 max-w-16 text-ellipsis overflow-hidden whitespace-nowrap">
            {emergency.location.address}
          </td>
        </Tooltip>
        <td className="px-6 py-4 whitespace-normal text-wrap">
          {formatDateWithTime(emergency.date)}
        </td>
        <td>
          <p className={`${statusColor[emergency.status]} whitespace-nowrap`}>
            {capitalizeFirstLetter(emergency.status)}
          </p>
        </td>
        <td className="px-6 py-4">
          <Tooltip title={responderName} placement="top" arrow>
            <div className="flex items-center justify-center">
              <img
                src={responderDetails?.img}
                alt="responder"
                className="h-8 w-8 p-0 bg-gray-600 rounded-full"
              />
            </div>
          </Tooltip>
        </td>
        <td className="px-6 py-4">
          <div className="flex px-2 space-x-2 flex-row items-center justify-evenly">
            <IconButton
              icon={icons.view}
              color={"blue"}
              bgColor={"bg-blue-100"}
              onClick={() => toast.info("Show more details clicked")}
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
            label={"Emergency Records"}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
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
