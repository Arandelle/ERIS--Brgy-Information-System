import React from "react";
import DownloadIcon from "@mui/icons-material/Download";
import PublishIcon from "@mui/icons-material/Publish";
import ListIcon from "@mui/icons-material/List";
import Tooltip from "@mui/material/Tooltip"; // This is build in toolTip

const FileHandlerButtons = ({ onClickExport, onClickImport }) => {
  return (
    <>
      {/* This button toggles the export and import buttons */}
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
                <DownloadIcon style={{ fontSize: "large", color: "white" }} />
                <span className="text-sm text-gray-200 ml-2">Export Data</span>
              </button>
            </Tooltip>

            {/* Import button */}
            <Tooltip title="Import from excel" placement="left" arrow>
              <label className="cursor-pointer flex items-center justify-center rounded-md bg-primary-500 py-2 px-3">
                <PublishIcon style={{ fontSize: "large", color: "white" }} />
                <span className="text-sm ml-2 text-gray-200">Import Data</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx, .xls"
                  onChange={onClickImport}
                />
              </label>
            </Tooltip>
          </div>
        }
      >
        <ListIcon />
      </Tooltip>
    </>
  );
};

export default FileHandlerButtons;
