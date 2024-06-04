import React from 'react';
import { useNavigate } from 'react-router-dom';

const BtnReusable = ({ onClick, value, type, link }) => {
  const btnType = () => {
    switch (type) {
      case 'add':
        return 'py-2 px-4 rounded-md text-white shadow-md bg-primary-500 hover:bg-primary-600 focus:bg-primary-600';
      case 'edit':
        return 'py-2 px-4 rounded-md text-white shadow-md bg-green-500 hover:bg-green-600 focus:bg-green-600';
      case 'delete':
        return 'py-2 px-4 rounded-md text-white shadow-md bg-red-600 hover:bg-red-800 focus:bg-red-600';
      default:
        return 'text-primary-500 hover:text-primary-600 py-0 px-4';
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
