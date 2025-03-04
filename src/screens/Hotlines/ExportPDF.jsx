import { useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", value: 30 },
  { name: "Feb", value: 50 },
  { name: "Mar", value: 20 },
];

const ExportPDF = () => {
  const chartRef = useRef();

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Report", 10, 10);

    // Define table columns and rows
    const columns = ["ID", "Name", "Age"];
    const rows = [
      [1, "John Doe", 25],
      [2, "Jane Smith", 30],
      [3, "Michael Brown", 28],
    ];

    // Add table to PDF
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 20,
    });

    // Ensure chartRef is not null
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        
        // Get last table position
        const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 30;

        // Add chart image to PDF
        doc.addImage(imgData, "PNG", 10, finalY, 180, 80);
        doc.save("report.pdf");
      });
    }
  };

  return (
    <div>
      {/* Chart Container */}
      <div ref={chartRef} style={{ width: "100%", height: 300, backgroundColor: "white", padding: 20 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Export PDF Button */}
      <button onClick={generatePDF} style={{ marginTop: 20 }}>Download PDF</button>
    </div>
  );
};

export default ExportPDF;
