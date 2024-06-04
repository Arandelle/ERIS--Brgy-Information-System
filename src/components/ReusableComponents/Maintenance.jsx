import React from "react";
import Image from "../../assets/logo.png";
import Maintenances from "../../assets/maintenance.svg"

const Maintenance = ({ title }) => {
  return (
    <div>
      <div>
        <h1 className="text-lg text-primary-500">{title}</h1>
        <div className="relative flex-col flex items-center justify-center translate-y-1/2">
          <img src={Maintenances} alt="Nothing here" className="h-[250px] w-[250px]" />
          <h3 className="dark:text-white"> <span className="text-lg text-primary-500">{title}</span> is temporarily unavailable. </h3>
          <h3 className="dark:text-white">Please check again later. Thank you for your patience!</h3>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
