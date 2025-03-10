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
import MediaModal from "./MediaModal";
import useSearchParam from "../hooks/useSearchParam";
import useViewMedia from "../hooks/useViewMedia";

const Records = () => {
  const {setSearchParams} = useSearchParam();
  const { data: emergencyHistory = [] } = useFetchData("emergencyRequest");
  const { data: users = [] } = useFetchData("users");
  const { data: responders = [] } = useFetchData("responders");
  const { currentMedia, isModalOpen, openModal, closeModal } = useViewMedia();
  const [isView, setIsView] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // updated data to include the name of users and responder which not included in original list of emergencyHistory
  const updatedData = emergencyHistory.map((emergency) => {
    const user = users.find((user) => user?.id === emergency?.userId);
    const responder = responders.find(
      (responder) => responder?.id === emergency?.responderId
    );

    return {
      ...emergency,
      userName: user?.fullname,
      responderName: responder
        ? responder.fullname
        : "Waiting for responder",
      userID: user?.customId || "N/A",
      responderID: responder?.customId || "N/A",
      responderImage: responder?.img || "",
    };
  });

  const recordDetails =
    updatedData.find((item) => item?.id === selectedId) || {};

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
    "location.geoCodeLocation",
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
  } = usePagination(filteredData); // Pass filteredData to ensure pagination is applied to the filtered dataset

  const HeaderData = [
    "emergency id",
    "Name",
    "Location",
    "Submitted",
    "Status",
    "Responder",
    "Action",
  ];


  //  List of all emergency data 
  const renderRow = (emergency) => {
    const recordDetails = updatedData.find((item) => item?.id === emergency?.id) || {};

    const getStatusStyles = {
      "resolved" : "text-green-500",
      "pending" : "text-yellow-500",
      "on-going" : "text-blue-500",
      "expired" : "text-red-500",
    }

    const defaultStyle = "text-gray-500"

    const RowDataStyle = ({ data, status }) => {

      const statusStyle = getStatusStyles[data] || defaultStyle;

      return status ? (
        <td className={`text-center font-bold ${statusStyle}`}>
        {capitalizeFirstLetter(data || "")}
        </td>
      ) : (
        <td className="px-6 py-4 max-w-16 text-ellipsis overflow-hidden whitespace-nowrap">
          {data || "N/A"}
        </td>
      );
    };

    return (
      <>
        <RowDataStyle data={recordDetails?.emergencyId} />
        <RowDataStyle data={recordDetails?.userName} />
        <RowDataStyle data={recordDetails?.location?.geoCodeLocation} />
        <RowDataStyle data={formatDateWithTime(recordDetails?.date)} />
        <RowDataStyle data={recordDetails?.status} status />
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
                setSearchParams({uid: emergency.id})
              }}
              tooltip={"Show more details"}
              fontSize={"small"}
            />
          </div>
        </td>
      </>
    );
  };

  {
    /**Modal for emergency details */
  }
  const RenderDetails = ({ data }) => {
    const filteredData = data.filter(
      ({ value }) => value != null && value !== ""
    );
    if (filteredData.length === 0) return null;

    return (
      <div
        className={`bg-gray-100 dark:bg-gray-800 p-2 text-sm text-gray-500 dark:text-gray-300 border-l-2 border-l-gray-500 dark:border-gray-300 rounded-r-md space-y-1`}
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
            <MediaModal currentMedia={currentMedia} closeModal={closeModal} />
          )}
          {isView && (
            <Modal
              closeButton={() => {setIsView(!isView), setSearchParams({})}}
              title={"Emergency Details"}
              children={
                <div className="w-full space-y-4">
                  <RenderDetails
                    data={[
                      {
                        label: "Emergency ID",
                        value: recordDetails?.emergencyId || "N/A",
                      },
                      {
                        label: "User ID: ",
                        value: recordDetails?.userID || "N/A",
                      },
                      {
                        label: "Responder ID: ",
                        value: recordDetails?.responderID || "N/A",
                      },
                    ]}
                  />
                  <RenderDetails
                    data={[
                      {
                        label: "Sender Name: ",
                        value: recordDetails?.userName || "Anonymous",
                      },
                      {
                        label: "Responder Name: ",
                        value: recordDetails?.responderName,
                      },
                      {
                        label: "Sender Location",
                        value: recordDetails?.senderLocation || recordDetails.location.geoCodeLocation
                      }
                    ]}
                    
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
                    
                  />
                  <RenderDetails
                    data={[
                      {
                        label: "Emergency Location: ",
                        value:
                          recordDetails?.location?.geoCodeLocation ||
                          "No address available",
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
                    
                  />
                  <RenderDetails
                    data={[
                      {
                        label: "Description",
                        value:
                          recordDetails?.description ||
                          "No description available",
                      },
                      {
                        label: "Response Message",
                        value:
                          recordDetails?.messageLog ||
                          "No message available",
                      },
                    ]}
                    
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
