import React, { useState } from "react";
import Modal from "../../components/ReusableComponents/Modal";
import { InputField } from "../../components/ReusableComponents/InputField";
import SelectStyle, {
  SelectStyleInObject,
} from "../../components/ReusableComponents/SelectStyle";
import EmergencyMap from "./EmergencyMap";
import { toast } from "sonner";
import handleAddData from "../../hooks/handleAddData";
import logAuditTrail from "../../hooks/useAuditTrail";
import { generateUniqueBarangayID } from "../../helper/generateID";
import { useFetchData } from "../../hooks/useFetchData";

export const InputStyle = ({
  label,
  placeholder,
  type,
  value,
  onChange,
  isInput = true,
  options,
  disabledOption,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-gray-600 text-sm">{label}</label>
      {isInput ? (
        <InputField
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      ) : (
        <SelectStyle
          value={value}
          onChange={onChange}
          options={options}
          disabledOption={disabledOption}
        />
      )}
    </div>
  );
};

const AddRecordModal = ({ setAddRecordModal }) => {
  const [emergencyData, setEmergencyData] = useState({emergencyType: "medical"});
  const [openMap, setOpenMap] = useState(false);
  const { data: responder } = useFetchData("responders");

  const saveEmergencyData = async () => {
    try {
    const {dateResolved, responseTime, date, responderId, location } = emergencyData;
    if(!dateResolved || !responseTime || !date || !responderId || !location) {
        toast.error("Please provide the neccessary details");
        return;
    }
      const customId = await generateUniqueBarangayID("emergency");
      const newData = {
        ...emergencyData,
        status: "resolved",
        emergencyId: customId,
        timestamp: new Date(emergencyData.date).getTime(),
      };
      const emergencyUid = await handleAddData(newData, "emergencyRequest");
      await logAuditTrail("Add emergency record", emergencyUid);
      setAddRecordModal(false);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <Modal
        closeButton={() => setAddRecordModal(false)}
        title={"Add Record"}
        children={
          <div className="w-full space-y-4 max-w-2xl">
            <p className="text-sm text-gray-600 dark:text-gray-300 italic text-justify">
              Add the manual emergency record to document incidents accurately.
              Ensure all necessary details, including location and emergency
              type, are correctly entered for proper response tracking.
            </p>
            <div className="flex flex-row space-x-4">
              <div className="flex flex-col space-y-4 flex-1">
                <InputStyle
                  label={"Residents name"}
                  placeholder={"Write the residents name"}
                  value={emergencyData.fullname}
                  onChange={(e) =>
                    setEmergencyData({
                      ...emergencyData,
                      fullname: e.target.value,
                    })
                  }
                />
                <InputStyle
                  label={"Emergency Type"}
                  value={emergencyData.emergencyType}
                  isInput={false}
                  onChange={(e) =>
                    setEmergencyData({
                      ...emergencyData,
                      emergencyType: e.target.value,
                    })
                  }
                  options={[
                    "medical",
                    "fire",
                    "crime",
                    "natural disaster",
                    "public disturbance",
                    "other",
                  ]}
                  disabledOption="Emergency Type"
                />
                <div className="space-y-2">
                <label className="text-gray-600 text-sm">Responder</label>
                    <SelectStyleInObject
                      label={"Responder"}
                      value={emergencyData.responderId}
                      onChange={(e) =>
                        setEmergencyData({
                          ...emergencyData,
                          responderId: e.target.value,
                        })
                      }
                      options={
                        responder
                          ? responder.map((res) => ({
                              label: res.fullname,
                              value: res.id,
                            }))
                          : []
                      }
                      disabledOption="Select a Responder"
                    />
                </div>
              </div>
              <div className="flex flex-col space-y-4 flex-1">
                <InputStyle
                  label={"Date reported"}
                  type={"datetime-local"}
                  value={emergencyData.date}
                  onChange={(e) =>
                    setEmergencyData({
                      ...emergencyData,
                      date: e.target.value,
                    })
                  }
                />
                <InputStyle
                  label={"Response time"}
                  type={"datetime-local"}
                  value={emergencyData.responseTime}
                  onChange={(e) =>
                    setEmergencyData({
                      ...emergencyData,
                      responseTime: e.target.value,
                    })
                  }
                />
                <InputStyle
                  label={"Date resolved"}
                  type={"datetime-local"}
                  value={emergencyData.dateResolved}
                  onChange={(e) =>
                    setEmergencyData({
                      ...emergencyData,
                      dateResolved: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                className="w-full border px-4 py-2 text-sm rounded-md text-start text-gray-500"
                onClick={() => setOpenMap(true)}
              >
                {emergencyData.location
                  ? `${emergencyData.location.geoCodeLocation}`
                  : "Select Location"}
              </button>

              <button
                className="w-full border py-2 text-sm rounded-md text-center text-white bg-blue-500"
                onClick={saveEmergencyData}
              >
                Save Data
              </button>
            </div>
          </div>
        }
      />
      {openMap && (
        <div
          className="flex items-center fixed inset-0 justify-center z-50 h-screen w-screen"
          onClick={() => setOpenMap(false)}
        >
        <p className="absolute bottom-16 text-white font-bold">Click the Map to set the location</p>
          <EmergencyMap
            setEmergencyData={setEmergencyData}
            setOpenMap={setOpenMap}
          />
        </div>
      )}
    </>
  );
};

export default AddRecordModal;
