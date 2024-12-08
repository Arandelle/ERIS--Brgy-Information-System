import ButtonStyle from "../components/ReusableComponents/Button";
import HeadSide from "../components/ReusableComponents/HeaderSidebar";
import Toolbar from "../components/ToolBar";
import icons from "../assets/icons/Icons";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import { useFetchData } from "../hooks/useFetchData";
import { useState } from "react";
import useFilteredData from "../components/SearchQuery";
import usePagination from "../hooks/usePagination";
import IconButton from "../components/ReusableComponents/IconButton";

const Hotlines = () => {
  const { data: hotlines = [] } = useFetchData("hotlines");
  const [searchQuery, setSearchQuery] = useState("");
  const searchField = ["name", "contact", "description"];
  const HotlineHeaders = ["Name", "Contact", "Description", "Action"];

  const filteredData = useFilteredData(hotlines, searchQuery, searchField);

  const {
    currentPage,
    setCurrentPage,
    indexOfLastItem,
    indexOfFirstItem,
    currentItems,
    totalPages,
  } = usePagination(filteredData);

  const renderRow = (hotlines) => {
    const anonymous = <p className="italic text-nowrap text-xs">not yet set</p>;
    return (
      <>
        <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm">
          <div className="truncate max-w-[100px] sm:max-w-[200px]">
            {hotlines.name ?? anonymous}
          </div>
        </td>
        <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm">
          <div className="truncate max-w-[100px] sm:max-w-[200px]">
            {hotlines.contact ?? anonymous}
          </div>
        </td>
        <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm hidden sm:table-cell">
          {hotlines.description ?? anonymous}
        </td>
        <td className="">
           <div className="flex items-center justify-center space-x-4">
              <IconButton 
                icon={icons.delete}
                color={"red"}
                bgColor={"bg-red-100"}
                fontSize={"small"}
                tooltip={"Delete contact?"}
              />
              <IconButton 
                icon={icons.edit}
                color={"green"}
                bgColor={"bg-green-100"}
                fontSize={"small"}
                tooltip={"Edit contact?"}
              />
           </div>
        </td>
      </>
    );
  };

  return (
    <HeadSide
      child={
        <>
          <Toolbar
            buttons={
              <ButtonStyle
                icon={icons.addCircle}
                color={"gray"}
                label={"New hotlines"}
                fontSize={"small"}
              />
            }
            label="Hotlines Number"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <Table
            headers={HotlineHeaders}
            data={currentItems}
            renderRow={renderRow}
            emptyMessage="No hotlines contact found"
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

export default Hotlines;
