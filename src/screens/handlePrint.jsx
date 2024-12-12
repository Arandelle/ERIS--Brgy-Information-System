export const saveTemplate = () => {
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