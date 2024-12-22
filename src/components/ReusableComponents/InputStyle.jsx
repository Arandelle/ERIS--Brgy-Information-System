import { useState } from "react";
import icons from "../../assets/icons/Icons";
import { Tooltip } from "@mui/material";

export const InputStyle = ({
    label,
    iconName,
    type,
    onChange,
    placeholder,
    value,
  }) => {

    const [showPass, setShowPass] = useState(false);
    const IconComponent = icons[iconName]; // container for dynamic icon
    const handleShowHidePass = () => {
        setShowPass(!showPass);
      };


    return (
      <div className="space-y-2">
        <label>{label}</label>
        <div class="relative">
          <div class="absolute text-gray-500 inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            {IconComponent && <IconComponent fontSize="small" />}
          </div>
          <input
            type={showPass ? "text" : type}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            onChange={onChange}
            placeholder={placeholder}
            value={value}
          />
  
          {type === "password" && (
            <div
              class={`absolute inset-y-0 end-0 flex items-center pe-3.5`}
              onClick={handleShowHidePass}
            >
              {!showPass ? (
                <Tooltip title="Show Password" placement="right" arrow>
                  <div className="text-gray-500 cursor-pointer">
                    <icons.closeEye fontSize="small" />
                  </div>
                </Tooltip>
              ) : (
                <Tooltip title="Hide Password" placement="right" arrow>
                  <div className="text-gray-500 cursor-pointer">
                    <icons.view fontSize="small" />
                  </div>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };