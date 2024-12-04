import { useState, useEffect } from "react";
import { database } from "../services/firebaseConfig"; // Adjust the import according to your project structure
import { ref, get } from "firebase/database";
import { toast } from "sonner";

export const useFetchSystemData = () => {
  const [systemData, setSystemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSystemData = async () => {
      const systemRef = ref(database, "systemData");
      try {
        const snapshot = await get(systemRef);
        if (snapshot.exists()) {
          setSystemData(snapshot.val());
        } else {
          setSystemData(null);
        }
      } catch (error) {
        toast.error(`Error fetching system data: ${error.message}`);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSystemData();
  }, []);

  return { systemData, loading, error,setLoading };
};
