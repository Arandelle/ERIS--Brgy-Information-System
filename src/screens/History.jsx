import React, { useEffect, useState } from "react";
import HeadSide from "../components/ReusableComponents/HeaderSidebar";
import { auth, database } from "../services/firebaseConfig";
import { ref, get } from "firebase/database";
import Table from "../components/Table";


function History() {
  const [emergencyHistory, setEmergencyHistory] = useState([]);

  const HeaderData = [
    "emergency id",
    "Type",
    "Name",
    "Decription",
    "Location",
    "Status",
    "Submitted",
    "Responder"
  ];

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

  const renderRow = (emergency) => {
    return (
      <>
      <td className="px-6 py-4">{emergency.id}</td>
      <td className="px-6 py-4">{emergency.type}</td>
      <td className="px-6 py-4 whitespace-nowrap">{emergency.name}</td>
      <td className="px-6 py-4">{emergency.description}</td>
      <td className="px-6 py-4">{emergency.location}</td>
      <td className={`px-6 py-4 ${statusColor[emergency.status]}`}>
        {emergency.status.toUpperCase()}
      </td>
      <td className="px-6 py-4">
        {new Date(emergency.date).toLocaleString()}
      </td>
      <td className="px-6 py-4">
        {emergency.acceptedBy ?? 'waiting for responder'}
      </td>
    </>
    
  );
  }
   

  const statusColor = {
    done: "text-green-500",
    pending: "text-yellow-500",
    accepted: "text-orange-500",
    expired: "text-red-500"
  }

  return (
    <HeadSide
      child={
        <Table
         headers={HeaderData}
         data={emergencyHistory}
         renderRow={renderRow}
         emptyMessage={"No records found"}
         />
      }
    />
  );
}

export default History;
