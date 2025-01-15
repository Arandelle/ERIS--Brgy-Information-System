import React, { useState } from "react";
import HeaderAndSideBar from "../../components/ReusableComponents/HeaderSidebar";
import ButtonStyle from "../../components/ReusableComponents/Button";
import icons from "../../assets/icons/Icons";
import TemplateModal from "./TemplateModal";
import Toolbar from "../../components/ToolBar";
import { useFetchData } from "../../hooks/useFetchData";
import { useFetchSystemData } from "../../hooks/useFetchSystemData";
import { generateBodyTemplate } from "./generateTemplate";
import EmptyLogo from "../../components/ReusableComponents/EmptyLogo";
import AskCard from "../../components/ReusableComponents/AskCard";
import handleDeleteData from "../../hooks/handleDeleteData";

const Templates = () => {
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isTemplateEdit, setIsTemplateEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const { data: templates } = useFetchData("templates");
  const { systemData } = useFetchSystemData();

  const selectedTemplate = templates?.find(
    (template) => template.id === selectedTemplateId
  );

  // Generate the template body content based on the selected template
  const renderTemplate = selectedTemplate
    ? generateBodyTemplate(
        systemData?.imageUrl,
        systemData?.tanzaLogoUrl,
        selectedTemplate?.content,
        isTemplateEdit
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
  };

  const handleDeleteModal = (id) => {
    setSelectedTemplateId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await handleDeleteData(selectedTemplateId, "templates");
    } catch (error) {
      toast.error(`Error deleting ${error}`);
    }

    setShowDeleteModal(false);
  };

  const handleTemplateIsEdit = () => {
    setIsTemplateEdit(!isTemplateEdit);
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
                label={"Create Template"}
                fontSize={"small"}
                onClick={handleCloseButton}
              />
            }
            label="List of Templates"
          />
          {/**Modal for creating template */}
          {showAddTemplate && (
            <TemplateModal
              setShowAddTemplate={setShowAddTemplate}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              selectedTemplateId={selectedTemplateId}
            />
          )}

          <>
            <div className="flex flex-row space-x-2 p-4 bg-white dark:bg-gray-800">
              {templates?.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleShowTemplate(template.id)}
                  className={`border-r-2 dark:border-r-gray-300 p-2 hover:text-blue-600 ${
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
                <div className="flex flex-row space-x-2 bg-white dark:bg-gray-800 p-4 mb-4 text-gray-500">
                  <button
                    className={`px-4 text-green-500 dark:text-green-400 ${isTemplateEdit ? "hidden" : ""}`}
                    onClick={() => handleEditClick(selectedTemplate.id)}
                  >
                    Edit Content
                  </button>
                  <button className="px-4 text-blue-500 dark:text-blue-400" onClick={handleTemplateIsEdit}>
                    {isTemplateEdit ? "Save Changes" : "Edit Template"}
                  </button>
                  {isTemplateEdit && (
                    <button className="px-4 text-gray-500 dark:text-gray-400" onClick={handleTemplateIsEdit}>
                    {"Cancel"}
                  </button>
                  )}
                  <button className={`px-4 text-red-500 dark:text-red-400 ${isTemplateEdit ? "hidden" : ""}`} onClick={()=>handleDeleteModal(selectedTemplate.id)}>Delete Template</button>
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

            {showDeleteModal && (
              <AskCard
              toggleModal={() => setShowDeleteModal(!showDeleteModal)}
              question={
                <span>
                  Do you want to delete
                  <span className="text-primary-500 text-bold">
                    {" "}
                    {templates.find((item) => item.id === selectedTemplateId)?.title}
                  </span>{" "}
                  ?{" "}
                </span>
              }
              confirmText={"Delete"}
              onConfirm={handleConfirmDelete}
            />
            )}
          </>
        </>
      }
    />
  );
};

export default Templates;
