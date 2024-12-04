// src/components/IconButton.js
import React from 'react';
import Tooltip from '@mui/material/Tooltip'; // Assuming you're using MUI for Tooltips

const IconButton = ({ icon: Icon, color, bgColor, onClick, tooltip, fontSize }) => {
  return (
    <Tooltip title={tooltip} placement="top" arrow>
      <p className={`${bgColor} p-1 rounded-full hover:bg-opacity-90 cursor-pointer`}>
        <Icon
          fontSize={fontSize}
          className={`text-${color}-500 dark:text-${color}-200 hover:text-${color}-600`}
          onClick={onClick}
        />
      </p>
    </Tooltip>
  );
};

export default IconButton;
