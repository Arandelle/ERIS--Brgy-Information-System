import React, { useState, useRef, useEffect } from "react";
import DownloadIcon from "@mui/icons-material/Download";

const ExportButton = ({onClick}) => {
    const [isOpenPop, setIsOpenPop] = useState(false);
  const buttonRef = useRef(null);
  const tooltipRef = useRef(null);


  useEffect(() => {
    if (isOpenPop) {
      const button = buttonRef.current;
      const tooltip = tooltipRef.current;

      // Get dimensions of the button and tooltip
      const buttonRect = button.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      // Calculate initial top and left positions
      let tooltipTop = buttonRect.top - tooltipRect.height - 8; // 8px above the button
      let tooltipLeft = buttonRect.left + (buttonRect.width / 2) - (tooltipRect.width / 2); // Centered horizontally

      // Adjust tooltip position to fit within viewport horizontally
      if (tooltipLeft < 0) {
        tooltipLeft = 10; // Minimum distance from left edge
      } else if (tooltipLeft + tooltipRect.width > window.innerWidth) {
        tooltipLeft = window.innerWidth - tooltipRect.width - 10; // 10px from right edge
      }

      // Set the top and left style properties of the tooltip
      tooltip.style.top = `${tooltipTop}px`;
      tooltip.style.left = `${tooltipLeft}px`;
    }
  }, [isOpenPop]);

  return (
    <div>
      <button
       ref={buttonRef}
        onMouseEnter={() => setIsOpenPop(true)}
        onMouseLeave={() => setIsOpenPop(false)}
        className="flex items-center justify-center rounded-3xl bg-green-400 w-11 py-1 px-2 "
        onClick={onClick}
      >
        <DownloadIcon style={{ fontSize: "large", color: "white" }} />
      </button>
      <div
            id="popover-default"
            role="tooltip"
            ref={tooltipRef}
            className={`absolute z-50 inline-block w-54 text-nowrap text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 ${isOpenPop ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
            style={{ position: 'fixed' }}
          >
            <div className="px-3 py-2">
              <p>Export as Excel</p>
            </div>
          </div>
    </div>
  )
}

export default ExportButton
