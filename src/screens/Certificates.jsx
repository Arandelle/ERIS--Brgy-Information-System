import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import HeaderAndSideBar from "../components/ReusableComponents/HeaderSidebar";
import handleAddData from "../hooks/handleAddData";
import { toast } from "sonner";

const Certificates = () => {
  const editorRef = useRef(null);
  const [templateTitle, setTemplateTitle] = useState("");
  const [templates, setTemplates] = useState([]); // For displaying templates

  const saveTemplate = async () => {
    if (!templateTitle.trim()) {
      toast.error("Template title is required!");
      return;
    }

    if (editorRef.current) {
      const content = editorRef.current.getContent();

      const templateData = {
        title: templateTitle,
        content,
      };

      await handleAddData(templateData, "templates");
      toast.success("Template saved successfully!");

      // Optional: Update templates list after saving
      setTemplates((prevTemplates) => [...prevTemplates, templateData]);

      // Reset the title input
      setTemplateTitle("");
    } else {
      toast.error("Editor content is empty!");
    }
  };

  return (
    <HeaderAndSideBar
      content={
        <div className="space-y-2">
          <h2 className="text-center text-xl p-4 bg-white">
            Create Barangay Certificates Template
          </h2>
          <div className="">
            <label className="block text-gray-700 font-bold mb-2">
              Template Title:
            </label>
            <input
              type="text"
              value={templateTitle}
              onChange={(e) => setTemplateTitle(e.target.value)}
              placeholder="Enter template title"
              className="w-full border p-2 rounded-md"
            />
          </div>
          <Editor
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
            onInit={(_evt, editor) => (editorRef.current = editor)}
            init={{
              height: "15in",
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
                'dragdrop image link media',
              ],
              toolbar:
                "undo redo | blocks | image link media |" +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "lineheight | removeformat | help",
              content_style: `
                    body {
                    font-family: Arial, sans-serif;
                    line-height: 1.5;
                    padding: 1in;
                    width: 8.5in;
                    height: 11in;
                    background-color: #fff;
                    border: 1px solid #ccc;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                    }`,
              tinycomments_mode: "embedded",
              tinycomments_author: "Author name",
            }}
            initialValue="<p>Welcome to TinyMCE! Customize your template here.</p>"
          />
          <div className="place-self-end py-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={saveTemplate}
            >
              Save Template
            </button>
          </div>

          {/* Render Saved Templates */}
          <div className="mt-8">
            <h3 className="text-xl font-bold">Saved Templates</h3>
            {templates.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {templates.map((template, index) => (
                  <li
                    key={index}
                    className="bg-gray-100 p-4 rounded-lg shadow-md"
                  >
                    <h4 className="font-bold">{template.title}</h4>
                    <div
                      className="mt-2"
                      dangerouslySetInnerHTML={{ __html: template.content }}
                    ></div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No templates saved yet.</p>
            )}
          </div>
        </div>
      }
    />
  );
};

export default Certificates;
