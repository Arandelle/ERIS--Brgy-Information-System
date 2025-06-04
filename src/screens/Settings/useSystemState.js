import { useState, useEffect, useMemo } from "react";
import { useFetchSystemData } from "../../hooks/useFetchSystemData";

const useSystemState = () => {
  const { systemData, loading, setLoading } = useFetchSystemData();
  const [systemState, setSystemState] = useState({
    previewImage: "",
    originalImageUrl: "",
    location: "",
    newLocation: "",
    isOtpEnabled: true,
  });

  // Initialize systemState with fetched data
  useEffect(() => {
    if (systemData) {
      setSystemState((prevState) => ({
        ...prevState,
        location: systemData.location || "",
        newLocation: systemData.location,
        isOtpEnabled: systemData.isOtpEnabled,
      }));
    }
  }, [systemData]);

  // Derived value: check if system state is modified
  const isModified = useMemo(() => {
    return (
      systemState.location !== systemState.newLocation
    );
  }, [systemState.location, systemState.newLocation]);

  return { 
    systemState: { ...systemState, isModified }, 
    setSystemState, 
    loading, 
    setLoading 
  };
};

export default useSystemState;
