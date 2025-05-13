import { useState, useEffect, useMemo } from "react";
import { useFetchSystemData } from "../../hooks/useFetchSystemData";

const useSystemState = () => {
  const { systemData, loading, setLoading } = useFetchSystemData();
  const [systemState, setSystemState] = useState({
    originalTitle: "",
    title: "",
    previewImage: "",
    originalImageUrl: "",
    logoImageFile: null,
    isOtpEnabled: true,
  });

  // Initialize systemState with fetched data
  useEffect(() => {
    if (systemData) {
      setSystemState((prevState) => ({
        ...prevState,
        originalTitle: systemData.title || "",
        title: systemData.title,
        originalImageUrl: systemData.fileUrl,
        previewImage: systemData.fileUrl,
        isOtpEnabled: systemData.isOtpEnabled,
      }));
    }
  }, [systemData]);

  // Derived value: check if system state is modified
  const isModified = useMemo(() => {
    return (
      systemState.title !== systemState.originalTitle ||
      !!systemState.logoImageFile
    );
  }, [systemState.title, systemState.originalTitle, systemState.logoImageFile]);

  return { 
    systemState: { ...systemState, isModified }, 
    setSystemState, 
    loading, 
    setLoading 
  };
};

export default useSystemState;
