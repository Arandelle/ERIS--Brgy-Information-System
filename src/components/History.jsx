import React, { useState } from "react";
import Maintenance from "./ReusableComponents/Maintenance";
import HeadSide from "./ReusableComponents/HeaderSidebar";

function History() {

  return (
    <HeadSide child={
      <div className="m-3">
      <Maintenance title={"History"}/>
      </div>
    }/>
  );
}

export default History;
