import React, { useEffect } from "react";
import { useFetchData } from "./useFetchData";
import handleDeleteData from "./handleDeleteData";

const useRemoveOldData = (dataType) => {
  const { data: arrayData } = useFetchData(dataType);

  useEffect(() => {
    if (arrayData.length > 0) {
      const now = new Date();
      const ninetyDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // old data in 7 days

      // Filter logs older than 1 day
      const oldLogs = arrayData.filter((log) => new Date(log.date) < ninetyDaysAgo);

      // Remove old logs concurrently
      Promise.all(
        oldLogs.map(async (log) => {
          await handleDeleteData(log.id, dataType);
        })
      )
        .then(() => console.log("All old data was removed"))
        .catch((error) => console.error(error));
    }
  }, [arrayData]);

  return null;
};

export default useRemoveOldData;
