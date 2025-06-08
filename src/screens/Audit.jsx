import React, { useEffect, useMemo} from "react";
import HeaderAndSideBar from "../components/ReusableComponents/HeaderSidebar";
import Toolbar from "../components/ToolBar";
import { useState } from "react";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import { useFetchData } from "../hooks/useFetchData";
import useFilteredData from "../hooks/useFilteredData";
import usePagination from "../hooks/usePagination";
import { formatDateWithTime } from "../helper/FormatDate";
import SelectStyle from "../components/ReusableComponents/SelectStyle";
import useRemoveOldData from "../hooks/useRemoveOldData";
import useDebounce from "../hooks/useDebounce";

const Audit = () => {
  const { data: userlogs } = useFetchData("usersLog");
  const { data: users = [] } = useFetchData("users");
  const { data: responders = [] } = useFetchData("responders");
  const { data: admins = [] } = useFetchData("admins");
  const { data: awareness = [] } = useFetchData("awareness");
  const { data: hotline = [] } = useFetchData("hotlines");
  const { data: clearance = [] } = useFetchData("requestClearance");
  const { data: template = [] } = useFetchData("templateContent");
  const { data: emergency = [] } = useFetchData("emergencyRequest");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterData, setFilterData] = useState("");

  const debounceQuery = useDebounce(searchQuery, 5000); // use the debounce hook to have delay on output for searching

  const HeaderData = [
    "Executor Id",
    "Fullname",
    "Account Type",
    "Execute Date",
    "Action",
    "Target ID",
  ];
  const searchFields = [
    "date",
    "fullname",
    "type",
    "userId",
    "targetId",
    "action",
    "email",
  ];

  // removes data in 7 days
  useRemoveOldData("usersLog");

  // memoize action list
  const actionLog = useMemo(() => {
    if(!userlogs || userlogs.length === 0) return [];

    return [...new Set(userlogs.map((log) => log.action).sort((a,b) => a.localeCompare(b)))];

  }, [userlogs]);

  // updated data to include the name of users and responder which not included in original list of emergencyHistory
  const updatedData = useMemo(() => {
    return userlogs.map((log) => {
      const executor =
        users.find((user) => user?.id === log?.userId) ||
        responders.find((responder) => responder?.id === log?.userId) ||
        admins.find((admin) => admin?.id === log?.userId);

      const target =
        users.find((user) => user?.id === log?.targetId) ||
        responders.find((responder) => responder?.id === log?.targetId) ||
        admins.find((user) => user?.id === log?.targetId) ||
        awareness.find(
          (awareness) => awareness?.id === log?.targetId
        ) ||
        hotline.find((hotline) => hotline?.id === log?.targetId) ||
        clearance.find((clearance) => clearance?.id === log?.targetId) ||
        template.find((template) => template?.id === log?.targetId) ||
        emergency.find((emergency) => emergency?.id === log?.targetId);

      return {
        ...log,
        fullname: executor?.fullname || "-",
        userId: executor?.customId || "-",
        type: executor
          ? users.includes(executor)
            ? "resident"
            : responders.includes(executor)
            ? "responder"
            : "admin"
          : "-",
        targetId: target?.customId || target?.emergencyId ||  "-", // Get custom ID for the target
      };
    });
  }, [
    userlogs,
    users,
    responders,
    admins,
    awareness,
    hotline,
    clearance,
    template,
    emergency
  ]);

  // After filtering by search query, further filter by action type
  // If filterData is "All" or empty, include all logs; otherwise, match specific action
  const filteredData = useFilteredData(
    updatedData,
    debounceQuery,
    searchFields
  ).filter(
    (log) => !filterData || filterData === "All" || log.action === filterData
  );

  const {
    currentPage,
    setCurrentPage,
    indexOfLastItem,
    indexOfFirstItem,
    currentItems,
    totalPages,
  } = usePagination(filteredData);

  const renderRow = (userLog) => {
    const TdStyle = ({ data }) => {
      return (
        <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm">
          <div className="truncate max-w-[100px] sm:max-w-[200px]">{data}</div>
        </td>
      );
    };
    return (
      <>
        <TdStyle data={userLog.userId} />
        <TdStyle data={userLog.fullname} />
        <TdStyle data={userLog.type} />
        <TdStyle data={formatDateWithTime(userLog.date)} />
        <TdStyle data={userLog.action} />
        <TdStyle data={userLog.targetId} />
      </>
    );
  };

  return (
    <HeaderAndSideBar
      content={
        <>
          <Toolbar
            label="Users Logs"
            buttons={
              <SelectStyle
                value={filterData}
                onChange={(e) => setFilterData(e.target.value)}
                options={["All", ...actionLog]}
                disabledOption={"Filter Logs"}
              />
            }
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <Table
            headers={HeaderData}
            data={currentItems}
            renderRow={renderRow}
            emptyMessage="No user logs found"
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

export default Audit;
