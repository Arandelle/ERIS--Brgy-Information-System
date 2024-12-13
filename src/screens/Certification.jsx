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
import Modal from "../components/ReusableComponents/Modal"

const Certification = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: clearance } = useFetchData("requestClearance");
  const { data: template} = useFetchData("templates");
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const editorRef = useRef(null);

  const searchFields = ["firstname", "lastname", "address", "age"];
  const Headers = ["Firstname", "Lastname", "Address", "Age", "Action"];

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
  
    // Find the template matching the rowData type
    const selectedTemplate = Object.values(template).find(
      (temp) => temp.type === rowData.type
    );
  
    if (!selectedTemplate) {
      toast.error(`No template found for document type: ${rowData.type}`);
      return;
    }
  
    let content = selectedTemplate.content; // HTML content stored in the template
  
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
              body {
                font-family: Arial, sans-serif;
                padding: 1in;
                width: 8.5in;
                height: 11in;
                background-color: #fff;
                border: 1px solid #ccc;
              }
            </style>
          </head>
          <body>${content}</body>
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
            <Modal 
              closeButton={() => setShowAddTemplate(false)}
              children={
              <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                onInit={(_evt, editor) => (editorRef.current = editor)}
                init={{
                  width: "10in",
                  height: "5in",
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                    "lineheight",
                    "dragdrop image link media",
                    "mergetags",
                  ],
                  toolbar:
                    "undo redo | blocks | image link media |" +
                    "bold italic forecolor | mergetags | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "lineheight | removeformat | help",
                  content_style: `
                        body {
                        font-family: Arial, sans-serif;
                        background-color: #fff;
                        cursor: auto;
                        }`,
                  tinycomments_mode: "embedded",
                  tinycomments_author: "Author name",
                  mergetags_list: [
                    { value: "firstname", title: "First Name" },
                    { value: "lastname", title: "Last Name" },
                    { value: "age", title: "Age" },
                    { value: "address", title: "Address" },
                    { value: "gender", title: "Gender" },
                  ],
                }}
                initialValue={`<p>This is to certify that {{firstname}}, {{lastname}} is residents of Bagtas </p>`}
              />
              }
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
