import { useState } from "react";
import HeaderAndSideBar from "../../components/ReusableComponents/HeaderSidebar";
import Table from "../../components/Table";
import { useFetchData } from "../../hooks/useFetchData";
import { capitalizeFirstLetter } from "../../helper/CapitalizeFirstLetter";
import Toolbar from "../../components/ToolBar";
import Pagination from "../../components/Pagination";
import usePagination from "../../hooks/usePagination";
import useFilteredData from "../../hooks/useFilteredData";
import { formatDateWithTime } from "../../helper/FormatDate";
import IconButton from "../../components/ReusableComponents/IconButton";
import icons from "../../assets/icons/Icons";
import { Tooltip } from "@mui/material";
import MediaModal from "../MediaModal";
import useSearchParam from "../../hooks/useSearchParam";
import useViewMedia from "../../hooks/useViewMedia";
import ButtonStyle from "../../components/ReusableComponents/Button";
import ViewModal from "./ViewModal";
import AddRecordModal from "./AddRecordModal";

const Records = () => {
  const { setSearchParams } = useSearchParam();
  const { data: emergencyHistory = [] } = useFetchData("emergencyRequest");
  const { data: users = [] } = useFetchData("users");
  const { data: responders = [] } = useFetchData("responders");
  const { currentMedia, isModalOpen, openModal, closeModal } = useViewMedia();
  const [isView, setIsView] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [addRecordModal, setAddRecordModal] = useState(false);

  // updated data to include the name of users and responder which not included in original list of emergencyHistory
  const updatedData = emergencyHistory.map((emergency) => {
    const user = users.find((user) => user?.id === emergency?.userId);
    const responder = responders.find(
      (responder) => responder?.id === emergency?.responderId
    );

    return {
      ...emergency,
      userName: user?.fullname,
      responderName: responder ? responder.fullname : "Waiting for responder",
      userID: user?.customId || "--",
      responderID: responder?.customId || "--",
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
    const recordDetails =
      updatedData.find((item) => item?.id === emergency?.id) || {};

    const getStatusStyles = {
      resolved: "text-green-500",
      pending: "text-yellow-500",
      "on-going": "text-blue-500",
      expired: "text-red-500",
    };

    const defaultStyle = "text-gray-500";

    const RowDataStyle = ({ data, status }) => {
      const statusStyle = getStatusStyles[data] || defaultStyle;

      return status ? (
        <td className={`text-center font-bold ${statusStyle}`}>
          {capitalizeFirstLetter(data || "")}
        </td>
      ) : (
        <td className="px-6 py-4 max-w-16 text-ellipsis overflow-hidden whitespace-nowrap">
          {data || "--"}
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
                "--"
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
                setSearchParams({ uid: emergency.id });
              }}
              tooltip={"Show more details"}
              fontSize={"small"}
            />
          </div>
        </td>
      </>
    );
  };

  const handleAddRecord = () => {
    setAddRecordModal(true);
  };

  return (
    <HeaderAndSideBar
      content={
        <>
          <Toolbar
            buttons={
              <>
                <ButtonStyle
                  icon={icons.addCircle}
                  label={"Add Record"}
                  color={"gray"}
                  fontSize={"small"}
                  onClick={handleAddRecord}
                />
              </>
            }
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
            <ViewModal
              isView={isView}
              setIsView={setIsView}
              setSearchParams={setSearchParams}
              recordDetails={recordDetails}
            />
          )}

          {addRecordModal && (
            <AddRecordModal 
              setAddRecordModal={setAddRecordModal}
            />
          )}
        </>
      }
    />
  );
};

export default Records;
