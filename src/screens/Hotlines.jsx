import ButtonStyle from "../components/ReusableComponents/Button";
import HeaderAndSideBar from "../components/ReusableComponents/HeaderSidebar";
import Toolbar from "../components/ToolBar";
import icons from "../assets/icons/Icons";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import { useFetchData } from "../hooks/useFetchData";
import { useState } from "react";
import useFilteredData from "../components/SearchQuery";
import usePagination from "../hooks/usePagination";
import IconButton from "../components/ReusableComponents/IconButton";
import HotlinesModal from "./HotlinesModal";
import handleAddData from "../hooks/handleAddData";
import AskCard from "../components/ReusableComponents/AskCard";
import handleDeleteData from "../hooks/handleDeleteData";
import { toast } from "sonner";
import handleEditData from "../hooks/handleEditData";

const Hotlines = () => {
  const { data: hotlines = [] } = useFetchData("hotlines");
  const [hotlinesModal, setHotlinesModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hotlineState, setHotlinesState] = useState({
    types: "",
    name: "",
    contact: "",
    description: "",
  });
  const [selectedId, setSelectedId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const searchField = ["name", "contact", "description"];
  const HotlineHeaders = ["Type", "Name", "Contact", "Description", "Action"];

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
    const anonymous = <p className="italic text-nowrap text-xs">null</p>;
    return (
      <>
        <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm">
          <div className="truncate max-w-[100px] sm:max-w-[200px]">
            {hotlines.types || anonymous}
          </div>
        </td>
        <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm">
          <div className="truncate max-w-[100px] sm:max-w-[200px]">
            {hotlines.name || anonymous}
          </div>
        </td>
        <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm">
          <div className="truncate max-w-[100px] sm:max-w-[200px]">
            {hotlines.contact || anonymous}
          </div>
        </td>
        <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm hidden sm:table-cell">
          {hotlines.description || anonymous}
        </td>
        <td className="">
          <div className="flex items-center justify-center space-x-4">
            <IconButton
              icon={icons.edit}
              color={"green"}
              bgColor={"bg-green-100"}
              fontSize={"small"}
              tooltip={"Edit contact?"}
              onClick={() => handleEditClick(hotlines)}
            />
            <IconButton
              icon={icons.delete}
              color={"red"}
              bgColor={"bg-red-100"}
              fontSize={"small"}
              tooltip={"Delete contact?"}
              onClick={() => handleDeleteModal(hotlines.id)}
            />
          </div>
        </td>
      </>
    );
  };

  const handleHotlinesModal = () => {
    setHotlinesModal(!hotlinesModal);
    setIsEdit(false);
    setHotlinesState({});
  };

  const handleAddHotlines = async () => {
    const hotlineData = {
      ...hotlineState,
    };

    await handleAddData(hotlineData, "hotlines");

    setHotlinesState({});
    setHotlinesModal(false);
  };

  const handleDeleteModal = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await handleDeleteData(selectedId, "hotlines");
    } catch (error) {
      toast.error(`Error deleting ${error}`);
    }

    setShowDeleteModal(false);
  };

  const handleEditClick = (hotlines) => {
    setHotlinesModal(true);
    setHotlinesState((prev) => ({
      ...prev,
      types: hotlines.types,
      name: hotlines.name,
      contact: hotlines.contact,
      description: hotlines.description,
    }));
    setSelectedId(hotlines.id);
    setIsEdit(true);
    console.log(selectedId);
  };

  const handleUpdateHotlines = async (id) => {
    const hotlinesData = {
      ...hotlineState,
    };

    await handleEditData(id, hotlinesData, "hotlines");
    setHotlinesState({});
    setHotlinesModal(false);
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
                label={"New hotlines"}
                fontSize={"small"}
                onClick={handleHotlinesModal}
              />
            }
            label="Hotlines Number"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {hotlinesModal && (
            <HotlinesModal
              handleHotlinesModal={handleHotlinesModal}
              handleAddHotlines={handleAddHotlines}
              handleUpdateHotlines={handleUpdateHotlines}
              isEdit={isEdit}
              selectedId={selectedId}
              hotlineState={hotlineState}
              setHotlinesState={setHotlinesState}
            />
          )}

          {showDeleteModal && (
            <AskCard
              toggleModal={() => setShowDeleteModal(!showDeleteModal)}
              question={
                <span>
                  Do you want to delete
                  <span className="text-primary-500 text-bold">
                    {" "}
                    {hotlines.find((item) => item.id === selectedId)?.types}
                  </span>{" "}
                  ?{" "}
                </span>
              }
              confirmText={"Delete"}
              onConfirm={handleConfirmDelete}
            />
          )}

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
