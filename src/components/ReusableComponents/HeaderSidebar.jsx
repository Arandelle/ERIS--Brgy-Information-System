import React, { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar/Sidebar";
import { Toggle } from "../../hooks/Toggle";
import Skeleton from "./Skeleton";
import MsgReusable from "./MsgReusable";

const HeadSide = ({ child, message }) => {
  const { isOpen, toggleDropdown } = Toggle();
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full flex-col flex">
      <Header toggleSideBar={toggleDropdown}/>
      {message && (
          <MsgReusable message={message} type={message.includes('successfully') ? "success" : "delete" }/>
      )}
      <div className="flex">
        <div className="fixed z-50">
          <Sidebar isOpen={isOpen} toggleSidebar={toggleDropdown} />
        </div>
        <div className={`w-full ${isOpen ? "ml-0" : "md:ml-60"}`}>
          {loading ? (
            <div className="m-3">
              <Skeleton loading={loading} setLoading={setLoading} />
            </div>
          ) : (
            child
          )}
        </div>
      </div>
    </div>
  );
};

export default HeadSide;
