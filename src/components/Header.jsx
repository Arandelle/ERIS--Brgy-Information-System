import React, { useState } from 'react';
import Notification from "./Notification";
import Menu from './Menu';
import Profile from './Admin/ProfileAdmin';
import logo from '../assets/logo.png';

const Header = ({ toggleSideBar }) => {
  return (
    <div className=" border-green-400 px-4 lg:px-6 w-full py-2.5 dark:bg-gray-800 bg-gray-800">
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center">
          <button
            onClick={toggleSideBar}
            id="toggleSidebar"
            aria-expanded="true"
            aria-controls="sidebar"
            className="p-2 mr-3 text-green-100 rounded cursor-pointer lg:inline hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 12"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 1h14M1 6h14M1 11h7"
              />
            </svg>
          </button>
          <a href="https://flowbite.com" className="flex mr-4">
            <img
              src={logo}
              className="mr-3 h-10 lg:h-12 p-0"
              alt="FlowBite Logo"
            />
            <span className="self-center text-lg lg:text-2xl font-semibold text-white dark:text-white">
              Bagtas
            </span>
          </a>
        </div>
        <div className="flex items-center lg:order-2">
          <button
            id="toggleSidebarMobileSearch"
            type="button"
            className="p-2 text-gray-500 rounded-lg lg:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Search</span>
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </button>
          <div className="flex items-center space-x-2">
            <Notification />
            {/* <Menu /> */}
            <Profile />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
