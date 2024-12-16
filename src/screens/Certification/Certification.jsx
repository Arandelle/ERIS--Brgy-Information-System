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

const Certification = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: clearance } = useFetchData("requestClearance");
  const { data: template } = useFetchData("templates");
  const { systemData } = useFetchSystemData();
  const [showRequestCert, setShowRequestCert] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
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
    if (a.status === "rejected" && b.status !== "rejected") return 1;
    if (a.status !== "rejected" && b.status === "rejected") return -1;
    return 0;
  });

  const TableData = ({ data }) => {
    const nullValue = <p className="italic text-nowrap text-xs">null</p>;
    return (
      <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm">
        <div
          className={`truncate max-w-[100px] sm:max-w-[200px] ${
            data === "rejected" ? "text-red-500" : ""
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
      printWindow.print();
      toast.success(`${selectedTemplate.title} rendered successfully!`);
    } else {
      toast.error("Template content is empty.");
    }
  };

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
    setShowRejectModal(true);
  };

  const handleRejectClearance = async () => {
    try {
      const dataRef = ref(database, `requestClearance/${selectedId}`);
      const clearanceData = {
        ...userData,
        status: "rejected",
      };

      await update(dataRef, clearanceData);
      toast.info("Clearance request rejected");
    } catch (error) {
      toast.error(`Error updating: ${error}`);
    }

    setShowRejectModal(false);
  };

  const handleCloseModal = () => {
    setShowRequestCert(!showRequestCert);
    setIsEdit(!isEdit);
  };

  const renderRow = (userData) => {
    const { status } = userData;
    const rejected = status === "rejected";

    return (
      <>
        <TableData data={userData.docsType} />
        <TableData data={userData.fullname} />
        <TableData data={userData.age} />
        <TableData data={userData.gender} />
        <TableData data={userData.address} />
        <TableData data={userData.moveInYear} />
        <TableData data={userData.status} />
        <td className="">
          <div className="flex items-center justify-center space-x-2">
            <IconButton
              icon={icons.print}
              color={"gray"}
              fontSize={"small"}
              tooltip={"Accept and Print"}
              className={rejected && "cursor-not-allowed opacity-35"}
              onClick={rejected ? "" : () => printCertificate(userData)}
            />
            <IconButton
              icon={icons.view}
              color={"blue"}
              fontSize={"small"}
              tooltip={"View"}
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
              icon={icons.cancel}
              color={"red"}
              fontSize={"small"}
              tooltip={"Reject"}
              className={rejected && "cursor-not-allowed opacity-50"}
              onClick={rejected ? "" : () => handleRejectClick(userData)}
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

          {showRejectModal && (
            <AskCard
              toggleModal={() => setShowRejectModal(false)}
              question={
                <span>
                  Do you want to reject
                  <span className="text-primary-500 text-bold">
                    {" "}
                    {clearance.find((item) => item.id === selectedId)?.fullname}
                  </span>{" "}
                  request ?{" "}
                </span>
              }
              confirmText={"Reject"}
              onConfirm={handleRejectClearance}
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
