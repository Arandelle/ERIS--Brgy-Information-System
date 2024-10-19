import React, { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import icons from "../../../assets/icons/Icons";

const FileHandlerButtons = ({ onClickExport, onClickImport }) => {
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(!open);
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div>
        <Tooltip
          arrow
          title={
            <div className="flex flex-col space-y-2">
              {/* Export button */}
              <Tooltip title="Export to Excel" placement="left" arrow>
                <button
                  className="flex items-center rounded-md bg-green-500 py-2 px-3"
                  onClick={onClickExport}
                >
                  <icons.download style={{ fontSize: "large", color: "white" }} />
                  <span className="text-sm text-gray-200 ml-2">
                    Export Data
                  </span>
                </button>
              </Tooltip>

              {/* Import button */}
              {/* <Tooltip title="Import from excel" placement="left" arrow>
                <label className="cursor-pointer flex items-center justify-center rounded-md bg-primary-500 py-2 px-3">
                  <icons.publish style={{ fontSize: "large", color: "white" }} />
                  <span className="text-sm ml-2 text-gray-200">
                    Import Data
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".xlsx, .xls"
                    onChange={onClickImport}
                  />
                </label>
              </Tooltip> */}
            </div>
          }
          open={open}
          onClose={handleTooltipClose}
          disableFocusListener
          disableHoverListener
          disableTouchListener
        >
          <Tooltip title="File Button" placement="left" arrow>
            <button
              onClick={handleTooltipOpen}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
              >
                <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
              </svg>
            </button>
          </Tooltip>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
};

export default FileHandlerButtons;
