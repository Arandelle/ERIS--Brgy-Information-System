import { Toggle } from "../hooks/Toggle";
import { useEffect, useRef } from 'react';
import '../index.css'

const Notification = ()=>{
  const dropdownRef = useRef(null);
    const {isOpen, toggleDropdown} = Toggle();

    return (
        <div>
          <div className="relative">
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
          
          </div>
          {isOpen && (
              <div
                className="absolute z-10 h-screen right-0 mt-3 w-full md:right-2  md:w-80 bg-white dark:bg-gray-700 rounded-md shadow-lg"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {/* Notification items go here */}
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 hover:rounded-md"
                  role="menuitem"
                >
                  Notification 1
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600  hover:rounded-md"
                  role="menuitem"
                >
                  Notification 2
                </a>
                {/* Add more notification items as needed */}
              </div>
            )}
        </div>
      );
}
export default Notification;