import React from 'react';
import { useNavigate } from 'react-router-dom';

const BtnReusable = ({ onClick, value, type, link }) => {
  const btnType = () => {
    switch (type) {
      case 'add':
        return 'text-white shadow-md bg-blue-500 hover:bg-blue-600 focus:bg-blue-600';
      case 'edit':
        return 'text-white shadow-md bg-green-500 hover:bg-green-600 focus:bg-green-600';
      case 'delete':
        return 'text-white shadow-md bg-red-600 hover:bg-red-800 focus:bg-red-600';
      case 'logout':
        return 'text-red-500 hover:underline';
      default:
        return 'text-primary hover:text-blue-600 py-0';
    }
  };

  const navigate = useNavigate();
  const handleClick = () => {
    if (link) {
      navigate(link);
    } else if (onClick) {
      onClick();
    } else {
      console.log("No function");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`focus:outline-none ${btnType()}`}
    >
      {value}
    </button>
  );
};

export default BtnReusable;
