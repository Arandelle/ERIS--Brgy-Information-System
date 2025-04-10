import { useState, useEffect } from "react";
import { useFetchSystemData } from "../../hooks/useFetchSystemData";

const useSystemState = () => {
  const { systemData, loading, setLoading } = useFetchSystemData();
  const [systemState, setSystemState] = useState({
    originalTitle: "",
    title: "",
    previewImage: "",
    originalImageUrl: "",
    logoImageFile: null,
    isModified: false,
    isOtpEnabled: true,
  });

  // render the systemState the systemData's data under the details
  useEffect(() => {
    if (systemData) {
      setSystemState((prevState) => ({
        ...prevState,
        originalTitle: systemData.title || "",
        title: systemData.title,
        originalImageUrl: systemData.fileUrl,
        previewImage: systemData.fileUrl,
        isModified: false,
        isOtpEnabled: systemData.isOtpEnabled,
      }));
    }
  }, [systemData]);

  // Check if the system data has been modified
  useEffect(() => {
    const { title, logoImageFile } = systemState;
    if (title !== systemState.originalTitle || logoImageFile) {
      setSystemState((prevState) => ({
        ...prevState,
        isModified: true,
      }));
    } else {
      setSystemState((prevState) => ({
        ...prevState,
        isModified: false,
      }));
    }
  }, [systemState]);

  return { systemState, setSystemState, loading, setLoading };
};

export default useSystemState;
