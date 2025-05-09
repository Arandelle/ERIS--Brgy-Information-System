import React, { useEffect, useState } from "react";
import HeaderAndSideBar from "../../components/ReusableComponents/HeaderSidebar";
import ButtonStyle from "../../components/ReusableComponents/Button";
import icons from "../../assets/icons/Icons";
import TemplateModal from "./TemplateModal";
import Toolbar from "../../components/ToolBar";
import { useFetchData } from "../../hooks/useFetchData";
import EmptyLogo from "../../components/ReusableComponents/EmptyLogo";
import AskCard from "../../components/ReusableComponents/AskCard";
import handleDeleteData from "../../hooks/handleDeleteData";
import { toast } from "sonner";
import { templateContent } from "./TemplateContent";
import { ref, update } from "firebase/database";
import { database, storage } from "../../services/firebaseConfig";
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import useSearchParam from "../../hooks/useSearchParam";
import logAuditTrail from "../../hooks/useAuditTrail";

const Templates = () => {
  const {setSearchParams} = useSearchParam();
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isTemplateEdit, setIsTemplateEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const { data: templates } = useFetchData("templateContent");
  const { data: documentsData } = useFetchData("templates");
  const [templateData, setTemplateData] = useState({});
  const [images, setImages] = useState({
    image1File: null,
    image1Preview: "",
    image2File: null,
    image2Preview: "",
    image3File: null,
    image3Preview: "",
    image4File: null,
    image4Preview: "",
  });

  useEffect(() => {
    if (documentsData && documentsData.length > 0) {
      // Find the document with the specific ID (e.g., "document1")
      const document1Data = documentsData.find((doc) => doc.id === "document1");

      if (document1Data) {
        // Update the templateData state with the values from document1
        setTemplateData({
          ...document1Data,
        });
      }
    }
  }, [documentsData]);

  const selectedTemplate = templates?.find(
    (template) => template.id === selectedTemplateId
  );

  const handleImageChange = (e, imageId) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type.startsWith("image/") &&
      file.size <= 5 * 1024 * 1024
    ) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prevImages) => ({
          ...prevImages,
          [`${imageId}File`]: file,
          [`${imageId}Preview`]: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      toast.error(
        "Invalid file type or size. Please upload an image under 5MB."
      );
    }
  };

  // Generate the template body content based on the selected template
  const renderTemplate = selectedTemplate
    ? templateContent(
        selectedTemplate,
        templateData,
        selectedTemplate.title,
        isTemplateEdit,
        handleImageChange,
        images
      )
    : null;

  // show the specefic template based on templateId
  const handleShowTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
    setSearchParams({templates})
  };

  const handleShowModal = () => {
    setShowAddTemplate(!showAddTemplate);
    setIsEdit(false);
    setSearchParams(!showAddTemplate ? "add news" : "");
  };

  const handleEditClick = (templateId) => {
    setShowAddTemplate(!showAddTemplate);
    setIsEdit(true);
    setSelectedTemplateId(templateId);
    setSearchParams({edit: templateId})
  };

  const handleDeleteModal = (id) => {
    setSelectedTemplateId(id);
    setShowDeleteModal(true);
    setSearchParams({delete: id})
  };

  const handleConfirmDelete = async () => {
    try {
      await handleDeleteData(selectedTemplateId, "templateContent");
      await logAuditTrail("Deleted template")
    } catch (error) {
      toast.error(`Error deleting ${error}`);
    }

    setShowDeleteModal(false);
    setSearchParams({})
  };

  const handleTemplateIsEdit = () => {
    setIsTemplateEdit(!isTemplateEdit);
    setSearchParams(!isTemplateEdit ? "edit template" : "")
  };

  // save the template style (images, headers, etc.)
  const handleSaveTemplate = async () => {
    const templatesRef = ref(database, "templates/document1");

    const uploadImage = async (imageFile, oldImageUrl) => {
      if (!imageFile) return oldImageUrl;

      try {
        const fileRef = storageRef(
          storage,
          `template-images/${Date.now()}_${imageFile.name}`
        );
        await uploadBytes(fileRef, imageFile);
        const newImageUrl = await getDownloadURL(fileRef);

        // Delete the old image if it exists
        if (oldImageUrl) {
          try {
            const oldImageRef = storageRef(storage, oldImageUrl);
            await deleteObject(oldImageRef);
          } catch (error) {
            console.error("Failed to delete old image:", error);
          }
        }

        return newImageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error("Failed to upload image. Please try again.");
      }
    };

    try {
      // Get updated image URLs
      const image1Url = await uploadImage(
        images.image1File,
        templateData?.images?.image1
      );
      const image2Url = await uploadImage(
        images.image2File,
        templateData?.images?.image2
      );
      const image3Url = await uploadImage(
        images.image3File,
        templateData?.images?.image3
      );
      const image4Url = await uploadImage(
        images.image4File,
        templateData?.images?.image4
      );

      // Helper function to extract text content
      const getTextContent = (id, fallback) =>
        document.querySelector(`#${id}`)?.innerText || fallback;

      // Prepare updated template data
      const updatedTemplateData = {
        images: {
          image1: image1Url,
          image2: image2Url,
          image3: image3Url,
          image4: image4Url,
        },
        headers: {
          republic: getTextContent("republic", templateData.headers?.republic),
          province: getTextContent("province", templateData.headers?.province),
          municipality: getTextContent(
            "municipality",
            templateData.headers?.municipality
          ),
          barangay: getTextContent("barangay", templateData.headers?.barangay),
          office: getTextContent("office", templateData.headers?.office),
        },
        certificationTitle: getTextContent(
          "certificationTitle",
          templateData?.certificationTitle
        ),
        chairman: getTextContent("chairman", templateData?.chairman),
        counsilors: {
          counsilor1: getTextContent(
            "counsilor1",
            templateData.counsilors?.counsilor1
          ),
          counsilor2: getTextContent(
            "counsilor2",
            templateData.counsilors?.counsilor2
          ),
          counsilor3: getTextContent(
            "counsilor3",
            templateData.counsilors?.counsilor3
          ),
          counsilor4: getTextContent(
            "counsilor4",
            templateData.counsilors?.counsilor4
          ),
          counsilor5: getTextContent(
            "counsilor5",
            templateData.counsilors?.counsilor5
          ),
          counsilor6: getTextContent(
            "counsilor6",
            templateData.counsilors?.counsilor6
          ),
          counsilor7: getTextContent(
            "counsilor7",
            templateData.counsilors?.counsilor7
          ),
        },
        skChairperson: getTextContent(
          "skChairperson",
          templateData?.skChairperson
        ),
        secretary: getTextContent("secretary", templateData?.secretary),
        treasurer: getTextContent("treasurer", templateData?.treasurer),
      };

      // Update database
      await update(templatesRef, updatedTemplateData);
      await logAuditTrail("Update template style");

      setIsTemplateEdit(false);
      setSearchParams({})
      toast.success("Template saved successfully!");
    } catch (error) {
      toast.error(
        error.message || "An error occurred while saving the template."
      );
      console.error(error);
    }
  };

  return (
    <HeaderAndSideBar
      content={
        <div className="overflow-hidden">
          <Toolbar
            buttons={
              <ButtonStyle
                icon={icons.addCircle}
                color={"gray"}
                label={"Create Template"}
                fontSize={"small"}
                onClick={handleShowModal}
              />
            }
            label="List of Templates"
          />
          {/**Modal for creating template */}
          {showAddTemplate && (
            <TemplateModal
              setShowAddTemplate={handleShowModal}
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
                    className={`px-4 text-green-500 dark:text-green-400 ${
                      isTemplateEdit ? "hidden" : ""
                    }`}
                    onClick={() => handleEditClick(selectedTemplate.id)}
                  >
                    Edit Content
                  </button>
                  <button
                    className="px-4 text-blue-500 dark:text-blue-400"
                    onClick={
                      isTemplateEdit
                        ? () => handleSaveTemplate()
                        : handleTemplateIsEdit
                    }
                  >
                    {isTemplateEdit ? "Save Changes" : "Edit Template"}
                  </button>
                  {isTemplateEdit && (
                    <button
                      className="px-4 text-gray-500 dark:text-gray-400"
                      onClick={handleTemplateIsEdit}
                    >
                      {"Cancel"}
                    </button>
                  )}
                  <button
                    className={`px-4 text-red-500 dark:text-red-400 ${
                      isTemplateEdit ? "hidden" : ""
                    }`}
                    onClick={() => handleDeleteModal(selectedTemplate.id)}
                  >
                    Delete Template
                  </button>
                </div>
                {/** Template Content */}
                <div className="w-[210mm] h-[297mm] m-auto p-[2mm] dark:text-gray-300 bg-white dark:bg-gray-800 shadow-md border border-gray-300 dark:border-gray-500">
                  {renderTemplate} {/**render the jsx template */}
                </div>
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
                toggleModal={() => {setShowDeleteModal(!showDeleteModal), setSearchParams({})}}
                question={
                  <span>
                    Do you want to delete
                    <span className="text-primary-500 text-bold">
                      {" "}
                      {
                        templates.find((item) => item.id === selectedTemplateId)
                          ?.title
                      }
                    </span>{" "}
                    ?{" "}
                  </span>
                }
                confirmText={"Delete"}
                onConfirm={handleConfirmDelete}
              />
            )}
          </>
        </div>
      }
    />
  );
};

export default Templates;
