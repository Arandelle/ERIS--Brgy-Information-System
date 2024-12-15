import React, { useState } from "react";
import HeaderAndSideBar from "../../components/ReusableComponents/HeaderSidebar";
import ButtonStyle from "../../components/ReusableComponents/Button";
import icons from "../../assets/icons/Icons";
import CreateTemplate from "./CreateTemplate";
import Toolbar from "../../components/ToolBar";
import { useFetchData } from "../../hooks/useFetchData";
import { useFetchSystemData } from "../../hooks/useFetchSystemData";
import { generateBodyTemplate } from "./generateTemplate";
import EmptyLogo from "../../components/ReusableComponents/EmptyLogo";

const Templates = () => {
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const { data: templates } = useFetchData("templates");
  const { systemData } = useFetchSystemData();

  const selectedTemplate = templates?.find(
    (template) => template.id === selectedTemplateId
  );

  const renderTemplate = selectedTemplate
    ? generateBodyTemplate(
        systemData?.imageUrl,
        systemData?.tanzaLogoUrl,
        selectedTemplate?.content
      )
    : null;

  const handleShowTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
  };

  const handleCloseButton = () => {
    setShowAddTemplate(!showAddTemplate);
    setIsEdit(false);
  }

  const handleEditClick = (templateId) => {
    setShowAddTemplate(true);
    setIsEdit(true);
    setSelectedTemplateId(templateId);
  }

  return (
    <HeaderAndSideBar
      content={
        <>
          <Toolbar
            buttons={
              <ButtonStyle
                icon={icons.addCircle}
                color={"gray"}
                label={"Create Template"}
                fontSize={"small"}
                onClick={handleCloseButton}
              />
            }
            label="List of Templates"
          />

          {showAddTemplate && (
            <CreateTemplate
              setShowAddTemplate={setShowAddTemplate}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              selectedTemplateId={selectedTemplateId}
            />
          )}
          <>
            <div className="flex flex-row space-x-2 p-4 bg-white">
              {templates?.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleShowTemplate(template.id)}
                  className={`border-r-2 p-2 hover:text-blue-600 ${
                    selectedTemplateId === template.id
                      ? "text-blue-500"
                      : "text-gray-500"
                  }`}
                >
                  {template.title}
                </button>
              ))}
            </div>

            {renderTemplate ? (
              <>
                <div className="flex flex-row space-x-2 bg-white p-4 mb-4 text-gray-500">
                  <button
                    className="px-4 text-green-500"
                    onClick={() => handleEditClick(selectedTemplate.id)}
                  >
                    Edit
                  </button>
                  <button className="px-4 text-red-500">Delete</button>
                </div>
                <div
                  style={{
                    width: "210mm",
                    height: "297mm",
                    margin: "0 auto",
                    padding: "2mm",
                    background: "#fff",
                    border: "1px solid #ddd",
                    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                    overflow: "auto",
                  }}
                  dangerouslySetInnerHTML={{ __html: renderTemplate }}
                ></div>
              </>
            ) : (
              <div className="text-center text-xl flex items-center justify-center">
                <EmptyLogo
                  message={"Select template button to view its content"}
                />
              </div>
            )}
          </>
        </>
      }
    />
  );
};

export default Templates;
