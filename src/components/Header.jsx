import React, { useState } from 'react';
import Notification from "./Notification";
import Menu from './Menu';
import Profile from './Profile';
import logo from '../assets/logo.png';


const Header= ({toggleSideBar})=> {
   return (
      <div className="bg-dark border-green-400 px-8 lg:px-6 py-2.5 dark:bg-gray-800 bg-gray-800">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex justify-start items-center">
          <button
            onClick={toggleSideBar}
            id="toggleSidebar"
            aria-expanded="true"
            aria-controls="sidebar"
            className="hidden p-2 mr-3 text-green-100 rounded cursor-pointer lg:inline hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 12"
            >
              {" "}
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 1h14M1 6h14M1 11h7"
              />{" "}
            </svg>
          </button>
          <button
          onClick={toggleSideBar}
            aria-expanded="true"
            aria-controls="sidebar"
            className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer lg:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              className="w-[18px] h-[18px]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
            <span className="sr-only">Toggle sidebar</span>
          </button>
          <a href="https://flowbite.com" className="flex mr-4">
            <img
              src={logo}
              className="mr-3 h-12 p-0"
              alt="FlowBite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace- text-white dark:text-white">
              Bagtas
            </span>
          </a>
          <form action="#" method="GET" className="hidden lg:block lg:pl-2">
            <label htmlFor="topbar-search" className="sr-only">
              Search
            </label>
            <div className="relative mt-1 lg:w-96">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  {" "}
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />{" "}
                </svg>
              </div>
              <input
                type="text"
                name="email"
                id="topbar-search"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-9 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Search"
              />
            </div>
          </form>
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
          <Notification />
          <Menu />
          <Profile />
        </div>
      </div>
    </div>
   );
 }

export default Header;

