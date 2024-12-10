import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import HeaderAndSideBar from "../components/ReusableComponents/HeaderSidebar";

const Certificates = () => {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
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
              height: 1000,
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
            initialValue="Welcome to TinyMCE!"
          />
          <div className="place-self-end py-4">
            {" "}
            <button className="bg-blue-500 p-2 rounded-md">
              Save Template
            </button>
          </div>
        </div>
      }
    />
  );
};

export default Certificates;
