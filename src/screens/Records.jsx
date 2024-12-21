import { useState } from "react";
import HeaderAndSideBar from "../components/ReusableComponents/HeaderSidebar";
import Table from "../components/Table";
import { useFetchData } from "../hooks/useFetchData";
import { capitalizeFirstLetter } from "../helper/CapitalizeFirstLetter";
import Toolbar from "../components/ToolBar";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import useFilteredData from "../components/SearchQuery";
import { formatDateWithTime } from "../helper/FormatDate";
import IconButton from "../components/ReusableComponents/IconButton";
import icons from "../assets/icons/Icons";
import { Tooltip } from "@mui/material";
import Modal from "../components/ReusableComponents/Modal";
import useImageView from "../hooks/useImageView";
import ViewImage from "./ViewImage";

const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'text-green-500 bg-green-100 border-l-green-500';
      case 'awaiting response':
        return 'text-yellow-500 bg-yellow-100 border-l-yellow-500';
      case 'on-going':
        return 'text-blue-500 bg-blue-100 border-l-blue-500';
      case 'expired':
        return 'text-red-500 bg-red-100 border-l-red-500';
      default:
        return 'text-gray-500 bg-gray-100 border-l-gray-500';
    }
  };

  return (
    <p className={`flex items-center justify-center font-bold py-1 rounded-r-sm border-l-2 ${getStatusStyles(status)}`}>
      {capitalizeFirstLetter(status || 'unknown')}
    </p>
  );
};

