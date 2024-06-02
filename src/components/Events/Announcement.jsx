import React from "react";
import HeadSide from "../ReusableComponents/HeaderSidebar";
import Maintenance from "../ReusableComponents/Maintenance";

const Announcement = () => {
  return <HeadSide child={
  <div className="m-3">
  <Maintenance title={"Announcements Section"} />
  </div>} />;
};

export default Announcement;
