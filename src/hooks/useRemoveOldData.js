import React, { useEffect } from "react";
import { useFetchData } from "./useFetchData";
import handleDeleteData from "./handleDeleteData";

const useRemoveOldData = () => {
  const { data: userLogs } = useFetchData("usersLog");

  useEffect(() => {
    if (userLogs.length > 0) {
      const now = new Date();
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 60 * 60 * 1000); // old data in 90 days

      // Filter logs older than 1 day
      const oldLogs = userLogs.filter((log) => new Date(log.date) < ninetyDaysAgo);

      // Remove old logs concurrently
      Promise.all(
        oldLogs.map(async (log) => {
          await handleDeleteData(log.id, "usersLog");
        })
      )
        .then(() => console.log("All old data was removed"))
        .catch((error) => console.error(error));
    }
  }, [userLogs]);

  return null;
};

export default useRemoveOldData;
