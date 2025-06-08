import React, { useEffect, useState } from "react";
import { useSidebarData } from "../data/useSidebarData";
import SearchInput from "./Header/SearchInput";
import icons from "../assets/icons/Icons";
import { useLocation, useNavigate } from "react-router-dom";
import {useFetchData} from "../hooks/useFetchData";

function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isActive, setIsActive] = useState(location.pathname);
  const [badgeCounts, setBadgeCounts] = useState({});

  // Fetch data for different sections
  const {data: incidentReport} = useFetchData("reportedData");
  const {data: certificationData} = useFetchData("requestClearance"); // Add your certification data hook
  const {data: emergencyData} = useFetchData("emergencyRequest"); // Add your certification data hook
  // Add more data hooks as needed

  // Function to calculate badge counts for different sections
  const calculateBadgeCounts = () => {
    //create container to store those lists
    const counts = {};
    
    // Calculate incident report badge count
    if (incidentReport && incidentReport.length > 0) {
      counts["Incident Report"] = incidentReport.filter(
        (incident) => incident.status === "pending"
      ).length;
    }
    
    // Calculate certification badge count
    if (certificationData && certificationData.length > 0) {
      counts["Certification"] = certificationData.filter(
        (cert) => cert.status === "pending" || cert.expiryDate < new Date()
      ).length;
    }

    if(emergencyData && emergencyData.length > 0) {
      counts["Emergency List"] = emergencyData.filter((emergency) => emergency.status === "pending").length;
      counts["Map"] = emergencyData.filter((emergency) => emergency.status === "pending").length;
    }
    
    return counts;
  };

  useEffect(() => {
    const counts = calculateBadgeCounts();
    setBadgeCounts(counts);
  }, [incidentReport, certificationData]); // Add all data dependencies

  useEffect(() => {
    setIsActive(location.pathname);

    // Automatically open submenu if sub-item is active
    const parentMenu = useSidebarData.find((menu) => 
      menu.items?.some(sub => sub.link === location.pathname)
    );

    setOpenSubMenu(parentMenu ? parentMenu.title : null);
  }, [location.pathname]);

  const handleMenuItemClick = (val) => {
    if (!val.items) {
      navigate(val.link);
    } else {
      setOpenSubMenu(openSubMenu === val.title ? null : val.title);
    }
  };

  const handleSubMenuClick = (link) => {
    navigate(link);
  };

  // Helper function to get badge count for a menu item
  const getBadgeCount = (title) => {
    return badgeCounts[title] || 0;
  };

  return (
    <div className={`flex fixed inset-0 z-0 ${isOpen ? "md:hidden md:w-1/6 md:relative" : "hidden"}
    ${!isOpen ? "md:flex md:relative" : ""}`}>
      <div className="bg-black bg-opacity-25 w-full md:relative md:w-0" onClick={toggleSidebar}></div>
      <div className="flex flex-col absolute md:relative w-4/5 md:w-60 shadow-lg px-3 h-screen bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        
        <div className="overflow-auto flex-grow">
          <ul className="space-y-2">
            <div className="text-center space-y-2 sticky top-0 z-50">
              <button 
                type="button" 
                onClick={toggleSidebar} 
                className="md:hidden text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-0 end-0 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <icons.cancel />
                <span className="sr-only">Close menu</span>
              </button>
              <h2 className="text-base text-center font-semi-bold uppercase text-gray-500 border-b border-gray-100 dark:border-gray-600 py-3 text-nowrap dark:text-gray-400">
                Admin Panel
              </h2>
              <div className={`relative ${isOpen ? "block" : "hidden"}`}>
                <SearchInput isOpen={isOpen} className={`relative ${isOpen ? "block" : "hidden"}`}/>
              </div>
            </div>
    
            {useSidebarData.map((val, key) => (
              <li
                key={key}
                className={`${
                  !val.items || openSubMenu !== val.title
                    ? `flex items-center p-2 text-base font-normal rounded-lg dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-l-4 hover:border-l-blue-800 group cursor-pointer ${(isActive === val.link || openSubMenu === val.title) && "bg-gray-200 border-l-4 border-l-blue-800 dark:bg-gray-600"}`
                    : "text-gray-900 dark:text-gray-400 p-2 cursor-pointer"
                }`}
                onClick={() => handleMenuItemClick(val)}
              > 
                <div className="relative flex items-center px-4 py-1 w-full">
                  <div className="mr-2">{val.icon}</div>
                  <div className="flex-grow ml-3 text-wrap">{val.title}</div>
                  {val.items && (
                    <icons.arrowDropDown
                      className={`transition-transform ${
                        openSubMenu === val.title ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  )}
                  {/* Dynamic badge rendering */}
                  {getBadgeCount(val.title) > 0 && (
                    <div className="absolute -left-2 -top-2 rounded-full bg-red-500 text-center text-white w-5 h-5 text-xs flex items-center justify-center">
                      {getBadgeCount(val.title)}
                    </div>
                  )}
                </div>
                {val.items && openSubMenu === val.title && (
                  <ul className="py-2 space-y-2">
                    {val.items.map((subVal, subKey) => (
                      <li
                        key={subKey}
                        className={`flex items-center p-2 pl-12 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 cursor-pointer
                        ${isActive === subVal.link && "bg-gray-200 dark:bg-gray-600 border-l-4 border-l-blue-800"}`}
                        onClick={() => handleSubMenuClick(subVal.link)}
                      >
                        <div className="flex items-center w-full">
                          <div className="flex-grow ml-3 text-gray-600 dark:text-gray-300">{subVal.title}</div>
                          {/* Badge for sub-menu items if needed */}
                          {getBadgeCount(subVal.title) > 0 && (
                            <div className="rounded-full bg-red-500 text-center text-white w-5 h-5 text-xs flex items-center justify-center">
                              {getBadgeCount(subVal.title)}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        
      </div>
    </div>
  );
}

export default Sidebar;