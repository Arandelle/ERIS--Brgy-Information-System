import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import handleAddData from "../hooks/handleAddData";
import { toast } from "sonner";
import Modal from "../components/ReusableComponents/Modal";
import { InputField } from "../components/ReusableComponents/InputField";

const CreateTemplate = ({ setShowAddTemplate }) => {
  const editorRef = useRef(null);
  const [templateData, setTemplateData] = useState({
    title: "",
    docsType: "",
  });

  const saveTemplate = async () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();

      const certData = {
        ...templateData,
        content,
      };

      await handleAddData(certData, "templates");
  
      setTemplateData({});
      setShowAddTemplate(false);
    } else {
      toast.error("Editor content is empty!");
    }
  };

  return (
    <Modal
      closeButton={() => setShowAddTemplate(false)}
      title={"Create Certificate Template"}
      children={
        <div className="space-y-2">
          <div className="space-y-4">
            <label className="block text-gray-700 font-bold">
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
            <label className="block text-gray-700 font-bold">
              Certificate Type:
            </label>
            <select
              className="px-4 py-2 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-gray-400 focus:border-gray-400 dark:placeholder:text-gray-200 dark:text-gray-200 dark:bg-gray-600 w-full"
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
            <label className="block text-gray-700 font-bold">
              Edit Content:
            </label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              onInit={(_evt, editor) => (editorRef.current = editor)}
              init={{
                width: "10in",
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
                  { value: "firstname", title: "First Name" },
                  { value: "lastname", title: "Last Name" },
                  { value: "age", title: "Age" },
                  { value: "address", title: "Address" },
                  { value: "gender", title: "Gender" },
                  { value: "civilStatus", title: "civil status" },
                  { value: "move-inYear", title: "move-in year" },
                ],
              }}
            />
          </div>
          <div className="place-self-end py-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={saveTemplate}
            >
              Save Template
            </button>
          </div>
        </div>
      }
    />
  );
};

export default CreateTemplate;
