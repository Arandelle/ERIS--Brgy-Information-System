import React, { useState } from "react";
import HeaderAndSideBar from "../components/ReusableComponents/HeaderSidebar";
import Toolbar from "../components/ToolBar";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import ButtonStyle from "../components/ReusableComponents/Button";
import icons from "../assets/icons/Icons";
import useFilteredData from "../components/SearchQuery";
import usePagination from "../hooks/usePagination";
import IconButton from "../components/ReusableComponents/IconButton";
import { useFetchData } from "../hooks/useFetchData";

const Certification = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {data: clearance} = useFetchData("requestClearance");
  
  const searchFields = ["firstname", "lastname", "address", "age"];
  const Headers = ["Firstname", "Lastname", "Address","Age", "Action"];

  const filteredData = useFilteredData(clearance, searchQuery, searchFields);
  const {
    currentPage,
    setCurrentPage,
    indexOfLastItem,
    indexOfFirstItem,
    currentItems,
    totalPages,
  } = usePagination(filteredData);

  const TableData = ({data}) => {
    const nullValue = <p className="italic text-nowrap text-xs">null</p>;
    return (
      <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm">
      <div className="truncate max-w-[100px] sm:max-w-[200px]">
        {data || nullValue}
      </div>
    </td>
    )
  }

  const renderRow = (userData) => {
    return (
      <>
        <TableData data={userData.firstname}/>
        <TableData data={userData.lastname} />
        <TableData data={userData.address}/>
        <TableData data={userData.age}/>
        <td className="">
          <div className="flex items-center justify-center space-x-4">
            <IconButton
              icon={icons.print}
              color={"gray"}
              bgColor={"bg-gray-100"}
              fontSize={"small"}
              tooltip={"Accept and Print"}
            />
            <IconButton
              icon={icons.cancel}
              color={"red"}
              bgColor={"bg-red-100"}
              fontSize={"small"}
              tooltip={"Reject"}
            />
          </div>
        </td>
      </>
    );
  };

  return (
    <HeaderAndSideBar
      content={
        <>
          <Toolbar 
            buttons={
                <ButtonStyle 
                    icon={icons.addCircle}
                    color={"gray"}
                    label={"Add Template"}
                    fontSize={"small"}
                />
            }
            label="List of Certification Request"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <Table 
            headers={Headers}
            data={currentItems}
            renderRow={renderRow}
          />
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

export default Certification;
