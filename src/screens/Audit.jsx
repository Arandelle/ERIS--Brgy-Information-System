import React from "react";
import HeaderAndSideBar from "../components/ReusableComponents/HeaderSidebar";
import Toolbar from "../components/ToolBar";
import { useState } from "react";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import useSearchParam from "../hooks/useSearchParam";
import { useFetchData } from "../hooks/useFetchData";
import useFilteredData from "../components/SearchQuery";
import usePagination from "../hooks/usePagination";
import { formatDate } from "../helper/FormatDate";

const Audit = () => {
  const { setSearchParams } = useSearchParam();
  const { data: userlogs } = useFetchData("usersLog");
  const { data: users = [] } = useFetchData("users");
  const { data: responders = [] } = useFetchData("responders");
  const [searchQuery, setSearchQuery] = useState("");
  const HeaderData = ["User Id","Fullname", "Date", "Action"];
  // search field to get the value with
  const searchFields = ["date","fullname", "type", "userId"];

  // updated data to include the name of users and responder which not included in original list of emergencyHistory
  const updatedData = userlogs.map((log) => {
    const user = users.find((user) => user?.id === log?.userId);
    const responder = responders.find(
      (responder) => responder?.id === log?.userId
    );

    return {
      ...log,
      fullname: user?.fullname || responder?.fullname,
      userId: user?.customId || responder?.customId ||  "N/A",
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
        <TdStyle data={formatDate(userLog.date)}/>
        <TdStyle data={userLog.type}/>
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
