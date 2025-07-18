import React from "react";
import HeaderAndSideBar from "../../components/ReusableComponents/HeaderSidebar";
import useSystemState from "./useSystemState";
import handleEditData from "../../hooks/handleEditData";
import { barangayData } from "../../data/BarangayData";
import { auth } from "../../services/firebaseConfig";
import { get, child, ref, remove, set } from "firebase/database";
import { database } from "../../services/firebaseConfig";
import { toast } from "sonner";

const SystemSettings = ({ setLoading }) => {
  const { systemState, setSystemState, loading } = useSystemState();
  const currentUser = auth.currentUser;

 const handleUpdateData = async () => {
  setLoading(true);

  try {
    const updatedData = {
      location: systemState.location,
    };

    // 1. Get old barangay of the admin
    const oldBarangaySnapshot = await get(child(ref(database), `admins/${currentUser.uid}/barangay`));
    const oldBarangay = oldBarangaySnapshot.exists() ? oldBarangaySnapshot.val() : null;

    // 2. Update admin profile with new barangay
    await handleEditData(currentUser.uid, { barangay: systemState.location }, "admins");

    // 3. Remove from old barangay if different
    if (oldBarangay && oldBarangay !== systemState.location) {
      await remove(ref(database, `Barangay/${oldBarangay}/admins/${currentUser.uid}`));
    }

    // 4. Add to new barangay admins
    const adminDataSnapshot = await get(ref(database, `admins/${currentUser.uid}`));
    const adminData = adminDataSnapshot.val();
    await set(ref(database, `Barangay/${systemState.location}/admins/${currentUser.uid}`), adminData);

    // 5. Optionally update system-wide details
    await handleEditData("details", updatedData, "systemData");

    // 6. Update local state
    setSystemState((prevState) => ({
      ...prevState,
      location: systemState.location,
      isModified: false,
    }));

    setLoading(false);
    toast.success("Barangay updated successfully!");
  } catch (error) {
    console.error("Error updating barangay:", error);
    toast.error(`Error: ${error.message}`);
    setLoading(false);
  }
};

  const handleBrngyChange = (e) => {
    const { value } = e.target;
    setSystemState({
      ...systemState,
      location: value,
    });
  };

  // Handle image change
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type.startsWith("image/") &&
      file.size <= 5 * 1024 * 1024
    ) {
      if (type === "logo") {
        setSystemState((prevState) => ({
          ...prevState,
          logoImageFile: file,
          previewImage: URL.createObjectURL(file),
        }));
      } else if (type === "profile") {
        setAdminData({
          ...adminData,
          imageFile: file,
          prevImage: URL.createObjectURL(file),
        });
      }
    } else {
      toast.error(
        "Invalid file type or size. Please upload an image under 5MB."
      );
    }
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
          <LabelStyle label={"Barangay"} />
          <div className="flex-1 basis-1/2">
            <select
              value={systemState.location}
              onChange={(e) => handleBrngyChange(e)}
              className="rounded-lg shadow-sm border-2 cursor-pointer border-gray-200 text-gray-800 dark:text-gray-200 dark:bg-gray-700 text-sm"
            >
              {barangayData.map((b, index) => (
                <option key={index} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

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