const Records = () => {
  const { data: emergencyHistory = [] } = useFetchData("emergencyRequest");
  const { data: users = [] } = useFetchData("users");
  const { data: responders = [] } = useFetchData("responders");
  const {currentImage, isModalOpen, openModal, closeModal} = useImageView();
  const [isView, setIsView] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Helper function to safely concatenate name parts
  const formatFullName = (firstname, lastname) => {
    const name = [firstname, lastname].filter(Boolean).join(" ").trim();
    return name || "Anonymous";
  };

  // updated data to include the name of users and responder which not included in original list of emergencyHistory
  const updatedData = emergencyHistory.map((emergency) => {
    const user = users.find((user) => user?.id === emergency?.userId);
    const responder = responders.find((responder) => responder?.id === emergency?.responderId);

    return {
      ...emergency,
      userName: formatFullName(user?.firstname, user?.lastname),
      responderName: responder ? formatFullName(responder?.firstname, responder?.lastname) : "Waiting for responder",
      userID: user?.customId || "N/A",
      responderID: responder?.customId || "N/A",
      responderImage: responder?.img || "",
    };
  });

  const recordDetails = updatedData.find((item) => item?.id === selectedId) || {};

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
  const filteredData = useFilteredData(updatedData, searchQuery, searchFields);

  const {
    currentPage,
    setCurrentPage,
    indexOfLastItem,
    indexOfFirstItem,
    currentItems,
    totalPages,
  } = usePagination(filteredData);

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
    const recordDetails = updatedData.find((item) => item?.id === emergency?.id) || {};

    return (
      <>
        <td className="px-6 py-4 whitespace-nowrap">{recordDetails?.emergencyId || "N/A"}</td>
        <Tooltip title={recordDetails?.userID || "N/A"} placement="top" arrow>
          <td className="px-6 py-4 whitespace-nowrap">{recordDetails?.userName || "Anonymous"}</td>
        </Tooltip>
        <Tooltip title={recordDetails?.location?.address || "No address available"} placement="top" arrow>
          <td className="px-6 py-4 max-w-16 text-ellipsis overflow-hidden whitespace-nowrap">
            {recordDetails?.location?.address || "No address"}
          </td>
        </Tooltip>
        <td className="px-6 py-4 whitespace-normal text-wrap">
          {recordDetails?.date ? formatDateWithTime(recordDetails.date) : "N/A"}
        </td>
        <td>
          <p className={`text-center`}>
          <StatusBadge status={recordDetails?.status} />
          </p>
        </td>
        <td className="px-6 py-4">
          <Tooltip
            title={recordDetails?.responderName || "No responder assigned"}
            placement="top"
            arrow
          >
            <div className="flex items-center justify-center">
              {recordDetails?.responderImage ? (
                <img
                  src={recordDetails.responderImage}
                  alt="responder"
                  className="h-8 w-8 p-0 bg-gray-600 rounded-full cursor-pointer"
                  onClick={() => openModal(recordDetails.responderImage)}
                />
              ) : (
                "Waiting for responder"
              )}
            </div>
          </Tooltip>
        </td>
        <td className="px-6 py-4">
          <div className="flex px-2 space-x-2 flex-row items-center justify-evenly">
            <IconButton
              icon={icons.view}
              color={"blue"}
              onClick={() => {
                setIsView(!isView);
                setSelectedId(emergency?.id);
              }}
              tooltip={"Show more details"}
              fontSize={"small"}
            />
          </div>
        </td>
      </>
    );
  };

  const RenderDetails = ({ data, color }) => {
    const filteredData = data.filter(({ value }) => value != null && value !== "");
    if (filteredData.length === 0) return null;

    return (
      <div
        className={`bg-${color}-100 p-2 text-sm text-${color}-500 border-l-2 border-l-${color}-500 rounded-r-md space-y-1`}
      >
        {filteredData.map(({ label, value }, index) => (
          <div key={index} className="flex flex-row">
            <p className="w-1/2">{label}</p>
            <p className="flex-1 font-bold">{value}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <HeaderAndSideBar
      content={
        <>
          <Toolbar
            label={"Emergency Records"}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <Table
            headers={HeaderData}
            data={currentItems}
            renderRow={renderRow}
            emptyMessage={"No records found"}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            data={filteredData}
          />
          {isModalOpen && (
            <ViewImage 
              currentImage={currentImage}
              closeModal={closeModal}
            />
          )}
          {isView && (
            <Modal
              closeButton={() => setIsView(!isView)}
              children={
                <div className="w-full space-y-4">
                  <RenderDetails
                    data={[
                      {
                        label: "Emergency ID",
                        value: recordDetails?.emergencyId || "N/A",
                      },
                      { label: "User ID: ", value: recordDetails?.userID || "N/A" },
                      {
                        label: "Responder ID: ",
                        value: recordDetails?.responderID || "N/A",
                      },
                    ]}
                    color={"yellow"}
                  />
                  <RenderDetails
                    data={[
                      { label: "User Name: ", value: recordDetails?.userName || "Anonymous" },
                      {
                        label: "Responder Name: ",
                        value: recordDetails?.responderName,
                      },
                    ]}
                    color={"gray"}
                  />
                  <RenderDetails
                    data={[
                      {
                        label: "Response Time: ",
                        value: recordDetails?.responseTime
                          ? formatDateWithTime(recordDetails.responseTime)
                          : "N/A",
                      },
                      {
                        label: "Resolved Time: ",
                        value: recordDetails?.dateResolved
                          ? formatDateWithTime(recordDetails.dateResolved)
                          : "N/A",
                      },
                    ]}
                    color={"gray"}
                  />
                  <RenderDetails
                    data={[
                      {
                        label: "Geocode Location: ",
                        value: recordDetails?.location?.address || "No address available",
                      },
                      {
                        label: "Latitude: ",
                        value: recordDetails?.location?.latitude || "N/A",
                      },
                      {
                        label: "Longitude",
                        value: recordDetails?.location?.longitude || "N/A",
                      },
                    ]}
                    color={"gray"}
                  />
                  <RenderDetails 
                    data={[{
                      label: "Description", 
                      value: recordDetails?.description || "No description available"
                    }]}
                    color={"gray"}
                  />
                </div>
              }
            />
          )}
        </>
      }
    />
  );
};

export default Records;