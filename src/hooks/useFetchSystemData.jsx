import { useState, useEffect } from "react";
import { database } from "../services/firebaseConfig"; // Adjust the import according to your project structure
import { ref, get, onValue } from "firebase/database";
import { toast } from "sonner";

export const useFetchSystemData = () => {
  const [systemData, setSystemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

      const systemRef = ref(database, "systemData");
      const unsubscribe = onValue(systemRef, (snapshot) => {
        try {
            const systemData = snapshot.val();
            setSystemData(systemData);
            setLoading(false)
          } catch (error) {
            toast.error(`Error fetching system data: ${error.message}`);
            setError(error);
            setLoading(false);
          }
      });
      return () => unsubscribe();

  }, []);

  return { systemData, loading, error,setLoading };
};
