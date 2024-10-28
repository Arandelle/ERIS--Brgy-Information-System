import HeadSide from "../components/ReusableComponents/HeaderSidebar";
import Table from "../components/Table";
import { useFetchData } from "../hooks/useFetchData";
import {capitalizeFirstLetter} from "../helper/CapitalizeFirstLetter"

function History() {

  const {data: emergencyHistory} = useFetchData("emergencyRequest");
  emergencyHistory.sort((a,b) => new Date(b.date) - new Date(a.date))

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

  const renderRow = (emergency) => {

    const {data: users} = useFetchData("users");
    const {data: responders} = useFetchData("responders");
    const userDetails = users?.find((user) => user.id === emergency.userId);
    const responderDetails = responders?.find((responder) => responder.id === emergency.responderId);

    const userName = userDetails?.firstname + userDetails?.lastname
    const responderName = responderDetails?.firstname + responderDetails?.lastname || "Waiting for Responder"

    const statusStyle = "flex items-center justify-center font-bold p-0.5 rounded-md"
    const statusColor = {
      resolved: `text-green-500 bg-green-200 ${statusStyle}`,
      "awaiting response": `text-yellow-500 bg-yellow-200 ${statusStyle}`,
      "on-going": `text-blue-500 bg-blue-200 ${statusStyle}`,
      expired: `text-red-500 bg-red-200 ${statusStyle}`
    }

    return (
      <>
      <td className="px-6 py-4 whitespace-nowrap">{emergency.emergencyId}</td>
      <td className="px-6 py-4">{emergency.type}</td>
      <td className="px-6 py-4 whitespace-nowrap">{userName}</td>
      <td className="px-6 py-4">{emergency.description}</td>
      <td className="px-6 py-4">{emergency.location.address}</td>
      <td>
      <p className={`${statusColor[emergency.status]} whitespace-nowrap`}>{capitalizeFirstLetter(emergency.status)}</p>
      </td>
      <td className="px-6 py-4">
        {new Date(emergency.date).toLocaleString()}
      </td>
      <td className="px-6 py-4">
     {responderName}
      </td>
    </>
    
  );
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
