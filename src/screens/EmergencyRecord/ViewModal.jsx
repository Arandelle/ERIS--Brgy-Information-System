import React from "react";
import { formatDateWithTime } from "../../helper/FormatDate";
import Modal from "../../components/ReusableComponents/Modal";

const ViewModal = ({ isView, setIsView, setSearchParams, recordDetails }) => {

    const displayValue = (value, isAnonymized = false) => {
      return value && !isAnonymized
        ? value
        : isAnonymized
        ? "Anonymized"
        : "----";
    };

  const RenderDetails = ({ data }) => {
    const filteredData = data.filter(
      ({ value }) => value != null && value !== ""
    );
    if (filteredData.length === 0) return null;

    return (
      <div
        className={`bg-gray-100 dark:bg-gray-800 p-2 text-sm text-gray-500 dark:text-gray-300 border-l-2 border-l-gray-500 dark:border-gray-300 rounded-r-md space-y-1`}
      >
        {filteredData.map(({ label, value }, index) => (
          <div key={index} className="flex flex-row">
            <p className="w-1/2">{label}</p>
            <p className="flex-1 font-bold">{value}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Modal
      closeButton={() => {
        setIsView(!isView), setSearchParams({});
      }}
      title={"Emergency Details"}
      children={
        <div className="w-full space-y-4">
          <RenderDetails
            data={[
              {
                label: "Emergency ID",
                value: recordDetails?.emergencyId || "--",
              },
              {
                label: "User ID: ",
                value: recordDetails?.userID || "--",
              },
              {
                label: "Responder ID: ",
                value: recordDetails?.responderID || "--",
              },
              {
                label: "Emergency Type ",
                value: recordDetails?.emergencyType.toUpperCase() || "--",
              },
            ]}
          />
          <RenderDetails
            data={[
              {
                label: "Sender Name: ",
                value: displayValue(recordDetails?.userName, recordDetails?.isUserAnonymized) || "--",
              },
              {
                label: "Responder Name: ",
                value: displayValue(recordDetails?.responderName, recordDetails?.isResponderAnonymized),
              },
              {
                label: "Sender Location",
                value:
                  displayValue(
                  recordDetails?.senderLocation ||
                  recordDetails?.location?.geoCodeLocation ||
                  "--", recordDetails?.isUserAnonymized),
              },
            ]}
          />
          <RenderDetails
            data={[
              {
                label: "Response Time: ",
                value: recordDetails?.responseTime
                  ? formatDateWithTime(recordDetails.responseTime)
                  : "--",
              },
              {
                label: "Resolved Time: ",
                value: recordDetails?.dateResolved
                  ? formatDateWithTime(recordDetails.dateResolved)
                  : "--",
              },
            ]}
          />
          <RenderDetails
            data={[
              {
                label: "Emergency Location: ",
                value: displayValue(recordDetails?.location?.geoCodeLocation || "--", recordDetails?.isUserAnonymized),
              },
              {
                label: "Latitude: ",
                value: displayValue(recordDetails?.location?.latitude || "--", recordDetails?.isUserAnonymized)
              },
              {
                label: "Longitude",
                value: displayValue(recordDetails?.location?.longitude || "--", recordDetails?.isUserAnonymized)
              },
            ]}
          />
          <RenderDetails
            data={[
              {
                label: "Description",
                value: displayValue(recordDetails?.description || "--", recordDetails?.isUserAnonymized)
              },
              {
                label: "Response Message",
                value:
                  displayValue(recordDetails?.messageLog ||
                  recordDetails?.reportReason ||
                  "--", recordDetails?.isResponderAnonymized)
              },
            ]}
          />
        </div>
      }
    />
  );
};

export default ViewModal;
