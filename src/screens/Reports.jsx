import React, { useEffect, useRef, useState } from "react";
import HeaderAndSideBar from "../components/ReusableComponents/HeaderSidebar";
import SelectStyle from "../components/ReusableComponents/SelectStyle";
import { InputField } from "../components/ReusableComponents/InputField";
import { useFetchData } from "../hooks/useFetchData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
    <div className="space-y-3">
      <div>
        <Label label={label} />
      </div>
      <div>{inputs}</div>
    </div>
  );
};

// Table component for displaying filtered data
const EmergencyTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-4">No data available</div>;
  }

  return (
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4 border-b text-left">ID</th>
          <th className="py-2 px-4 border-b text-left">Type</th>
          <th className="py-2 px-4 border-b text-left">Status</th>
          <th className="py-2 px-4 border-b text-left">Location</th>
          <th className="py-2 px-4 border-b text-left">Date</th>
        </tr>
      </thead>
      <tbody>
        {data.map((request, index) => (
          <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
            <td className="py-2 px-4 border-b">{request.emergencyId || "N/A"}</td>
            <td className="py-2 px-4 border-b">{request.emergencyType || "N/A"}</td>
            <td className="py-2 px-4 border-b">{request.status || "N/A"}</td>
            <td className="py-2 px-4 border-b">{request.location?.address || "N/A"}</td>
            <td className="py-2 px-4 border-b">{new Date(request.timestamp).toLocaleString() || "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Chart component for data visualization
const EmergencyChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-4">No data available for chart</div>;
  }

  // Process data for the chart (count by status)
  const processChartData = () => {
    const statusCount = {};
    
    data.forEach(item => {
      const status = item.status || "Unknown";
      if (statusCount[status]) {
        statusCount[status]++;
      } else {
        statusCount[status] = 1;
      }
    });
    
    return Object.keys(statusCount).map(status => ({
      name: status,
      count: statusCount[status]
    }));
  };

  const chartData = processChartData();

  return (
    <div className="w-full" style={{ height: "300px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" name="Number of Emergencies" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const Reports = () => {
  const printRef = useRef();
  const { data: emergencyRequest } = useFetchData("emergencyRequest");
  const [filteredData, setFilteredData] = useState([]);
  const [chartData, setChartData] = useState([]);
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

  // Prepare chart data whenever filtered data changes
  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      // For the chart data, we'll group by status
      const statusCount = {};
      
      filteredData.forEach(item => {
        const status = item.status || "Unknown";
        if (statusCount[status]) {
          statusCount[status]++;
        } else {
          statusCount[status] = 1;
        }
      });
      
      const preparedChartData = Object.keys(statusCount).map(status => ({
        name: status,
        count: statusCount[status]
      }));
      
      setChartData(preparedChartData);
    } else {
      setChartData([]);
    }
  }, [filteredData]);

  useEffect(() => {
    if (!emergencyRequest || emergencyRequest.length === 0) return;
  
    let filtered = emergencyRequest.filter((item) => {
      const requestDate = new Date(item.timestamp);
      const type = (item.emergencyType || "").toLowerCase();
      const start = generateData.startDate ? new Date(generateData.startDate) : null;
      const end = generateData.endDate ? new Date(generateData.endDate) : null;
      const emergencyType = generateData.emergencyType.toLowerCase();
  
      return (!start || requestDate >= start) && 
             (!end || requestDate <= end) && 
             (!emergencyType || type === emergencyType);
    });
  
    setFilteredData(filtered);
  }, [generateData, emergencyRequest]);
  
  // Function to handle printing with chart
  const handlePrint = () => {
    const printContent = document.getElementById('printableArea');
    const WinPrint = window.open('', '', 'width=900,height=650');
    
    // Get the chart SVG if it exists
    let chartSvg = '';
    const chartContainer = document.querySelector('.recharts-wrapper');
    if (chartContainer && generateData.preview !== 'table') {
      // Clone the SVG to avoid modifying the original
      const svgClone = chartContainer.querySelector('svg').cloneNode(true);
      // Set explicit width and height for the SVG
      svgClone.setAttribute('width', '100%');
      svgClone.setAttribute('height', '300px');
      chartSvg = `
        <div style="margin-bottom: 30px;">
          <h2 style="text-align: center; margin-bottom: 15px;">Emergency Status Distribution</h2>
          ${svgClone.outerHTML}
        </div>
      `;
    }
    
    WinPrint.document.write(`
      <html>
        <head>
          <title>Emergency Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2563eb; text-align: center; margin-bottom: 20px; }
            h2 { color: #4b5563; }
            .report-info { margin-bottom: 20px; }
            .report-info p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            @media print {
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <h1>Emergency Summary Report</h1>
          <div class="report-info">
            <p><strong>Report Type:</strong> ${generateData.reportTypes}</p>
            <p><strong>Emergency Type:</strong> ${generateData.emergencyType}</p>
            <p><strong>Date Range:</strong> ${generateData.startDate || 'Not specified'} to ${generateData.endDate || 'Not specified'}</p>
            <p><strong>Generated On:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          ${chartSvg}
          
          ${generateData.preview !== 'chart' ? `
            <h2>Emergency Data</h2>
            ${printContent.innerHTML}
          ` : ''}
        </body>
      </html>
    `);
    
    WinPrint.document.close();
    WinPrint.focus();
    setTimeout(() => {
      WinPrint.print();
      WinPrint.close();
    }, 1000);
  };

  // Toggle for preview options
  const handlePreviewToggle = (type) => {
    const currentPreview = generateData.preview;
    
    if (type === 'table') {
      if (currentPreview === 'table') return; // Already table only
      if (currentPreview === 'both') setGenerateData(prev => ({...prev, preview: 'chart'}));
      else setGenerateData(prev => ({...prev, preview: 'both'}));
    } else if (type === 'chart') {
      if (currentPreview === 'chart') return; // Already chart only
      if (currentPreview === 'both') setGenerateData(prev => ({...prev, preview: 'table'}));
      else setGenerateData(prev => ({...prev, preview: 'both'}));
    }
  };

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
                      "Medical",
                      "Crime",
                      "Fire",
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
                  />
                }
              />
            </div>
            <div className="flex-1 basis-1/2 space-y-3">
              <Label label={"Preview Report"} isMainLabel={true} />
              <div className="">
                <div className="border rounded-md p-2 overflow-auto">
                  {/* Preview area */}
                  {filteredData.length > 0 ? (
                    <div className="space-y-4">
                      {/* Show chart if preview includes chart */}
                      {(generateData.preview === 'chart' || generateData.preview === 'both') && (
                        <div className="mb-4">
                          <EmergencyChart data={filteredData} />
                        </div>
                      )}
                      
                      {/* Show table if preview includes table */}
                      {(generateData.preview === 'table' || generateData.preview === 'both') && (
                        <div className=" overflow-y-auto h-60">
                          <EmergencyTable data={filteredData.slice(0, 5)} />
                          {filteredData.length > 5 && (
                            <div className="text-center text-gray-500 mt-2">
                              {filteredData.length - 5} more records not shown in preview
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
                      checked={generateData.preview === "table" || generateData.preview === "both"} 
                      onChange={() => handlePreviewToggle('table')}
                      disabled={generateData.format === 'Excel'}
                    />
                    <label htmlFor="includeTable">Include Table</label>
                  </div>
                  <div className="space-x-2">
                    <input 
                      type="checkbox" 
                      id="includeChart" 
                      checked={generateData.preview === "chart" || generateData.preview === "both"} 
                      onChange={() => handlePreviewToggle('chart')}
                      disabled={generateData.format === 'Excel'}
                    />
                    <label htmlFor="includeChart">Include Chart</label>
                  </div>
                  {generateData.format === 'Excel' && (
                    <span className="text-gray-500 text-sm ml-2">Chart not available in Excel format</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Hidden printable area - this will only be used when printing */}
          <div id="printableArea" style={{ display: "none" }} ref={printRef}>
            <EmergencyTable data={filteredData} />
          </div>
          
          <div className="mt-6 text-right">
            <button
              className="py-2 px-6 font-semibold bg-green-400 text-white rounded shadow-md hover:bg-green-500 transition-colors"
              onClick={() => {
                if (generateData.format === "Excel") {
                  handleExport();
                } else {
                  handlePrint();
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