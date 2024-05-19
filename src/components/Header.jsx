import React, { useState } from 'react';
import Notification from "./Notification";
// import Menu from './Menu';
import Profile from './Admin/ProfileAdmin';
import logo from '../assets/logo.png';

const Header = ({ toggleSideBar }) => {
  
  const [isAuthenticated, setAuth] = useState(false);

  return (
    <div className="sticky top-0 z-50 px-4 lg:px-6 w-full py-2.5 border-b border-t border-gray-300 dark:border-gray-600 dark:bg-gray-800 bg-white">
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center">
          <button
            onClick={toggleSideBar}
            id="toggleSidebar"
            aria-expanded="true"
            aria-controls="sidebar"
            className="p-2 mr-3 text-gray-800 rounded cursor-pointer lg:inline hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
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
          <a href="https://eris-brgy-information-system.vercel.app/dashboard" className="flex mr-4">
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
        <button type="button" data-collapse-toggle="navbar-search" aria-controls="navbar-search" aria-expanded="false" class="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1">
      <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
      </svg>
      <span class="sr-only">Search</span>
    </button>
    <div class="relative hidden md:block">
      <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
        <span class="sr-only">Search icon</span>
      </div>
      <input type="text" id="search-navbar" class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..."/>
    </div>
         
          <div className="flex items-center space-x-2">
            <Notification />
            {/* <Menu /> */}
            <Profile setAuth={setAuth} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
