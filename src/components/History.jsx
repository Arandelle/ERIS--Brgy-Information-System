import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar/Sidebar";
import { Toggle } from "../hooks/Toggle";
import Maintenance from "./ReusableComponents/Maintenance";
import Skeleton from "./ReusableComponents/Skeleton";

function History() {
  const { isOpen, toggleDropdown } = Toggle();
  const [loading, setLoading] = useState(true)

  return (
    <div className="flex flex-col w-full">
      <Header toggleSideBar={toggleDropdown} />
      <div className="flex">
        <div className="fixed z-50">
          <Sidebar isOpen={isOpen} toggleSidebar={toggleDropdown} />
        </div>
        <div
          className={`w-full transition-all duration-300 ease-in-out ${
            isOpen ? "ml-0" : "md:ml-60"
          }`}
        >
          <div className="m-3">
            {loading ? (<Skeleton setLoading={setLoading}/> ): (
             <Maintenance title={"History"}/>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
