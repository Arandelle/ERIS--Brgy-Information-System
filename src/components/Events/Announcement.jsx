import React from "react";
import HeadSide from "../ReusableComponents/HeaderSidebar";
import Maintenance from "../ReusableComponents/Maintenance";

const Announcement = () => {
  return <HeadSide child={<Maintenance title={"Announcements Section"} />} />;
};

export default Announcement;
