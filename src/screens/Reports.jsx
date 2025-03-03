import React, { useEffect, useState } from "react";
import HeaderAndSideBar from "../components/ReusableComponents/HeaderSidebar";
import SelectStyle from "../components/ReusableComponents/SelectStyle";
import { InputField } from "../components/ReusableComponents/InputField";
import { useFetchData } from "../hooks/useFetchData";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (data, fileName = "emergency_summary.xlsx") => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Emergency Summary");
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
  saveAs(blob, fileName);
};

// Convert string to ArrayBuffer for Excel export
const s2ab = (s) => {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buf;
};



const Label = ({ label, isMainLabel }) => {
  return isMainLabel ? (
    <p className="font-semibold text-gray-700">{label}</p>
  ) : (
    <p className="text-gray-500 text-base">{label}</p>
  );
};

const Container = ({ label, inputs }) => {
  return (
    <div className=" space-y-3">
      <div>
        <Label label={label} />
      </div>
      <div>{inputs}</div>
    </div>
  );
};

const Reports = () => {
  const { data: emergencyRequest } = useFetchData("emergencyRequest");
  const [filteredData, setFilteredData] = useState([]);
  const [generateData, setGenerateData] = useState({
    reportTypes: "Emergency Summary",
    startDate: "",
    endDate: "",
    emergencyType: "Medical",
    format: "PDF",
    preview: "both",
  });

  // Function to format data for export
const handleExport = () => {
  if (!filteredData || filteredData.length === 0) {
    alert("No emergency request data available.");
    return;
  }

  const formattedData = filteredData.map((request) => ({
    ID: request.emergencyId || "N/A",
    Type: request.emergencyType || "N/A",
    Status: request.status || "N/A",
    Location: request.location?.address || "N/A",
    Date: new Date(request.timestamp).toLocaleString() || "N/A",
  }));

  console.log("Exporting Data:", formattedData);
  exportToExcel(formattedData, "emergency_summary.xlsx");
};

  useEffect(() => {
    if (!emergencyRequest || emergencyRequest.length === 0) return;
  
    let filtered = emergencyRequest.filter((item) => {
      const requestDate = new Date(item.timestamp);
      const type = item.emergencyType
      const start = generateData.startDate ? new Date(generateData.startDate) : null;
      const end = generateData.endDate ? new Date(generateData.endDate) : null;
      const emergencyType = generateData.emergencyType
  
      return (!start || requestDate >= start) && (!end || requestDate <= end) && emergencyType === type;
    });
  
    setFilteredData(filtered);
  }, [generateData, emergencyRequest]);
  

  return (
    <HeaderAndSideBar
      content={
        <div className="bg-white p-6 rounded-lg shadow-lg h-full">
          <h1 className="text-2xl font-bold text-blue-800 mb-6">
            Generate Reports
          </h1>
          <div className="flex flex-col md:flex-row space-x-0 md:space-x-5 space-y-5 md:space-y-0">
            <div className="space-y-4 flex-1 basis-1/2">
              <Container
                label={<Label label="Report Types" isMainLabel={true} />}
                inputs={
                  <SelectStyle
                    value={generateData.reportTypes}
                    onChange={(e) =>
                      setGenerateData((prev) => ({
                        ...prev,
                        reportTypes: e.target.value,
                      }))
                    }
                    options={[
                      "Emergency Summary",
                      "User Growth Analysis",
                      "Emergency Type Distribution",
                    ]}
                  />
                }
              />
              <Label label="Filters" isMainLabel={true} />
              <Container
                label={"Date Range"}
                inputs={
                  <div className="flex flex-row space-x-4 items-center">
                    <InputField
                      type="text"
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => (e.target.type = "text")}
                      value={generateData.startDate}
                      placeholder={"start date"}
                      onChange={(e) =>
                        setGenerateData((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                    />
                    <p>to</p>
                    <InputField
                      type="text"
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => (e.target.type = "text")}
                      placeholder={"end date"}
                      value={generateData.endDate}
                      onChange={(e) =>
                        setGenerateData((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                }
              />
              <Container
                label={"Emergency Types"}
                inputs={
                  <SelectStyle
                  value={generateData.emergencyType}
                  onChange={(e) => setGenerateData(prev => ({...prev, emergencyType: e.target.value}))}
                    options={[
                      "medical",
                      "crime",
                      "fire",
                      "Natural Disaster",
                      "Other",
                    ]}
                  />
                }
              />
              <Label label={"Format Options"} isMainLabel={true} />
              <Container
                label={"Format"}
                inputs={
                <SelectStyle 
                value={generateData.format}
                onChange={(e) => setGenerateData(prev => ({...prev, format: e.target.value}))}
                options={["PDF", "Excel"]} 
                />}
              />
            </div>
            <div className="flex-1 basis-1/2 space-y-3">
              <Label label={"Preview Report"} isMainLabel={true} />
              <div className="grid grid-rows-3">
                <div className="border rounded-md p-2 row-span-2">
                  This area is for preview chart
                </div>
                <div className="flex flex-row space-x-4 p-4">
                  <div className="space-x-4">
                    {" "}
                    <input type="radio" />
                    <label>Include Table</label>
                  </div>
                  <div className="space-x-4">
                    {" "}
                    <input type="radio" />
                    <label>Include Chart</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="place-self-end">
          <button
  className="py-2 px-6 font-semibold bg-green-400 text-white rounded shadow-md"
  onClick={() => {
    if (generateData.format === "Excel") {
      handleExport();
    } else {
      generatePDF(filteredData); // Implement this function separately
    }
  }}
>
  Generate Report
</button>

          </div>
        </div>
      }
    />
  );
};

export default Reports;
