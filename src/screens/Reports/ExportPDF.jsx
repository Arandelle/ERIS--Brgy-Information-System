import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { useFetchData } from "../../hooks/useFetchData";

const ExportPDF = () => {
  const { data: responder } = useFetchData("responders");

  const generatePDF = (filteredData, chartRef, insightsRef, dataType) => {
    const emergencySummary = dataType === "Emergency Summary";
    const title = emergencySummary ? "Emergency Summary" : "User Growth Analysis";

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(title, 10, 10);
    let finalY = 20; // Starting Y position

    // Capture chart as an image (if available)
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const chartImg = canvas.toDataURL("image/png");
        doc.addImage(chartImg, "PNG", 10, finalY, 180, 80);
        finalY += 90; // Adjust Y position after chart

        // Add table after the chart
        addTable(doc, filteredData, emergencySummary, finalY, insightsRef);
      });
    } else {
      addTable(doc, filteredData, emergencySummary, finalY, insightsRef);
    }
  };

  // Function to add table
  const addTable = (doc, filteredData, emergencySummary, startY, insightsRef) => {
    if (filteredData.length > 0) {
      const columns = emergencySummary
        ? ["ID", "Type", "Location", "Responder", "Logs", "Date"]
        : ["ID", "Email", "Fullname", "Age", "Gender", "Address", "Phone"];

      const rows = filteredData.map((item) => {
        if (emergencySummary) {
          const responderDetails = responder?.find(
            (responder) => responder.id === item?.responderId
          );
          return [
            item.emergencyId,
            item.emergencyType,
            item.location?.geoCodeLocation,
            responderDetails?.fullname || "N/A",
            item.messageLog || "No logs",
            new Date(item.timestamp).toLocaleString(),
          ];
        } else {
          return [
            item.customId || "N/A",
            item.email || "N/A",
            item.fullname || "N/A",
            item.age || "N/A",
            item.gender || "N/A",
            item.address || "N/A",
            item.mobileNum || "N/A",
          ];
        }
      });

      autoTable(doc, {
        head: [columns],
        body: rows,
        startY,
      });

      let finalY = doc.lastAutoTable.finalY + 10; // Position insights below the table

      // Add insights at the bottom
      if (insightsRef.current) {
        const insightsText = insightsRef.current.innerText.trim();
        if (insightsText) {
          doc.setFontSize(10); // Make text smaller
          const splitText = doc.splitTextToSize(insightsText, 180);
          doc.text(splitText, 10, finalY);
        }
      }
    }

    doc.save("report.pdf");
  };

  return { generatePDF };
};

export default ExportPDF;
