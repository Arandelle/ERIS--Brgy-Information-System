import React, { useEffect, useState } from "react";
import Modal from "../../components/ReusableComponents/Modal";
import { InputField } from "../../components/ReusableComponents/InputField";
import handleAddData from "../../hooks/handleAddData";
import handleEditData from "../../hooks/handleEditData";
import {useNavigate} from "react-router-dom";

const ClearanceModal = ({ handleCloseModal, isEdit, selectedId, userData }) => {
  const navigate = useNavigate();
  const [clearanceData, setClearanceData] = useState({
    docsType: "",
    fullname: "",
    age: "",
    address: "",
    gender: "",
    civilStatus: "",
    moveInYear: "",
  });
  const [complete, setComplete] = useState(false);

  const years = [];
  for (let i = 1900; i <= new Date().getFullYear(); i++) {
    years.push(i);
  }

  const selectStyle =
    "px-4 py-2 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-gray-400 focus:border-gray-400 dark:placeholder:text-gray-200 dark:text-gray-200 dark:bg-gray-600 w-full";

  const handleRequestClearance = async () => {
    const requestData = {
      ...clearanceData,
      status: "pending",
    };

    await handleAddData(requestData, "requestClearance");
    setClearanceData({});
    handleCloseModal();
  };

  useEffect(() => {
    if (isEdit && userData) {
      setClearanceData({
        ...clearanceData,
        docsType: userData.docsType,
        fullname: userData.fullname,
        age: userData.age,
        address: userData.address,
        gender: userData.gender,
        civilStatus: userData.civilStatus,
        moveInYear: userData.moveInYear,
      });
    };
  }, [isEdit, userData]);

  useEffect(() => {
    const {
      docsType,
      fullname,
      age,
      address,
      gender,
      civilStatus,
      moveInYear,
    } = clearanceData;
    const isComplete =
      docsType &&
      fullname &&
      age &&
      address &&
      gender &&
      civilStatus &&
      moveInYear;
    setComplete(isComplete);
  }, [
    clearanceData.docsType,
    clearanceData.fullname,
    clearanceData.age,
    clearanceData.address,
    clearanceData.gender,
    clearanceData.civilStatus,
    clearanceData.moveInYear,
  ]);

  const handleUpdateClearance = async () => {
    const updatedData = {
      ...clearanceData
    };

    await handleEditData(selectedId, updatedData, "requestClearance");
    handleCloseModal();
  };

  return (
    <Modal
      closeButton={handleCloseModal}
      title={"Create Request"}
      children={
        <div className=" max-w-2xl space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-300 italic">
            Input the necessary information for creating a request for barangay
            clearance. Ensure all fields are filled accurately and in compliance
            with relevant privacy policies and regulations.
          </p>

          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 space-x-0 md:space-x-6">
            <div className="space-y-4 md:space-y-6">
              <select
                className={selectStyle}
                value={clearanceData.docsType}
                onChange={(e) =>
                  setClearanceData({
                    ...clearanceData,
                    docsType: e.target.value,
                  })
                }
              >
                <option value="" disabled>
                  Select Certificate Type
                </option>
                <option value="Clearance">Clearance</option>
                <option value="Indigency">Indigency</option>
              </select>

              <InputField
                type={"text"}
                placeholder={"Enter Full Name"}
                value={clearanceData.fullname}
                onChange={(e) =>
                  setClearanceData({
                    ...clearanceData,
                    fullname: e.target.value,
                  })
                }
              />
              <InputField
                type={"number"}
                placeholder={"Enter Age"}
                value={clearanceData.age}
                onChange={(e) =>
                  setClearanceData({ ...clearanceData, age: e.target.value })
                }
              />
              <InputField
                type={"text"}
                placeholder={"Enter Address"}
                value={clearanceData.address}
                onChange={(e) =>
                  setClearanceData({ ...clearanceData, address: e.target.value })
                }
              />
            </div>
            <div className="space-y-4 md:space-y-6">
              <select
                className={selectStyle}
                value={clearanceData.gender}
                onChange={(e) =>
                  setClearanceData({ ...clearanceData, gender: e.target.value })
                }
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <select
                className={selectStyle}
                value={clearanceData.civilStatus}
                onChange={(e) =>
                  setClearanceData({
                    ...clearanceData,
                    civilStatus: e.target.value,
                  })
                }
              >
                <option value="" disabled>
                  Select Civil Status
                </option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Divorced">Divorced</option>
                <option value="Separated">Separated</option>
              </select>

              <select
                className={selectStyle}
                value={clearanceData.moveInYear}
                onChange={(e) =>
                  setClearanceData({
                    ...clearanceData,
                    moveInYear: e.target.value,
                  })
                }
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
                <option value="" disabled>
                  Select Move-in Year
                </option>
              </select>
            </div>
          </div>

          <button
            className={`w-full text-white px-4 py-2 rounded-md ${
              complete ? "bg-blue-500" : "bg-gray-500"
            }`}
            onClick={isEdit ? () => handleUpdateClearance(selectedId) : handleRequestClearance}
            disabled={!complete}
          >
            Save Data
          </button>
        </div>
      }
    />
  );
};

export default ClearanceModal;
