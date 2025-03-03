import React from "react";
import HeaderAndSideBar from "../components/ReusableComponents/HeaderSidebar";
import SelectStyle from "../components/ReusableComponents/SelectStyle";
import { InputField } from "../components/ReusableComponents/InputField";

const Label = ({ label, isMainLabel }) => {
  return isMainLabel ? (
    <p className="font-semibold text-gray-700">{label}</p>
  ) : (
    <p className="text-gray-500 text-base">{label}</p>
  );
};

const Container = ({ label, inputs }) => {
  return (
    <div className=" space-y-3">
      <div>
        <Label label={label} />
      </div>
      <div>{inputs}</div>
    </div>
  );
};

const Reports = () => {


  return (
    <HeaderAndSideBar
      content={
        <div className="bg-white p-6 rounded-lg shadow-lg h-full">
          <h1 className="text-2xl font-bold text-blue-800 mb-6">
            Generate Reports
          </h1>
          <div className="flex flex-col md:flex-row space-x-0 md:space-x-5 space-y-5 md:space-y-0">
            <div className="space-y-4 flex-1 basis-1/2">
              <Container
                label={<Label label="Report Types" isMainLabel={true} />}
                inputs={
                  <SelectStyle
                    options={[
                      "Emergency Summary",
                      "User Growth Analysis",
                      "Emergency Type Distribution",
                    ]}
                  />
                }
              />
              <Label label="Filters" isMainLabel={true} />
                <Container
                  label={"Date Range"}
                  inputs={
                    <div className="flex flex-row space-x-4 items-center">
                     <InputField 
                      type="date"
                     />
                     <p>to</p>
                     <InputField type="date"/>
                    </div>
                  }
                />
                <Container
                  label={"Emergency Types"}
                  inputs={
                    <SelectStyle 
                      options={[
                        "Medical", "Crime", "Fire", "Natural Disaster", "Other"
                      ]}
                    />
                  }
                />
                <Label label={"Format Options"} isMainLabel={true} />
                <Container
                  label={"Format"}
                  inputs={
                    <SelectStyle 
                      options={["PDF", "Excel"]}
                    />
                  }
                />
              
            </div>
            <div className="flex-1 basis-1/2 space-y-3">
                  <Label label={"Preview Report"} isMainLabel={true}/>
                  <div className="grid grid-rows-3">
                    <div className="border rounded-md p-2 row-span-2">
                      This area is for preview chart
                    </div>
                    <div className="flex flex-row space-x-4 p-4">
                     <div className="space-x-4"> <input type="radio"/><label>Include Table</label></div>
                   <div className="space-x-4">   <input type="radio"/><label>Include Chart</label></div>
                    </div>
                  </div>
            </div>
          </div>
          <div className="place-self-end">
            <button className="py-2 px-6 font-semibold bg-green-400 text-white rounded shadow-md">
              Generate Report
            </button>
          </div>
        </div>
      }
    />
  );
};

export default Reports;
