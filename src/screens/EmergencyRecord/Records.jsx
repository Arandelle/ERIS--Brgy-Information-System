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
import FilterModal from "./FilterModal"; // Import the new FilterModal

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
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [statusFilters, setStatusFilters] = useState([]); // New state for status filters

  // updated data to include the name of users and responder which not included in original list of emergencyHistory
  const updatedData = emergencyHistory.map((emergency) => {
    const user = users.find((user) => user?.id === emergency?.userId);
    const responder = responders.find(
      (responder) => responder?.id === emergency?.responderId
    );

    return {
      ...emergency,
      userName: user?.fullname || emergency.fullname,
      responderName: responder ? responder.fullname : "Waiting for responder",
      userID: user?.customId || "--",
      responderID: responder?.customId || "--",
      responderImage: responder?.img || "",
      isUserAnonymized: user?.anonymized,
      isResponderAnonymized: responder?.anonymized,
      userReporter: emergency.reported && Object.values(emergency.reported)[0]?.userId === user?.id && user?.fullname,
      responderReporter: emergency.reported && Object.values(emergency.reported)[0]?.userId === responder?.id && responder?.fullname
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

  // First apply search filter
  const searchFilteredData = useFilteredData(updatedData, searchQuery, searchFields);

  // Then apply status filter
  const filteredData = statusFilters.length > 0 
    ? searchFilteredData.filter(item => statusFilters.includes(item.status))
    : searchFilteredData;

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

    const displayValue = (value, isAnonymized = false) => {
      return value && !isAnonymized ? value : isAnonymized ? "Anonymized" : "----";
    };

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
        <RowDataStyle
          data={displayValue(recordDetails?.userName || recordDetails?.fullname, recordDetails.isUserAnonymized)}
        />
        <RowDataStyle data={displayValue(recordDetails?.location?.geoCodeLocation, recordDetails.isUserAnonymized)} />
        <RowDataStyle data={formatDateWithTime(recordDetails?.date)} />
        <RowDataStyle data={recordDetails?.status} status />
        <td className="px-6 py-4">
          <Tooltip
            title={displayValue(recordDetails?.responderName, recordDetails.isResponderAnonymized) || "No responder assigned"}
            placement="top"
            arrow
          >
            <div className="flex items-center justify-center">
              {recordDetails?.responderImage && !recordDetails.isResponderAnonymized ? (
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

  const filterData = () => {
    setShowFilterModal(true);
  };

  // Handle applying status filters
  const handleApplyStatusFilter = (selectedStatuses) => {
    setStatusFilters(selectedStatuses);
    setCurrentPage(1); // Reset to first page when filter is applied
  };

  // Get the filter button label based on active filters
  const getFilterButtonLabel = () => {
    if (statusFilters.length === 0) {
      return "Filter";
    }
    return `Filter (${statusFilters.length})`;
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
                <ButtonStyle
                  icon={icons.filter}
                  label={getFilterButtonLabel()}
                  color={statusFilters.length > 0 ? "blue" : "gray"}
                  fontSize={"small"}
                  onClick={filterData}
                />
              </>
            }
            label={"Emergency Records"}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          
          {/* Show active filters indicator */}
          {statusFilters.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-800">
                    Active Filters:
                  </span>
                  <div className="flex gap-2">
                    {statusFilters.map((status) => (
                      <span
                        key={status}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize"
                      >
                        {status}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleApplyStatusFilter([])}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

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
            <AddRecordModal setAddRecordModal={setAddRecordModal} />
          )}

          {showFilterModal && (
            <FilterModal
              isOpen={showFilterModal}
              onClose={() => setShowFilterModal(false)}
              onApplyFilter={handleApplyStatusFilter}
              currentFilters={statusFilters}
            />
          )}
        </>
      }
    />
  );
};

export default Records;