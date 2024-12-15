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

const Certification = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: clearance } = useFetchData("requestClearance");
  const { data: template } = useFetchData("templates");
  const { systemData } = useFetchSystemData();
  const [showRequestCert, setShowRequestCert] = useState(false);

  const searchFields = ["fullname","docsType","age", "address","gender","civilStatus","moveInYear"];
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

  const TableData = ({ data }) => {
    const nullValue = <p className="italic text-nowrap text-xs">null</p>;
    return (
      <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm">
        <div className="truncate max-w-[100px] sm:max-w-[200px]">
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

      const renderTemplate = generateFullTemplate(selectedTemplate.title, systemData?.imageUrl, systemData?.tanzaLogoUrl, content)
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

  const renderRow = (userData) => {
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
              bgColor={"bg-gray-100"}
              fontSize={"small"}
              tooltip={"Accept and Print"}
              onClick={() => printCertificate(userData)}
            />
             <IconButton
              icon={icons.view}
              color={"blue"}
              bgColor={"bg-blue-100"}
              fontSize={"small"}
              tooltip={"View"}
            />
            <IconButton
              icon={icons.edit}
              color={"green"}
              bgColor={"bg-green-100"}
              fontSize={"small"}
              tooltip={"Edit"}
            />
            <IconButton
              icon={icons.cancel}
              color={"red"}
              bgColor={"bg-red-100"}
              fontSize={"small"}
              tooltip={"Reject"}
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
            <ClearanceModal setShowRequestCert={setShowRequestCert} />
          )}

          <Table headers={Headers} data={currentItems} renderRow={renderRow} />
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
