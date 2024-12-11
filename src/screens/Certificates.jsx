import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import HeaderAndSideBar from "../components/ReusableComponents/HeaderSidebar";
import { toast } from "sonner";

const Certificates = () => {
  const editorRef = useRef(null);
  const [templateData, setTemplateData] = useState({
    "First.Name": "John",
    Email: "john.doe@example.com",
  });

  const saveTemplate = () => {
    if (editorRef.current) {
      let content = editorRef.current.getContent();

      // Replace placeholders with dynamic data
      Object.entries(templateData).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        content = content.replace(new RegExp(placeholder, "g"), value);
      });

      toast.success("Template saved successfully!");
      console.log("Updated Content: ", content);

      // Render printable content
      const printWindow = window.open("", "_blank");
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Printable Certificate</title>
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
    }
  };

  return (
    <HeaderAndSideBar
      content={
        <div>
          <h2 className="text-center p-4 bg-white rounded-lg">
            Barangay Certificates Template
          </h2>
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
              ],
              toolbar:
                "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
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
              mergetags_list: [
                { value: "First.Name", title: "First Name" },
                { value: "Email", title: "Email" },
              ],
            }}
            initialValue={`Welcome to TinyMCE! Your name is {{First.Name}} and your email is {{Email}}.`}
          />
          <div className="place-self-end py-4">
            <button className="bg-blue-500 p-2 rounded-md" onClick={saveTemplate}>
              Save & Print Template
            </button>
          </div>
        </div>
      }
    />
  );
};

export default Certificates;
