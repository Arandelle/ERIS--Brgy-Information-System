import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { useFetchData } from "../../hooks/useFetchData";

const ExportPDF = () => {
  const { data: responder } = useFetchData("responders");
  const generatePDF = (filteredData, chartRef, dataType) => {
    const emergencySummary = dataType === "Emergency Summary";
    const userGrowth = dataType === "User Growth Analysis";
    const title = emergencySummary
      ? "Emergency Summary"
      : "User Growth Analysis";
    const doc = new jsPDF();
    doc.text(title, 10, 10);

    // Ensure chartRef is not null
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        // Add chart image to PDF
        doc.addImage(imgData, "PNG", 10, 20, 180, 80);

        let finalY = 110; // leave space below the chart

        // create table
        if (filteredData.length > 0) {
          if (emergencySummary) {
            const columns = [
              "ID",
              "Type",
              "Location",
              "Responder",
              "Logs",
              "Date",
            ];
            const rows = filteredData.map((item) => {
              const responderDetails = responder?.find(
                (responder) => responder.id === item?.responderId
              );

              return [
                item.emergencyId,
                item.emergencyType,
                item.location?.geoCodeLocation,
                responderDetails?.fullname || "N/A",
                item.messageLog || "No logs",
                new Date(item.timestamp).toLocaleString(), // Convert timestamp
              ];
            });

            // Add table to PDF
            autoTable(doc, {
              head: [columns],
              body: rows,
              startY: finalY,
            });
          } else if (userGrowth) {
            const columns = [
              "ID",
              "Email",
              "Fullname",
              "Age",
              "Gender",
              "Address",
              "Phone",
            ];
            const rows = filteredData.map((item) => [
              item.customId || "N/A",
              item.email || "N/A",
              item.fullname || "N/A",
              item.age || "N/A",
              item.gender || "N/A",
              item.address || "N/A",
              item.mobileNum || "N/A",
            ]);

            autoTable(doc, {
              head: [columns],
              body: rows,
              startY: 20,
            });
          }
        }
        doc.save("report.pdf");
      });
    } else {
      doc.save("report.pdf"); // Save PDF even if no chart is present
    }
  };

  return { generatePDF };
};

export default ExportPDF;
