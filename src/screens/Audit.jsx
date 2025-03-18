import React from "react";
import HeaderAndSideBar from "../components/ReusableComponents/HeaderSidebar";
import Toolbar from "../components/ToolBar";
import { useState } from "react";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import { useFetchData } from "../hooks/useFetchData";
import useFilteredData from "../components/SearchQuery";
import usePagination from "../hooks/usePagination";
import { formatDateWithTime } from "../helper/FormatDate";

const Audit = () => {
  const { data: userlogs } = useFetchData("usersLog");
  const { data: users = [] } = useFetchData("users");
  const { data: responders = [] } = useFetchData("responders");
  const { data: admins = [] } = useFetchData("admins");
  const [searchQuery, setSearchQuery] = useState("");
  const HeaderData = ["User Id","Fullname","Type", "Date", "Action"];
  // search field to get the value with
  const searchFields = ["date","fullname", "type", "userId"];

  // updated data to include the name of users and responder which not included in original list of emergencyHistory
  const updatedData = userlogs.map((log) => {
    const user = users.find((user) => user?.id === log?.userId);
    const responder = responders.find(
      (responder) => responder?.id === log?.userId
    );
    const admin = admins.find(
      (admin) => admin?.id === log?.userId
    );

    return {
      ...log,
      fullname: user?.fullname || responder?.fullname || admin?.fullname ||  "-",
      userId: user?.customId || responder?.customId || admin?.id ||  "-",
      type: user ? "resident" : responder ? "responder" : admin ?  "admin" : "-",
    };
  });

  const filteredData = useFilteredData(updatedData, searchQuery, searchFields);
  const {currentPage,setCurrentPage, indexOfLastItem, indexOfFirstItem, currentItems, totalPages} = usePagination(filteredData)

  const renderRow = (userLog) => {

    const TdStyle = ({data}) => {
        return (
            <td className="px-6 py-4 max-w-16 text-ellipsis overflow-hidden whitespace-nowrap">
                {data}
            </td>
        )
    }
    return(
       <>
        <TdStyle data={userLog.userId}/>
        <TdStyle data={userLog.fullname}/>
        <TdStyle data={userLog.type}/>
        <TdStyle data={formatDateWithTime(userLog.date)}/>
        <TdStyle data={userLog.action}/>
       </>
      
    )
  }

  return (
    <HeaderAndSideBar
      content={
        <>
          <Toolbar
            label="Audit Trails"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <Table headers={HeaderData} data={currentItems} renderRow={renderRow} emptyMessage="No user logs found" />
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            data={filteredData}
          />
        </>
      }
    />
  );
};

export default Audit;
