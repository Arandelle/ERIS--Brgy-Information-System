import React, {useState} from "react";
import logo from '../assets/logo.png'
import '../index.css'

const Notification = ()=>{
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }   
    return (
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-800"
          >
         
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
          {isOpen && (
            <div
              className="absolute right-0 mt-2 w-80 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {/* Notification items go here */}
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Notification 1
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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