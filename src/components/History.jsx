import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar/Sidebar";
import { Toggle } from "../hooks/Toggle";
import Image from "../assets/logo.png"
import Skeleton from "./Skeleton";

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
              <div>
              <h1 className="dark:text-white">This is History</h1>
              <div className="fixed inset-0 flex justify-center items-center">
                <img src={Image} alt="" />
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
