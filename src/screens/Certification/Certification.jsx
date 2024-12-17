import React, { useState, useRef } from "react";
import HeaderAndSideBar from "../../components/ReusableComponents/HeaderSidebar";
import Toolbar from "../../components/ToolBar";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import ButtonStyle from "../../components/ReusableComponents/Button";
import icons from "../../assets/icons/Icons";
import useFilteredData from "../../components/SearchQuery";
import usePagination from "../../hooks/usePagination";
import IconButton from "../../components/ReusableComponents/IconButton";
import { useFetchData } from "../../hooks/useFetchData";
import { toast } from "sonner";
import { useFetchSystemData } from "../../hooks/useFetchSystemData";
import ClearanceModal from "./ClearanceModal";
import { formatDate } from "../../helper/FormatDate";
import { generateFullTemplate } from "../Templates/generateTemplate";
import handleDeleteData from "../../hooks/handleDeleteData";
import AskCard from "../../components/ReusableComponents/AskCard";
import { ref, update } from "firebase/database";
import { database } from "../../services/firebaseConfig";
import ClearanceViewModal from "./ClearanceViewModal";
import {capitalizeFirstLetter} from "../../helper/CapitalizeFirstLetter"

const Certification = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: clearance } = useFetchData("requestClearance");
  const { data: template } = useFetchData("templates");
  const { systemData } = useFetchSystemData();
  const [showRequestCert, setShowRequestCert] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showUpdateStatus, setShowUpdateStatus] = useState({
    visible: false,
    status: ""
  });
  const [viewModal, setViewModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [userData, setUserData] = useState(null);

  const searchFields = [
    "fullname",
    "docsType",
    "age",
    "address",
    "gender",
    "civilStatus",
    "moveInYear",
  ];
  const Headers = [
    "Type",
    "Fullname",
    "Age",
    "Gender",
    "Address",
    "Move-in Year",
    "Status",
    "Action",
  ];

  const filteredData = useFilteredData(clearance, searchQuery, searchFields);
  const {
    currentPage,
    setCurrentPage,
    indexOfLastItem,
    indexOfFirstItem,
    currentItems,
    totalPages,
  } = usePagination(filteredData);

 const sortedData = currentItems.sort((a, b) => {
  const statusOrder = {"pending" : 1, "done" : 2, "rejected": 3};
  return statusOrder[a.status] - statusOrder[b.status];
});


  const TableData = ({ data }) => {
    const nullValue = <p className="italic text-nowrap text-xs">null</p>;
    const statusColor = {
      "rejected" : "text-red-500",
      "pending" : "text-yellow-500",
      "done" : "text-blue-500"
    } 
    return (
      <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm">
        <div
          className={`truncate max-w-[100px] sm:max-w-[200px] ${
           statusColor[data]
          }`}
        >
          {data || nullValue}
        </div>
      </td>
    );
  };

  const printCertificate = (rowData) => {
  if (!template || Object.keys(template).length === 0) {
    toast.error("No templates found. Please add a template first.");
    return;
  }

  const selectedTemplate = Object.values(template).find(
    (temp) => temp.docsType === rowData.docsType
  );

  if (!selectedTemplate) {
    toast.error(`No template found for document type: ${rowData.docsType}`);
    return;
  }

  let content = selectedTemplate.content;

  if (content) {
    // Replace placeholders with rowData
    const today = new Date();
    content = content.replace(/{{todayDate}}/g, formatDate(today));

    Object.entries(rowData).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      content = content.replace(new RegExp(placeholder, "g"), value || "N/A");
    });

    const renderTemplate = generateFullTemplate(
      selectedTemplate.title,
      systemData?.imageUrl,
      systemData?.tanzaLogoUrl,
      content
    );

    // Render printable content
    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(renderTemplate);
    printWindow.document.close();
    printWindow.onafterprint = () =>{
      setUserData(rowData);
      setSelectedId(rowData.id)
      setShowUpdateStatus({
        visible: true,
        status: "done"
      });
      printWindow.close();
    } 
  
    printWindow.print();
  } else {
    toast.error("Template content is empty.");
  }
};


  const handleViewClick = (userData) => {
    setUserData(userData);
    setViewModal(!viewModal);
  }

  const handleEditClick = (userData) => {
    setShowRequestCert(true);
    setSelectedId(userData.id);
    setUserData(userData);
    setIsEdit(true);
    console.log(isEdit, userData.docsType);
  };

  const handleRejectClick = (userData) => {
    setUserData(userData);
    setSelectedId(userData.id);
    setShowUpdateStatus({
      visible: true,
      status: userData.status === "rejected" ? "Delete" : "rejected"
    });
  };

  const handleUpdateClearanceStatus = async (status) => {
    try {
      const dataRef = ref(database, `requestClearance/${selectedId}`);
      const clearanceData = {
        ...userData,
        status
      };

      await update(dataRef, clearanceData);
      toast.info(`Clearance request ${status}`);
    } catch (error) {
      toast.error(`Error updating: ${error}`);
    }

    setShowUpdateStatus({
      visible: false,
      status: ""
    });
  };

  const handleDeleteConfirm = async () => {
    await handleDeleteData(selectedId, "requestClearance");
    setUserData({});
    setShowUpdateStatus({
      visible: false,
      status: "",
    })
  }

  const handleCloseModal = () => {
    setShowRequestCert(!showRequestCert);
    setIsEdit(!isEdit);
  };


  const renderRow = (userData) => {
    const { status } = userData;
    const rejected = status === "rejected";
    const done = status === "done";
    return (
      <>
        <TableData data={userData.docsType} />
        <TableData data={userData.fullname} />
        <TableData data={userData.age} />
        <TableData data={userData.gender} />
        <TableData data={userData.address} />
        <TableData data={userData.moveInYear} />
        <TableData data={status} />
        <td className="">
          <div className="flex items-center justify-center space-x-2">
            <IconButton
              icon={icons.print}
              color={"gray"}
              fontSize={"small"}
              tooltip={done ? "Reprint" : "Print"}
              className={rejected && "cursor-not-allowed opacity-35"}
              onClick={rejected ? "" : () => printCertificate(userData)}
            />
            <IconButton
              icon={icons.view}
              color={"blue"}
              fontSize={"small"}
              tooltip={"View"}
              onClick={() => handleViewClick(userData)}
            />
            <IconButton
              icon={icons.edit}
              color={"green"}
              fontSize={"small"}
              tooltip={"Edit"}
              className={rejected && "cursor-not-allowed opacity-50"}
              onClick={rejected ? "" : () => handleEditClick(userData)}
            />
            <IconButton
              icon={rejected ? icons.delete : icons.cancel}
              color={"red"}
              fontSize={"small"}
              tooltip={rejected ? "Delete" : "Reject"}
              onClick={() => handleRejectClick(userData)}
            />
          </div>
        </td>
      </>
    );
  };

  return (
    <HeaderAndSideBar
      content={
        <>
          <Toolbar
            buttons={
              <ButtonStyle
                icon={icons.addCircle}
                color={"gray"}
                label={"Create Request"}
                fontSize={"small"}
                onClick={() => setShowRequestCert(true)}
              />
            }
            label="List of Certification Request"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          {showRequestCert && (
            <ClearanceModal
              handleCloseModal={handleCloseModal}
              isEdit={isEdit}
              selectedId={selectedId}
              userData={userData}
            />
          )}

          {viewModal && (
            <ClearanceViewModal
              handleViewClick={handleViewClick}
              userData={userData}
             />
          )}

          {showUpdateStatus.visible && (
            <AskCard
              toggleModal={() => setShowUpdateStatus({
                visible: false,
                status: "",
              }, setUserData({}))}
              question={
                <span>
                  Is {""}
                  <span className="text-primary-500 text-bold">
                   {userData.fullname} {""}
                  </span>
                  request {showUpdateStatus.status} ?
                </span>
              }
              confirmText={capitalizeFirstLetter(showUpdateStatus.status)}
              onConfirm={userData.status === "rejected" ? () => handleDeleteConfirm() :
              () => handleUpdateClearanceStatus(showUpdateStatus.status)}
            />
          )}
 
          <Table headers={Headers} data={sortedData} renderRow={renderRow} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            data={filteredData}
          />
        </>
      }
    />
  );
};

export default Certification;
