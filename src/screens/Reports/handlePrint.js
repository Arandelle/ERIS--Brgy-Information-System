  // Function to handle printing with chart
 export const handlePrint = (generateData) => {
    const printContent = document.getElementById('printableArea');
    const printInsights = document.getElementById('printableInsights');
    const WinPrint = window.open('', '', 'width=900,height=650');
    
    // Get the chart SVG if it exists
    let chartSvg = '';
    const chartContainer = document.querySelector('.recharts-wrapper');
    if (chartContainer && generateData.preview !== 'table') {
      // Clone the SVG to avoid modifying the original
      const svgClone = chartContainer.querySelector('svg').cloneNode(true);
      // Set explicit width and height for the SVG
      svgClone.setAttribute('width', '100%');
      svgClone.setAttribute('height', '0');
      chartSvg = `
        <div style="margin-bottom: 5px;">
          <h2 style="text-align: center; margin-bottom: 5px;">Daily Emergency Count</h2>
          ${svgClone.outerHTML}
        </div>
      `;
    }
    
    WinPrint.document.write(`
      <html>
        <head>
          <title>Emergency Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 10px; }
            h1 { color: #2563eb; text-align: center; margin-bottom: 10px; }
            h2 { color: #4b5563; }
            .report-info { margin-bottom: 10px; display: flex; flex-direction: column }
            .report-info p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 5px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .recharts-wrapper {
    page-break-inside: avoid;
}
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

             ${chartSvg}
          </div>
          
          
          ${generateData.preview !== 'chart' ? `
            <h2>Emergency Data</h2>
            ${printContent.innerHTML}
            ${printInsights.innerHTML}
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