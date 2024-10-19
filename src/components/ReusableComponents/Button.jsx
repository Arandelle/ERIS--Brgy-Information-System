import { Tooltip } from "@mui/material";

const ButtonStyle = ({ icon: Icon,onClick,color, label, fontSize}) => {

  return (
   <Tooltip title={label} placement="top" arrow>
      <button
        onClick={onClick}
        className={`inline-flex space-x-2 justify-center items-center text-nowrap text-${color}-500 bg-${color}-100 border border-${color}-300 focus:outline-none hover:bg-${color}-100 focus:ring-4 focus:ring-${color}-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-${color}-800 dark:text-${color}-400 dark:border-${color}-600 dark:hover:bg-${color}-700 dark:hover:border-${color}-600 dark:focus:ring-${color}-700`}
      >
         <Icon
         fontSize={fontSize}
          className={`text-${color}-500 hover:text-${color}-600`} 
          />
         <p> {label}</p>
      </button>
   </Tooltip>
  );
};

export default ButtonStyle;
