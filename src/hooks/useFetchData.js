import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../services/firebaseConfig";

export const useFetchData = (dataType) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const dataRef = ref(database, dataType);
    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        try {
          const fetchedData = snapshot.val();
          const dataList = [];
          for (const id in fetchedData) {
            dataList.push({ id, ...fetchedData[id] });
          }
          setData(dataList);
          setLoading(false);
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [dataType]);

  return { data,setData, loading, error, setLoading };
};