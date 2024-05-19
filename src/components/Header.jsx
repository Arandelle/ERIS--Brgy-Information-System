import React, { useState, useEffect } from "react";
import Notification from "./Notification";
// import Menu from './Menu';
import Profile from "./Admin/ProfileAdmin";
import logo from "../assets/logo.png";

const Header = ({ toggleSideBar }) => {
  const [isAuthenticated, setAuth] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Check system preference for dark mode
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    } else if (systemPrefersDark) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  };

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
          <a
            href="https://eris-brgy-information-system.vercel.app/dashboard"
            className="flex mr-4"
          >
            <img
              src={logo}
              className="mr-3 h-10 lg:h-12 p-0"
              alt="FlowBite Logo"
            />
            <span className="self-center text-lg lg:text-2xl font-semibold text-gray-800 dark:text-white">
              Bagtas
            </span>
          </a>
        </div>
        <div className="flex items-center lg:order-2">
          <button
            type="button"
            data-collapse-toggle="navbar-search"
            aria-controls="navbar-search"
            aria-expanded="false"
            class="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1"
          >
            <svg
              class="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span class="sr-only">Search</span>
          </button>
          <label class="inline-flex items-center cursor-pointer">
            <input
              onClick={toggleTheme}
              type="checkbox"
              value=""
              class="sr-only peer"
            />
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span class="ms-3 sr-only text-sm font-medium text-gray-900 dark:text-gray-300">
              Choose Theme
            </span>
          </label>
          <div class="relative mr-3 hidden md:block">
            <form action="#" method="GET" class="hidden lg:block lg:pl-2">
              <label for="topbar-search" class="sr-only">
                Search
              </label>
              <div class="relative mt-1 lg:w-96">
                <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg
                    class="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    {" "}
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />{" "}
                  </svg>
                </div>
                <input
                  type="text"
                  name="email"
                  id="topbar-search"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-9 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Search"
                />
              </div>
            </form>
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
};

export default Header;
