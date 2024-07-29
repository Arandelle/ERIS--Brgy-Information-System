import React from "react";
import HeadSide from "../components/ReusableComponents/HeaderSidebar";
import InputReusable from "../components/ReusableComponents/InputReusable"
import BtnReusable from "../components/ReusableComponents/BtnReusable"

const Reports = () => {
  return (
    <HeadSide
      child={
        <div className="m-3">
          <div className="grid justify-start grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-15 my-15 gap-4">
            <InputReusable
              type="text"
              placeholder="Start Date"
              // value={}
              // onChange={}
              onFocus={(e)=>{e.target.type = "date"}}
              onBlur={(e) => {e.target.type = "text"}}
            />
            <InputReusable
              type="text"
              placeholder="End Date"
              // value={}
              // onChange={}
              onFocus={(e) => {e.target.type = "date"}}
              onBlur={(e) => {e.target.type = "text"}}

            />
            <BtnReusable value={"Search"} type={"add"}
            />
          </div>
        </div>
      }
    />
  );
};

export default Reports;
