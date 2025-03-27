import ButtonStyle from "../../components/ReusableComponents/Button";
import HeaderAndSideBar from "../../components/ReusableComponents/HeaderSidebar";
import Toolbar from "../../components/ToolBar";
import icons from "../../assets/icons/Icons";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import { useFetchData } from "../../hooks/useFetchData";
import { useState } from "react";
import useFilteredData from "../../hooks/useFilteredData";
import usePagination from "../../hooks/usePagination";
import IconButton from "../../components/ReusableComponents/IconButton";
import HotlinesModal from "./HotlinesModal";
import handleAddData from "../../hooks/handleAddData";
import AskCard from "../../components/ReusableComponents/AskCard";
import handleDeleteData from "../../hooks/handleDeleteData";
import { toast } from "sonner";
import handleEditData from "../../hooks/handleEditData";
import useSearchParam from "../../hooks/useSearchParam";
import logAuditTrail from "../../hooks/useAuditTrail";
import { generateUniqueBarangayID } from "../../helper/generateID";

const Hotlines = () => {
  const {searchParams, setSearchParams} = useSearchParam();
  const { data: hotlines = [] } = useFetchData("hotlines");
  const [hotlinesModal, setHotlinesModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hotlineState, setHotlinesState] = useState({
    organization: "",
    name: "",
    contact: "",
    email: "",
    description: "",
    category: "",
  });
  const [selectedId, setSelectedId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const searchField = ["category","organization","name", "contact","email", "description"];
  const HotlineHeaders = ["Category","Organizations", "Name", "PhoneNumber", "Description", "Action"];

  const filteredData = useFilteredData(hotlines, searchQuery, searchField);

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

  const renderRow = (hotlines) => {
    return (
      <>
       <TableData data={hotlines.category} />
        <TableData data={hotlines.organization}/>
        <TableData data={hotlines.name} />
        <TableData data={hotlines.contact}/>
        <TableData data={hotlines.description} />
        <td className="">
          <div className="flex items-center justify-center space-x-4">
            <IconButton
              icon={icons.edit}
              color={"green"}
              fontSize={"small"}
              tooltip={"Edit contact?"}
              onClick={() => handleEditClick(hotlines)}
            />
            <IconButton
              icon={icons.delete}
              color={"red"}
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
    setSearchParams(!hotlinesModal ? "Add new" : {})
  };

  const handleAddHotlines = async () => {
    const customId = await generateUniqueBarangayID("hotlines");
    const hotlineData = {
      ...hotlineState,
      customId
    };
    const hotlineUid = await handleAddData(hotlineData, "hotlines"); // get the uid of the added data
    if(hotlineUid) {
      await logAuditTrail("Added hotline", hotlineUid);
    }

    setHotlinesState({});
    setHotlinesModal(false);
    setSearchParams({})
  };

  const handleDeleteModal = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
    setSearchParams({uid: id})
  };

  const handleConfirmDelete = async () => {
    try {
      await handleDeleteData(selectedId, "hotlines");
      await logAuditTrail("Deleted hotline")
    } catch (error) {
      toast.error(`Error deleting ${error}`);
    }

    setShowDeleteModal(false);
    setSearchParams({})
  };

  const handleEditClick = (hotlines) => {
    setSearchParams({"edit/uid" : hotlines.id})
    setHotlinesModal(true);
    setHotlinesState((prev) => ({
      ...prev,
      organization: hotlines.organization,
      name: hotlines.name,
      contact: hotlines.contact,
      email: hotlines.email,
      description: hotlines.description,
      category: hotlines.category,
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
    await logAuditTrail("Update hotline", id);
    setHotlinesState({});
    setHotlinesModal(false);
    setSearchParams({});
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
                    {hotlines.find((item) => item.id === selectedId)?.organization}
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
