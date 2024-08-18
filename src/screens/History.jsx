import React, { useEffect, useState } from "react";
import Maintenance from "../components/ReusableComponents/Maintenance";
import HeadSide from "../components/ReusableComponents/HeaderSidebar";
import { auth, database } from "../services/firebaseConfig";
import { ref, get } from "firebase/database";

export const HeaderData = [
  "emergency id",
  "Type",
  "Name",
  "Decription",
  "Location",
  "Status",
  "Submitted",
];

function History() {
  const [emergencyHistory, setEmergencyHistory] = useState([]);

  useEffect(() => {
    fetchEmergencyHistory();
  }, []);

  const fetchEmergencyHistory = async () => {
    const user = auth.currentUser;

    if (user) {
      const userRef = ref(database, `emergencyRequest`);
      const historySnapshot = await get(userRef);
      const historyData = historySnapshot.val();

      if (historyData) {
        const emergencyPromises = Object.keys(historyData).map(async (key) => {
          const emergencyRef = ref(database, `emergencyRequest/${key}`);
          const emergencySnapshot = await get(emergencyRef);
          return { id: key, ...emergencySnapshot.val() };
        });

        const emergencies = await Promise.all(emergencyPromises);
        setEmergencyHistory(emergencies);
      } else {
        setEmergencyHistory([]);
      }
    }
  };

  return (
    <HeadSide
      child={
        <div className="flex flex-col justify-center m-3">
          <div className="overflow-auto w-full">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:bg-opacity-70 dark:text-gray-400">
                <tr>
                  {HeaderData.map((header, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-6 py-3 text-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              {emergencyHistory.length > 0 ? (
                emergencyHistory.map((emergency) => (
                  <tr
                    className={`border-b dark:border-gray-700 bg-white hover:bg-gray-100 dark:bg-gray-800 hover:dark:bg-gray-700`}
                  >
                    <td className="px-6 py-4">{emergency.id}</td>
                    <td className="px-6 py-4">{emergency.type}</td>
                    <td className="px-6 py-4">{emergency.name}</td>
                    <td className="px-6 py-4">{emergency.description}</td>
                    <td className="px-6 py-4">
                      {emergency.location.location} 
                    </td>
                    <td className="px-6 py-4">{emergency.status}</td>
                    <td className="px-6 py-4">{new Date(emergency.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr
                  className={`border-b dark:border-gray-700 bg-white hover:bg-gray-100 dark:bg-gray-800 hover:dark:bg-gray-700`}
                >
                  <td className="px-6 py-4 text-center" colSpan={8}>No data found</td>
                </tr>
              )}
            </table>
          </div>
        </div>
      }
    />
  );
}

export default History;
