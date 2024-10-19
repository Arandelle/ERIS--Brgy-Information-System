import React from "react";
import Maintenances from "../../assets/images/maintenance.svg"

const Maintenance = ({ title }) => {
  return (
      <div className="">
        <h1 className="text-lg text-primary-500">{title}</h1>
        <div className="relative flex-col flex items-center justify-center translate-y-1/2">
          <img src={Maintenances} alt="Nothing here" className="h-[250px] w-[250px]" />
          <h3 className="dark:text-white">Sorry, the <span className="text-lg text-primary-500">{title}</span> section is temporarily out of service. </h3>
          <h3 className="dark:text-white">Please check back later. Thank you for your patience!</h3>
        </div>
      </div>
  );
};

export default Maintenance;
