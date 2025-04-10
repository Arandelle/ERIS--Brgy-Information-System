import React from "react";
import HeaderAndSideBar from "../../components/ReusableComponents/HeaderSidebar";
import useSystemState from "./useSystemState";

const SystemSettings = ({ handleImageChange, handleUpdateData, openModal}) => {
  const { systemState, setSystemState, loading } = useSystemState();

  // Handle title change
  const handleTitleChange = (e) => {
    const { value } = e.target;
    setSystemState((prevState) => ({
      ...prevState,
      title: value,
    }));
  };

  const LabelStyle = ({ label }) => {
    return (
      <p className="flex-1 basis-1/2 font-medium text-gray-800 text-md lg:text-lg dark:text-gray-200">
        {label}
      </p>
    );
  };

  if (loading) {
    return (
      <HeaderAndSideBar
        content={
          <div className="flex items-center text-gray-500 justify-center h-svh">
            Loading please wait...
          </div>
        }
      />
    );
  }

  return (
    <div className="border-b py-2 space-y-1">
      <p className="font-medium text-lg dark:text-gray-200">System Settings</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Manage your system information
      </p>
      <div className="space-y-3 py-6 px-0 lg:px-8">
        <div className="flex flex-row items-center">
          <LabelStyle label={"Title"} />
          <div className="flex-1 basis-1/2">
            <input
              type="text"
              value={systemState.title}
              onChange={handleTitleChange}
              maxLength={10}
              className="rounded-lg shadow-sm border-2 border-gray-200 text-gray-800 dark:text-gray-200 dark:bg-gray-700 text-sm"
            />
          </div>
        </div>
        <div className="flex flex-row items-center">
          <LabelStyle label={"Barangay"} />
          <div className="flex-1 basis-1/2">
            <select className="rounded-lg shadow-sm border-2 cursor-pointer border-gray-200 text-gray-800 dark:text-gray-200 dark:bg-gray-700 text-sm">
              <option>Bagtas</option>
            </select>
          </div>
        </div>
      </div>

      {/**Logo */}
      <section className="flex flex-row items-center">
        <div className="flex-1 basis-1/2">
          <img
            src={systemState.previewImage || systemState.originalImageUrl}
            alt="System Logo"
            className="w-24 lg:w-40 rounded-full cursor-pointer"
            loading="lazy"
            onClick={() => openModal(systemState.previewImage)}
          />
        </div>
        <div className="flex-1 basis-1/2">
          <label
            htmlFor="file-upload"
            className=" bg-gray-100 dark:text-gray-200 dark:bg-gray-700 font-medium text-sm whitespace-nowrap p-2 border rounded-lg cursor-pointer"
          >
            Upload Logo
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={(e) => handleImageChange(e, "logo")}
            />
          </label>
        </div>
      </section>
      {/**Save Button */}
      <div className="py-4 place-self-end">
        <button
          className={`py-2 px-4 rounded-md text-sm text-white ${
            systemState.isModified ? "bg-blue-500" : "bg-gray-500"
          }`}
          disabled={!systemState.isModified}
          onClick={handleUpdateData}
        >
          Save update
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;
