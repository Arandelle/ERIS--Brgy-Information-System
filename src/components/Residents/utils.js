import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { formatDate } from "../../helper/FormatDate";

// function to export data to excel
export const exportToExcel = (data, fileName = "residents.xlsx") => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    saveAs(blob, fileName);
  };
  
  // function to convert string to arrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };

  // Export the current view (filtered or selected users)
 export const handleExport = (isViewingSelected, selectedUsers, residents) => {
    const dataToExport = isViewingSelected
      ? selectedUsers.map((id) => residents.find((res) => res.id === id))
      : filteredResidents;

    const formattedData = dataToExport.map((resident) => ({
      Id: resident.id || "",
      Image: resident.img || "",
      Name: resident.name,
      Email: resident.email || "",
      Address: resident.address || "",
      Age: resident.age || "",
      Gender: resident.gender || "",
      Status: resident.status || "",
      Date: formatDate(resident.created) || "",
    }));

    exportToExcel(formattedData);
  };

    // Function to handle importing data from Excel file
 export const handleImportFile = (event, setResidents) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        // Check file type
        if (!file.name.match(/\.(xlsx|xls)$/)) {
          toast.error("Only .xlsx or .xls files are allowed!");
          return;
        }
        reader.onload = (e) => {
          try {
            const arrayBuffer = e.target.result;
            const workbook = XLSX.read(arrayBuffer, { type: "array" });
    
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
            const formattedData = jsonData.map((item, index) => ({
              id: index + Math.random(), // Generate a unique ID for each item, if not already present
              img: item["Image"] || "",
              name: item["Name"] || "",
              email: item["Email"] || "",
              address: item["Address"] || "",
              age: item["Age"] || "",
              gender: item["Gender"] || "",
              status: item["Status"] || "",
              created: new Date(item["Date"]), // Ensure Date is correctly parsed as a Date object
            }));
    
            setResidents((prevResidents) => [...prevResidents, ...formattedData]);
          } catch (error) {
            console.error("Error parsing Excel file:", error);
            // Optionally, show a notification or toast to the user about the error
            toast.error("Error Please try again");
          }
        };
    
        reader.readAsArrayBuffer(file);
      };
    