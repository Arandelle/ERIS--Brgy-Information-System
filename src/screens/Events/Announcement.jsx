import React from "react";
import HeadSide from '../../components/ReusableComponents/HeaderSidebar';
import Maintenance from '../../components/ReusableComponents/Maintenance';

const Announcement = () => {
  return <HeadSide child={
  <div className="m-3">
  <Maintenance title={"Announcements Section"} />
  </div>} />;
};

export default Announcement;
