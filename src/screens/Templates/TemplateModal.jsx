import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import handleAddData from "../../hooks/handleAddData";
import { toast } from "sonner";
import Modal from "../../components/ReusableComponents/Modal";
import { InputField } from "../../components/ReusableComponents/InputField";
import { useFetchData } from "../../hooks/useFetchData";
import handleEditData from "../../hooks/handleEditData";

const TemplateModal = ({ setShowAddTemplate, isEdit,setIsEdit, selectedTemplateId}) => {
  const editorRef = useRef(null);
  const {data: templates} = useFetchData("templateContent");
  const [isComplete, setIsComplete] = useState(false);
  const [templateData, setTemplateData] = useState({
    title: "",
    docsType: "",
  });

  const selectedTemplate = templates?.find(
    (template) => template.id === selectedTemplateId
  );

  const saveTemplate = async () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();

      const certData = {
        ...templateData,
        content,
      };

      await handleAddData(certData, "templateContent");
  
      setTemplateData({});
      setShowAddTemplate(false);
      setIsEdit(false);
    } else {
      toast.error("Editor content is empty!");
    }
  };

  const handleUpdateTemplate = async (id) => {

    if(editorRef.current){
      const content = editorRef.current.getContent();
      const updatedTemplate = {
        ...templateData,
        content
      };
  
      await handleEditData(id, updatedTemplate, "templateContent");
      setTemplateData({});
      setShowAddTemplate(false);
      setIsEdit(false);
      console.log(id);
    } else{
      toast.error("Editor content is empty");
    }
   
  }


  useEffect(() => {
    const {title, docsType} = templateData;
    const completeData = title && docsType;
    setIsComplete(completeData);
  },[templateData.title, templateData.docsType]);

  useEffect(() => {
    if(isEdit && selectedTemplate){
      setTemplateData({
        title: selectedTemplate?.title || "",
        docsType: selectedTemplate?.docsType || ""
      });
    };
  }, [isEdit,selectedTemplate]);

  return (
    <Modal
      closeButton={() => setShowAddTemplate(false)}
      title={`${isEdit ? "Edit Template" : "Create Template"}`}
      children={
        <div className="space-y-2">
          <div className="space-y-4 w-full lg:w-[10in]">
            <label className="block text-gray-700 dark:text-gray-300 font-bold">
              Template Title:
            </label>
            <InputField
              type={"text"}
              className={"w-full"}
              placeholder={"Enter template title"}
              value={templateData.title}
              onChange={(e) =>
                setTemplateData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />
            <label className="block text-gray-700 dark:text-gray-300 font-bold">
              Certificate Type:
            </label>
            <select
              className="px-4 py-2 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-gray-400 focus:border-gray-400 dark:placeholder:text-gray-200 dark:text-gray-300 dark:bg-gray-600 w-full"
              value={templateData.docsType}
              onChange={(e) =>
                setTemplateData({ ...templateData, docsType: e.target.value })
              }
            >
              <option value="" disabled>
                Select Certificate Type
              </option>
              <option value="Clearance">Clearance</option>
              <option value="Indigency">Indigency</option>
            </select>
            <label className="block text-gray-700 dark:text-gray-300 font-bold">
              Edit Content:
            </label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              onInit={(_evt, editor) => (editorRef.current = editor)}
              initialValue={isEdit ? selectedTemplate?.content : ""}
              init={{
                width: "100%",
                height: "5in",
                placeholder:
                  "Write the main content of the certificate here. This excludes the header, footer, and other fixed details",
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
                  { value: "fullname", title: "Full Name" },
                  { value: "age", title: "Age" },
                  { value: "address", title: "Address" },
                  { value: "gender", title: "Gender" },
                  { value: "civilStatus", title: "civil status" },
                  { value: "moveInYear", title: "move-in year" },
                  { value: "todayDate", title: "Date issued" },
                ],
              }
              }
            />
          </div>
          <div className="place-self-end py-4">
            <button
              className={` text-white px-4 py-2 rounded-md ${!isComplete ? "bg-gray-500 cursor-not-allowed" : isEdit ? "bg-green-500" : "bg-blue-500"}`}
              onClick={isEdit ? () => handleUpdateTemplate(selectedTemplateId) : saveTemplate}
              disabled={!isComplete}
            >
              {isEdit ? "Update Template" : "Save Template"}
            </button>
          </div>
        </div>
      }
    />
  );
};

export default TemplateModal;
