import React, { useState, useRef, useEffect } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import PublishIcon from "@mui/icons-material/Publish";

const FileHandlerButtons = ({ onClickExport, onClickImport }) => {
  const [isOpenExportTooltip, setIsOpenExportTooltip] = useState(false);
  const [isOpenImportTooltip, setIsOpenImportTooltip] = useState(false);
  const exportButtonRef = useRef(null);
  const importLabelRef = useRef(null);
  const exportTooltipRef = useRef(null);
  const importTooltipRef = useRef(null);

  useEffect(() => {
    if (isOpenExportTooltip) {
      positionTooltip(exportButtonRef.current, exportTooltipRef.current);
    }
    if (isOpenImportTooltip) {
      positionTooltip(importLabelRef.current, importTooltipRef.current);
    }
  }, [isOpenExportTooltip, isOpenImportTooltip]);

  const positionTooltip = (triggerElement, tooltipElement) => {
    const triggerRect = triggerElement.getBoundingClientRect();
    const tooltipRect = tooltipElement.getBoundingClientRect();

    let tooltipTop = triggerRect.top - tooltipRect.height - 8; // 8px above the trigger element
    let tooltipLeft =
      triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2; // Centered horizontally

    // Adjust tooltip position to fit within viewport horizontally
    if (tooltipLeft < 0) {
      tooltipLeft = 10; // Minimum distance from left edge
    } else if (tooltipLeft + tooltipRect.width > window.innerWidth) {
      tooltipLeft = window.innerWidth - tooltipRect.width - 10; // 10px from right edge
    }

    tooltipElement.style.top = `${tooltipTop}px`;
    tooltipElement.style.left = `${tooltipLeft}px`;
  };

  return (
    <div className="flex flex-row space-x-1 relative">
      {/* Export button */}
      <button
        ref={exportButtonRef}
        onMouseEnter={() => setIsOpenExportTooltip(true)}
        onMouseLeave={() => setIsOpenExportTooltip(false)}
        className="flex items-center justify-center rounded-3xl bg-green-400 w-11 py-1 px-2"
        onClick={onClickExport}
      >
        <DownloadIcon style={{ fontSize: "large", color: "white" }} />
      </button>

      {/* Export tooltip */}
      <div
        ref={exportTooltipRef}
        className={`absolute z-50 inline-block w-36 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 ${
          isOpenExportTooltip ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{ top: "-9999px", left: "-9999px", position: "fixed" }}
      >
        <div className="px-3 py-2">
          <p>Export as Excel</p>
        </div>
      </div>

      {/* Import button */}
      <label
        ref={importLabelRef}
        onMouseEnter={() => setIsOpenImportTooltip(true)}
        onMouseLeave={() => setIsOpenImportTooltip(false)}
        className="cursor-pointer flex items-center justify-center rounded-3xl bg-primary-400 w-11 py-1 px-2"
      >
        <PublishIcon style={{ fontSize: "large", color: "white" }} />
        <input
          type="file"
          className="hidden"
          accept=".xlsx, .xls"
          onChange={onClickImport}
        />
      </label>

      {/* Import tooltip */}
      <div
        ref={importTooltipRef}
        className={`absolute z-50 inline-block w-36 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 ${
          isOpenImportTooltip ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{ top: "-9999px", left: "-9999px", position: "fixed" }}
      >
        <div className="px-3 py-2">
          <p>Import Excel</p>
        </div>
      </div>
    </div>
  );
};

export default FileHandlerButtons;
