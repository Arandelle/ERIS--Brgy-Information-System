import React, { useState, useRef } from "react";
import HeaderAndSideBar from "../components/ReusableComponents/HeaderSidebar";
import Toolbar from "../components/ToolBar";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import ButtonStyle from "../components/ReusableComponents/Button";
import icons from "../assets/icons/Icons";
import useFilteredData from "../components/SearchQuery";
import usePagination from "../hooks/usePagination";
import IconButton from "../components/ReusableComponents/IconButton";
import { useFetchData } from "../hooks/useFetchData";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "sonner";
import Modal from "../components/ReusableComponents/Modal";
import Logo from "../assets/images/logo.png";
import { useFetchSystemData } from "../hooks/useFetchSystemData";
import CreateTemplate from "./CreateTemplate";

const Certification = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: clearance } = useFetchData("requestClearance");
  const { data: template } = useFetchData("templates");
  const { systemData } = useFetchSystemData();
  const [showAddTemplate, setShowAddTemplate] = useState(false);

  const searchFields = ["firstname", "lastname", "address", "age"];
  const Headers = ["Firstname", "Lastname", "Address", "Age","Civil Status","Move-in Year", "Action"];

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
      (temp) => temp.docsType === rowData.type
    );

    if (!selectedTemplate) {
      toast.error(`No template found for document type: ${rowData.type}`);
      return;
    }

    let content = selectedTemplate.content;

    if (content) {
      // Replace placeholders with rowData
      Object.entries(rowData).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        content = content.replace(new RegExp(placeholder, "g"), value || "N/A");
      });

      // Render printable content
      const printWindow = window.open("", "_blank");
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>${selectedTemplate.title}</title>
            <style>
              /* Tailwind-like utility classes */
              .bg-white { background-color: white; }
              .p-10 { padding: 2.5rem; }
              .flex { display: flex; }
              .flex-row { flex-direction: row; }
              .items-center { align-items: center; }
              .justify-center { justify-content: center; }
              .text-center { text-align: center; }
              .font-bold { font-weight: 700; }
              .uppercase { text-transform: uppercase; }
              .h-32 { height: 8rem; }
              .w-32 { width: 8rem; }
              .rounded-full { border-radius: 9999px; }
              .mr-4 { margin-right: 1rem; }
              .mb-8 { margin-bottom: 2rem; }
              .bg-gray-100 { background-color: #f3f4f6; }
              .bg-gray-200 { background-color: #e5e7eb; }
              .p-4 { padding: 1rem; }
              .font-semibold { font-weight: 600; }
              .flex-1 { flex: 1 1 0%; }
              .basis-1/4 {flex-basis: 25%;}
              .basis-1/2 {flex-basis: 50%;}
              .basis-3/4 {flex-basis: 75%;}
              .gap-4 { gap: 1rem; }
              .leading-none { line-height: 1; }
              .text-xs {font-size: 0.75rem;
                        line-height: 1rem;}
              .text-3xl { font-size: 1.875rem; }
              .text-sm {font-size: 0.875rem;
                        line-height: 1.25rem;}
              .font-bold { font-weight: 700; }
              .bg-blue-100 { background-color: #ebf8ff; }
              .whitespace-nowrap {white-space: nowrap;}
              .border-r-2 {border-right: 1px solid black}
              .font-medium	{font-weight: 500;}
              .font-thin	{font-weight: 100;}

               ul {
                  list-style-type: none !important;
                  padding-left: 0 !important;
                  }
              li {
                  margin-left: 0 !important;
                  }
            </style>
            <style>
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
                /* Ensure all content is visible */
                @page {
                  size: auto;
                  margin: 5mm;
                }
              }
            </style>
          </head>
          <body class="bg-white">
            <div class="p-10">
              <div class="flex justify-center gap-4">
                <div class="flex-1 flex items-center justify-end basis-1/4">
                  <div>
                    <img
                      src="${systemData?.imageUrl}"
                      alt="Logo"
                      class="h-32 w-32 rounded-full mr-4"
                    />
                  </div>
                </div>
                <div class="flex-1 basis-1/2 flex items-center justify-center text-center bg-white p-4">
                  <p class="text-sm">
                    Republic of the Philippines</br>
                    Province of Cavite </br>
                    Municipality of Tanza </br>
                    <span class="font-bold uppercase">Barangay Bagtas</span> </br>
                    <span class="font-bold uppercase whitespace-nowrap">Office of the Barangay Chairman</span>
                  </p>
                </div>
                <div class="flex-1 basis-1/4 p-4 text-center">
                  <div>
                    <img
                      src="${systemData?.imageUrl}"
                      alt="Logo"
                      class="h-32 w-32 rounded-full mr-4"
                    />
                  </div>
                </div>
              </div>
      
              <p class="text-center font-bold uppercase text-3xl p-12">
                Barangay Certification
              </p>
      
              <div class="flex justify-center">
                <div class="flex-1 bg-blue-100 p-4 text-center border-r-2" style="flex: 1 1 25%">
                 <ul class="list-none text-sm whitespace-nowrap leading-none font-medium">
                    <li class="p-2">Manuel Clemente T. Mintu Jr. </br>
                    <span class="text-xs font-thin">Barangay Chairman</span>
                    </li>
                    <p class="text-xs p-2 font-thin">Barangay Counsilors</p>
                   <p>
                      <li>Ryan G. Mintu</li>
                      <li>Emmanuel T. Salvador Jr.</li>
                      <li>Luis G. Mercado</li>
                      <li>Yolanda T. Romana</li>
                      <li>Jenina T. Paminter</li>
                      <li>Emmanuel G. Mercado</li>
                      <li>Christopher I. Aron</li>
                   </p>

                   <p>
                      <li class="p-2">Maria Angela A. Capuz </br>
                      <span class="text-xs font-thin">SK Chairperson</span>
                      </li>
                   </p>

                    <p>
                      <li class="p-2">Maria Leonilla B. Castillo </br>
                      <span class="text-xs font-thin">Barangay Secretary</span>
                      </li>
                    </p>
                   <p>
                      <li class="p-2">Dominga T. Molina </br>
                      <span class="text-xs font-thin" >Barangay Treasurer</span>
                      </li>
                   </p>

                  </ul>
                </div>
                <div class="flex-1 bg-white p-4" style="flex: 1 1 75%">
                  ${content}
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
      
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
        <TableData data={userData.firstname} />
        <TableData data={userData.lastname} />
        <TableData data={userData.address} />
        <TableData data={userData.age} />
        <TableData data={userData.civilStatus} />
        <TableData data={userData.moveInYear} />
        <td className="">
          <div className="flex items-center justify-center space-x-4">
            <IconButton
              icon={icons.print}
              color={"gray"}
              bgColor={"bg-gray-100"}
              fontSize={"small"}
              tooltip={"Accept and Print"}
              onClick={() => printCertificate(userData)}
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
                label={"Add Template"}
                fontSize={"small"}
                onClick={() => setShowAddTemplate(true)}
              />
            }
            label="List of Certification Request"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          {showAddTemplate && (
           <CreateTemplate 
            setShowAddTemplate={setShowAddTemplate}
           />
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
