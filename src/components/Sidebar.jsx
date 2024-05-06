import React from 'react';
import { useState } from 'react';
import { Data } from './Data';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

function Sidebar({ isOpen, toggleSideBar }) {
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const handleMenuItemClick = (val) => {
    setOpenSubMenu(openSubMenu === val.title ? null : val.title);
  };

  const handleSubMenuClick = (link) => {
    window.location.pathname = link;
  };

  return (
    <div className={`dark:bg-gray-800 bg-gray-300 dark:text-white w-40 h-screen ${isOpen ? 'hidden' : 'block'}`}>
      <div className="p-4">
        <h1 className="text-base font-bold text-gray-800">Admin Panel</h1>
      </div>
      <ul>
        {Data.map((val, key) => (
          <li key={key} className={`text-sm px-4 pr-0 py-2 cursor-pointer ${(!val.items || openSubMenu !==val.title) && 'hover:bg-gray-700 hover:text-gray-300'}`} onClick={() => handleMenuItemClick(val)}>
            <div className="flex items-center">
              <div className="mr-2 ">{val.icon}</div>
              <div>{val.title}</div>
              {val.items && <ArrowRightIcon className={`ml-auto  transition-transform ${openSubMenu === val.title ? 'rotate-90' : 'rotate-0'}`} />} 
            </div>
            {val.items && openSubMenu === val.title && (
              <ul className="bg-gray-400 m-0 left-0"> {/* Set padding and margin to 0 */}
                {val.items.map((subVal, subKey) => (
                    <li key={subKey} className="text-sm px-4 py-2 hover:bg-gray-600 hover:text-gray-300 cursor-pointer" onClick={() => handleSubMenuClick(subVal.link)}>
                      <div className="flex items-center text-nowrap">
                        <div className="mr-2" >{subVal.icon}</div>
                        <div className="mr-3">{subVal.title}</div>
                      </div>
                    </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
