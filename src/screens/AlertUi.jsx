import React, { useEffect } from "react";
import Alert from "../assets/images/14.gif";
import { useNavigate } from "react-router-dom";

const AlertUi = () => {

    const navigate = useNavigate();

    useEffect(() => {
        navigate("/maps");
    },[]);

  return (
    <div className="absolute z-50 top-20 left-1/2 -translate-x-1/2">
        <img src={Alert} alt="emergency alert!" className="h-40"/>
    </div>
  );
};

export default AlertUi;
