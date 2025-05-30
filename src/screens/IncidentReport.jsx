import React, { useState, useMemo } from "react";
import HeaderAndSideBar from "../components/ReusableComponents/HeaderSidebar";
import Toolbar from "../components/ToolBar";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import useFilteredData from "../hooks/useFilteredData";
import { useFetchData } from "../hooks/useFetchData";
import { formatDate } from "../helper/FormatDate";
import IconButton from "../components/ReusableComponents/IconButton";
import icons from "../assets/icons/Icons";
import { ref, update } from "firebase/database";
import { database } from "../services/firebaseConfig";
import { toast } from "sonner";

const IncidentReport = () => {
  const { data: reportedData = [] } = useFetchData("reportedData");
  const { data: user = [] } = useFetchData("users");
  const { data: responder = [] } = useFetchData("responders");
  const { data: emergency = [] } = useFetchData("emergencyRequest");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionMsg, setActionMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Character limit for action message
  const ACTION_MSG_LIMIT = 500;

  // Enhance reported data with names for searching
  const enrichedData = useMemo(() => {
    return reportedData.map((report) => {
      const userDetails = user.find((u) => u.id === report.userId);
      const responderDetails = responder.find(
        (r) => r.id === report.responderId
      );
      const emergencyDetails = emergency.find(
        (e) => e.id === report.emergencyId
      );
      return {
        ...report,
        userFullname: userDetails?.fullname || "Unknown Reporter",
        responderFullname: responderDetails?.fullname || "Unknown Reported",
        customERID: emergencyDetails?.emergencyId,
      };
    });
  }, [reportedData, user, responder]);

  const headerData = [
    "Reporter",
    "Reported",
    "Reason",
    "Date",
    "Current Action",
    "Actions",
  ];

  const searchField = [
    "timestamp",
    "reason",
    "action",
    "userFullname",
    "responderFullname",
    "emergencyId",
  ];

  const filteredData = useFilteredData(enrichedData, searchQuery, searchField);
  const {
    currentPage,
    setCurrentPage,
    indexOfLastItem,
    indexOfFirstItem,
    currentItems,
    totalPages,
  } = usePagination(filteredData);

  const TableData = ({ data, className = "" }) => {
    return (
      <td
        className={`px-6 py-4 max-w-32 whitespace-nowrap overflow-hidden text-ellipsis ${className}`}
      >
        {data || "N/A"}
      </td>
    );
  };

  const handleViewClick = (report) => {
    setSelectedReport(report);
    setShowViewModal(true);
  };

  const handleActionClick = (report) => {
    setSelectedReport(report);
    setActionMsg(report.action || "");
    setShowActionModal(true);
  };

  const handleActionMsgChange = (e) => {
    const value = e.target.value;
    if (value.length <= ACTION_MSG_LIMIT) {
      setActionMsg(value);
    }
  };

  const handleSubmitAction = async () => {
    if (!selectedReport || !actionMsg.trim()) {
      toast.error("Please enter an action message");
      return;
    }

    if (actionMsg.trim().length < 10) {
      toast.error("Action message must be at least 10 characters long");
      return;
    }

    setIsSubmitting(true);
    try {
      const reportRef = ref(database, `reportedData/${selectedReport.id}`);
      await update(reportRef, {
        action: actionMsg.trim(),
        status: "resolved",
        actionDate: new Date().toISOString(),
      });

      toast.success("Action submitted successfully!");
      setShowActionModal(false);
      setActionMsg("");
      setSelectedReport(null);
    } catch (error) {
      console.error("Error submitting action:", error);
      toast.error("Failed to submit action. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedReport(null);
  };

  const closeActionModal = () => {
    setShowActionModal(false);
    setActionMsg("");
    setSelectedReport(null);
  };

  const isReportResolved = (report) => {
    return report.status === "resolved" || report.status === "done";
  };

  const getStatusBadge = (report) => {
    const resolved = isReportResolved(report);
    return (
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          resolved
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {resolved ? "Resolved" : "Pending"}
      </span>
    );
  };

  const renderRow = (report) => {
    const resolved = isReportResolved(report);

    return (
      <>
        <TableData data={report.userFullname} />
        <TableData data={report.responderFullname} />
        <TableData data={report.reason} />
        <TableData data={formatDate(report.timestamp)} />
        <TableData
          data={
            <div className="flex flex-col space-y-1">
              <span>{report.action || "No action yet"}</span>
              {getStatusBadge(report)}
            </div>
          }
        />
        <td>
          <div className="flex px-2 space-x-2 flex-row items-center justify-center">
            <IconButton
              icon={icons.view}
              color={"blue"}
              tooltip={"View Details"}
              fontSize={"small"}
              onClick={() => handleViewClick(report)}
            />
            <IconButton
              icon={icons.message}
              color={resolved ? "gray" : "green"}
              onClick={() => !resolved && handleActionClick(report)}
              tooltip={resolved ? "Already resolved" : "Take Action"}
              fontSize={"small"}
              disabled={resolved}
              className={resolved ? "opacity-50 cursor-not-allowed" : ""}
            />
          </div>
        </td>
      </>
    );
  };

  return (
    <HeaderAndSideBar
      content={
        <>
          <Toolbar
            label="Incident Report"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <Table
            headers={headerData}
            data={currentItems}
            renderRow={renderRow}
            emptyMessage="No incident reports yet"
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            data={filteredData}
          />

          {/* View Details Modal */}
          {showViewModal && selectedReport && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Incident Report Details <span className="text-lg ml-5">{selectedReport.incidentID}</span>
                    </h2>
                    <button
                      onClick={closeViewModal}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <label className="text-sm font-semibold text-gray-600">
                          Reporter
                        </label>
                        <p className="text-gray-800">
                          {selectedReport.userFullname}
                        </p>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <label className="text-sm font-semibold text-gray-600">
                          Reported Person
                        </label>
                        <p className="text-gray-800">
                          {selectedReport.responderFullname}
                        </p>
                      </div>
                    {selectedReport.customERID && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                        <label className="text-sm font-semibold text-gray-600">
                          Emergency ID
                        </label>
                        <p className="text-gray-800">{selectedReport.customERID}</p>
                      </div>
                    )}
                    
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <label className="text-sm font-semibold text-gray-600">
                          Reason
                        </label>
                        <p className="text-red-800">{selectedReport.reason}</p>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <label className="text-sm font-semibold text-gray-600">
                          Date Reported
                        </label>
                        <p className="text-gray-800">
                          {formatDate(selectedReport.timestamp)}
                        </p>
                      </div>
                      {selectedReport.actionDate && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <label className="text-sm font-semibold text-gray-600">
                            Action Date
                          </label>
                          <p className="text-gray-800">
                            {formatDate(selectedReport.actionDate)}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {selectedReport.action && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <label className="text-sm font-semibold text-blue-600">
                            Action Taken
                          </label>
                          <p className="text-blue-800">
                            {selectedReport.action}
                          </p>
                        </div>
                      )}

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <label className="text-sm font-semibold text-gray-600">
                          Status
                        </label>
                        <div className="mt-1">
                          {getStatusBadge(selectedReport)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={closeViewModal}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Close
                    </button>
                    {!isReportResolved(selectedReport) && (
                      <button
                        onClick={() => {
                          closeViewModal();
                          handleActionClick(selectedReport);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Take Action
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Take Action Modal */}
          {showActionModal && selectedReport && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Take Action
                    </h2>
                    <button
                      onClick={closeActionModal}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Reporter:</strong> {selectedReport.userFullname}
                      </p>
                      <p>
                        <strong>Reported:</strong>{" "}
                        {selectedReport.responderFullname}
                      </p>
                      <p>
                        <strong>Reason:</strong> {selectedReport.reason}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Action to be taken:{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={actionMsg}
                      onChange={handleActionMsgChange}
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows="4"
                      placeholder="Describe the action you are taking to resolve this incident..."
                      disabled={isSubmitting}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500">
                        Be specific about the resolution steps taken. (Min: 10
                        characters)
                      </p>
                      <p
                        className={`text-xs ${
                          actionMsg.length > ACTION_MSG_LIMIT * 0.9
                            ? "text-red-500"
                            : actionMsg.length > ACTION_MSG_LIMIT * 0.7
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                      >
                        {actionMsg.length}/{ACTION_MSG_LIMIT}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={closeActionModal}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitAction}
                      disabled={
                        isSubmitting ||
                        !actionMsg.trim() ||
                        actionMsg.trim().length < 10
                      }
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Action"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      }
    />
  );
};

export default IncidentReport;
