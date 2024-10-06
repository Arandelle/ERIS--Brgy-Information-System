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
      <td>
      <p className={`${statusColor[emergency.status]}`}>  {emergency.status.toUpperCase()}</p>
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
   
  const statusStyle = "flex items-center justify-center font-bold p-0.5 rounded-md"
  const statusColor = {
    done: `text-green-500 bg-green-200 ${statusStyle}`,
    pending: `text-yellow-500 bg-yellow-200 ${statusStyle}`,
    accepted: `text-blue-500 bg-blue-200 ${statusStyle}`,
    expired: `text-red-500 bg-red-200 ${statusStyle}`
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
