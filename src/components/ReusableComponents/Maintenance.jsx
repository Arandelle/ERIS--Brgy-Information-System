import React from "react";
import Image from "../../assets/logo.png";

const Maintenance = ({ title }) => {
  return (
    <div>
      <div>
        <h1 className="dark:text-white">This is {title}</h1>
        <div className="fixed flex-col inset-0 flex items-center justify-center">
          <img src={Image} alt="Nothing here" className="h-[200px] w-[200px]" />
          <h3>Sorry the {title} section is under maintenance</h3>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
