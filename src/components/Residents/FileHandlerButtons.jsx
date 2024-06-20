import React, { useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import PublishIcon from "@mui/icons-material/Publish";
import CloseIcon from "@mui/icons-material/Close";
import ListIcon from "@mui/icons-material/List";
import Tooltip from "@mui/material/Tooltip"; // This is build in toolTip

const FileHandlerButtons = ({ onClickExport, onClickImport }) => {
  const [isFileButtonsOpen, setIsFileButtonsOpen] = useState(false);
  const toggleFileHandler = () => {
    setIsFileButtonsOpen(!isFileButtonsOpen);
  };

  return (
    <div className="relative flex flex-row space-x-1">

      {/* This button toggles the export and import buttons */}
      <Tooltip title="Show File Actions" arrow>
        <button onClick={toggleFileHandler}>
          <ListIcon />
        </button>
      </Tooltip>

      {/* File handler modal */}
      {isFileButtonsOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* This area when clicked,the modal will close */}
          <div 
            className="bg-gray-500 bg-opacity-75 w-full h-full absolute" 
            onClick={toggleFileHandler}
          ></div>

          <div className="relative z-50 p-10 bg-white rounded-md shadow-lg max-w-sm mx-auto">
            <Tooltip title="Close" placement="top" arrow>
              <button
                className="absolute top-2 right-2"
                onClick={toggleFileHandler}
              >
                <CloseIcon style={{ color: "gray" }} />
              </button>
            </Tooltip>
            <div className="flex flex-col space-y-2">
              
              {/* Export button */}
              <Tooltip title="Export to Excel" placement="left" arrow>
                <button
                  className="flex items-center justify-center rounded-3xl bg-green-500 py-2 px-3"
                  onClick={onClickExport}
                >
                  <DownloadIcon style={{ fontSize: "large", color: "white" }} />
                  <span className="text-sm text-gray-200">Export</span>
                </button>
              </Tooltip>

              {/* Import button */}
              <Tooltip title="Import from excel" placement="left" arrow>
                <label className="cursor-pointer flex items-center justify-center rounded-3xl bg-green-500 py-2 px-3">
                  <PublishIcon style={{ fontSize: "large", color: "white" }} />
                  <span className="text-sm text-gray-200">Import</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".xlsx, .xls"
                    onChange={onClickImport}
                  />
                </label>
              </Tooltip>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileHandlerButtons;
