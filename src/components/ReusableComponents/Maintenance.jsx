import React from "react";
import Image from "../../assets/logo.png";
import Maintenances from "../../assets/maintenance.svg"

const Maintenance = ({ title }) => {
  return (
    <div>
      <div>
        <h1 className="dark:text-white">This is <span className="text-lg text-primary">{title}</span></h1>
        <div className="relative flex-col flex items-center justify-center translate-y-1/2">
          <img src={Maintenances} alt="Nothing here" className="h-[250px] w-[250px]" />
          <h3 className="dark:text-white">Sorry the <span className="text-lg text-primary">{title}</span> is under maintenance</h3>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
