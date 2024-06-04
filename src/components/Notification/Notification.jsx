import { Toggle } from "../../hooks/Toggle";
import { useEffect, useRef } from 'react';
import { PopoverHover } from "../ReusableComponents/Popover";
import { NotificationData } from "./NotificationData";

const Notification = ()=>{
  const dropdownRef = useRef(null);
    const {isOpen, toggleDropdown} = Toggle();

    return (    
        <div>      
          <div className="relative z-50">
          <PopoverHover content={`${isOpen ? "Close" : "Open"} Notification`}>
            <button
              onClick={toggleDropdown}
              type="button"
              data-dropdown-toggle="notification-dropdown"
              className="p-2 mr-1 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <span className="sr-only">View notifications</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 14 20"
              >
                <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z" />
              </svg>
            </button>
            </PopoverHover>        
          </div>
          {isOpen && (
              <div
                className="fixed h-screen right-0 mt-3 w-screen md:w-80 bg-white dark:bg-gray-700 rounded-md shadow-
                z-10 my-4 text-base list-none shadow-lg dark:divide-gray-600 "
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {/* Notification items go here */}
                <div class="block py-2 px-4 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      Notifications
                  </div>
                  {NotificationData.map((val, key) => (
                      <a key={key} href="#" class="flex py-3 px-4 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600">
                      <div class="flex-shrink-0">
                      <img class="w-11 h-11 rounded-full" src={val.img} alt="Bonnie Green avatar"/>
                      </div>
                      <div class="pl-3 w-full">
                          <div class="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">{val.message}{val.location} <span class="font-semibold text-gray-900 dark:text-white">{val.name}</span></div>
                          <div class="text-xs font-medium text-primary-500 dark:text-primary-400">{val.time}</div>
                      </div>
                  </a>
                  ))}
                  <a href="#" class="block py-2 text-base font-medium text-center text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                      <div class="inline-flex items-center ">
                      <svg aria-hidden="true" class="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path></svg>
                      View all
                      </div>
                  </a>
              </div>        
            )}      
        </div>
       
      );
}
export default Notification;