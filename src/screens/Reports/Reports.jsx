import React, { useEffect, useRef, useState } from "react";
import HeaderAndSideBar from "../../components/ReusableComponents/HeaderSidebar";
import SelectStyle from "../../components/ReusableComponents/SelectStyle";
import { InputField } from "../../components/ReusableComponents/InputField";
import { useFetchData } from "../../hooks/useFetchData";
import { exportToExcel } from "./exportToExcel";
import { EmergencyTable, EmergencyChart } from "./PreviewData";
import ReportInsights from "./ReportInsigths";
import { handlePrint } from "./handlePrint";
import UsersInsights from "./UsersInsights";
import ExportPDF from "./ExportPDF";

const Label = ({ label, isMainLabel }) => {
  return isMainLabel ? (
    <p className="font-semibold text-gray-700">{label}</p>
  ) : (
    <p className="text-gray-500 text-base">{label}</p>
  );
};

const Container = ({ label, inputs }) => {
  return (
    <div className="space-y-3">
      <div>
        <Label label={label} />
      </div>
      <div>{inputs}</div>
    </div>
  );
};

const Reports = () => {
  const printRef = useRef();
  const insightRef = useRef();
  const chartRef = useRef();
  const { generatePDF } = ExportPDF();
  const { data: emergencyRequest } = useFetchData("emergencyRequest");
  const { data: users } = useFetchData("users");
  const [filteredData, setFilteredData] = useState([]);
  const [generateData, setGenerateData] = useState({
    reportTypes: "Emergency Summary",
    startDate: null,
    endDate: null,
    emergencyType: "All",
    format: "PDF",
    preview: "both",
  });

  // Function to format data for export
  const handleExport = () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No emergency request data available.");
      return;
    };

    let formattedData = {};
    if(generateData.reportTypes === "Emergency Summary"){
        formattedData = filteredData.map((request) => ({
        ID: request.emergencyId || "N/A",
        Type: request.emergencyType || "N/A",
        Status: request.status || "N/A",
        Log: request.messageLog || "N/A",
        Location: request.location?.geoCodeLocation || "N/A",
        Date: new Date(request.timestamp).toLocaleString() || "N/A",
      }));
    } else {
       formattedData = filteredData.map((user) => ({
        ID: user.customId || "N/A",
        Email: user.email || "N/A",
        Fullname: user.fullname || "N/A",
        Age: user.age || "N/A",
        Gender: user.gender || "N/A",
        Address: user.address || "N/A",
        Phone: user.mobileNum || "N/A"
       }))
    }

    console.log("Exporting Data:", formattedData);
    exportToExcel(formattedData, "emergency_summary.xlsx");
  };

  // filter the main data into the current year
  useEffect(() => {
    if (!emergencyRequest || emergencyRequest.length === 0) return;
    const currentYear = new Date().getFullYear();

    const thisYearData = emergencyRequest.filter(
      (item) => new Date(item.timestamp).getFullYear() === currentYear
    );

    const minTimestamp = new Date(currentYear, 0, 1, 0, 0, 0, 0);
    const maxTimestamp = new Date(
      Math.max(...thisYearData.map((item) => item.timestamp))
    );

    setGenerateData((prev) => ({
      ...prev,
      startDate: prev.startDate ?? minTimestamp,
      endDate: prev.endDate ?? maxTimestamp,
    }));
  }, [emergencyRequest]);

  // update the filtered data
  useEffect(() => {
    if (!emergencyRequest || emergencyRequest.length === 0) return;
    const { reportTypes } = generateData;
    const emergencySummary = reportTypes === "Emergency Summary";
    const userGrowthAnalysis = reportTypes === "User Growth Analysis";

    let filtered = [];

    if (emergencySummary) {
      filtered = emergencyRequest.filter((item) => {
        const requestDate = new Date(item.timestamp);
        const type = (item.emergencyType || "").toLowerCase();
        const start = generateData.startDate
          ? new Date(generateData.startDate)
          : null;
        const end = generateData.endDate
          ? new Date(generateData.endDate)
          : null;
        const emergencyType = generateData.emergencyType.toLowerCase();

        return (
          (!start || requestDate >= start) &&
          (!end || requestDate <= end) &&
          (emergencyType === "all" || !emergencyType || type === emergencyType)
        );
      });
    } else if (userGrowthAnalysis) {
      filtered = users.filter((item) => {
        const date = new Date(item.timestamp);
        const start = generateData.startDate
          ? new Date(generateData.startDate)
          : null;
        const end = generateData.endDate
          ? new Date(generateData.endDate)
          : null;

        return (!start || date >= start) && (!end || date <= end);
      });
    }
    setFilteredData(filtered);
  }, [generateData, emergencyRequest, users]);

  // Toggle for preview options
  const handlePreviewToggle = (type) => {
    const currentPreview = generateData.preview;

    if (type === "table") {
      if (currentPreview === "table") return; // Already table only
      if (currentPreview === "both")
        setGenerateData((prev) => ({ ...prev, preview: "chart" }));
      else setGenerateData((prev) => ({ ...prev, preview: "both" }));
    } else if (type === "chart") {
      if (currentPreview === "chart") return; // Already chart only
      if (currentPreview === "both")
        setGenerateData((prev) => ({ ...prev, preview: "table" }));
      else setGenerateData((prev) => ({ ...prev, preview: "both" }));
    }
  };

  return (
    <HeaderAndSideBar
      content={
        <div className="bg-white p-6 rounded-lg shadow-lg h-full">
          <h1 className="text-2xl font-bold text-blue-800 mb-6">
            Generate Reports
          </h1>
          <div className="flex flex-col lg:flex-row space-x-0 md:space-x-5 space-y-5 md:space-y-0">
            <div className="space-y-4 flex-1 basis-2/5">
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
                    options={["Emergency Summary", "User Growth Analysis"]}
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
              {generateData.reportTypes === "Emergency Summary" && (
                <Container
                  label={"Emergency Types"}
                  inputs={
                    <SelectStyle
                      value={generateData.emergencyType}
                      onChange={(e) =>
                        setGenerateData((prev) => ({
                          ...prev,
                          emergencyType: e.target.value,
                        }))
                      }
                      options={[
                        "All",
                        "Medical",
                        "Crime",
                        "Fire",
                        "Natural Disaster",
                        "Public Disturbance",
                        "Other",
                      ]}
                    />
                  }
                />
              )}

              <Container
                label={<Label label="Insights" isMainLabel={true}/>}
                inputs={
                  <div id="printableInsights" ref={insightRef}>
                    {generateData.reportTypes === "Emergency Summary" ? (
                      <ReportInsights
                        filteredData={filteredData}
                        generateData={generateData}
                      />
                    ) : (
                      <UsersInsights
                        filteredData={filteredData}
                        generateData={generateData}
                      />
                    )}
                  </div>
                }
              />
            </div>
            <div className="flex-1 basis-3/5 space-y-3">
              <Label label={"Preview Report"} isMainLabel={true} />
              <div className="flex flex-col">
                <div className="border rounded-md p-2 row-span-2 overflow-auto">
                  {/* Preview area */}
                  {filteredData.length > 0 ? (
                    <div className="space-y-4">
                      {/* Show chart if preview includes chart */}
                      {(generateData.preview === "chart" ||
                        generateData.preview === "both") && (
                        <div ref={chartRef} className="mb-4">
                          <EmergencyChart
                            data={filteredData}
                            dataType={generateData.reportTypes}
                          />
                        </div>
                      )}

                      {/* Show table if preview includes table */}
                      {(generateData.preview === "table" ||
                        generateData.preview === "both") && (
                        <div className=" max-w-lg">
                          <EmergencyTable
                            data={filteredData.slice(0, 5)}
                            dataType={generateData.reportTypes}
                          />
                          {filteredData.length > 5 && (
                            <div className="text-center text-gray-500">
                              {filteredData.length - 5} more records not shown
                              in preview
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No data to preview. Adjust filters to see data.
                    </div>
                  )}
                </div>
                <div className="flex flex-row space-x-4 p-4">
                  <div className="space-x-2">
                    <input
                      type="checkbox"
                      id="includeTable"
                      checked={
                        generateData.preview === "table" ||
                        generateData.preview === "both"
                      }
                      onChange={() => handlePreviewToggle("table")}
                      disabled={generateData.format === "Excel"}
                    />
                    <label htmlFor="includeTable">Include Table</label>
                  </div>
                  <div className="space-x-2">
                    <input
                      type="checkbox"
                      id="includeChart"
                      checked={
                        generateData.preview === "chart" ||
                        generateData.preview === "both"
                      }
                      onChange={() => handlePreviewToggle("chart")}
                      disabled={generateData.format === "Excel"}
                    />
                    <label htmlFor="includeChart">Include Chart</label>
                  </div>
                  {generateData.format === "Excel" && (
                    <span className="text-gray-500 text-sm ml-2">
                      Chart not available in Excel format
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Hidden printable area - this will only be used when printing */}
          <div id="printableArea" style={{ display: "none" }} ref={printRef}>
            <EmergencyTable
              data={filteredData}
              dataType={generateData.reportTypes}
            />
          </div>

          <div className="mt-6 flex flex-row  place-self-end space-x-4">
           <div>
              <SelectStyle
                value={generateData.format}
                onChange={(e) =>
                  setGenerateData((prev) => ({
                    ...prev,
                    format: e.target.value,
                  }))
                }
                options={["PDF", "Excel"]}
              />
           </div>

            <button
              className="py-2 px-6 font-semibold bg-green-400 text-white rounded shadow-md hover:bg-green-500 transition-colors"
              onClick={() => {
                if (generateData.format === "Excel") {
                  handleExport();
                } else {
                  generatePDF(
                    filteredData,
                    chartRef,
                    insightRef,
                    generateData.reportTypes
                  );
                }
              }}
            >
              {`Save as ${generateData.format}`}
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-600 py-2 px-6 rounded text-white font-semibold text-base"
              onClick={() => handlePrint(generateData)}
            >
              Print
            </button>
          </div>
        </div>
      }
    />
  );
};

export default Reports;
