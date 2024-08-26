import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AllData } from "../../data/AllData";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Question from "../../assets/question.svg";
import EmptyLogo from "../ReusableComponents/EmptyLogo";

const SearchInput = ({ isOpen, className }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResults] = useState([]);
  const [noData, setNoData] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [inputValue, setInputValue] = useState("");

  const navigate = useNavigate();

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setInputValue(query);

    const result = AllData.filter((item) =>
      item.title.toLowerCase().includes(query)
    ).sort((a, b) => a.title.localeCompare(b.title));
    setSearchResults(result);

    if (result.length === 0) {
      setNoData(true);
    } else {
      setNoData(false);
    }
  };

  const handleNavigate = (link) => {
    navigate(link);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setFocusedIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % searchResult.length;
        setInputValue(searchResult[nextIndex].title);
        return nextIndex;
      });
    } else if (e.key === "ArrowUp") {
      setFocusedIndex((prevIndex) => {
        const nextIndex =
          (prevIndex + searchResult.length - 1) % searchResult.length;
        setInputValue(searchResult[nextIndex].title);
        return nextIndex;
      });
    } else if (e.key === "Enter") {
      if (focusedIndex >= 0 && focusedIndex < searchResult.length) {
        handleNavigate(searchResult[focusedIndex].link);
      }
    }
  };

  return (
    <>
      <div class="relative mr-3">
        <form
          action="#"
          method="GET"
          className={isOpen ? className : "hidden md:block"}
          autoComplete="off"
        >
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
              value={inputValue}
              onChange={handleSearch}
              id="topbar-search"
              class={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-9 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
              placeholder="Search"
              autocomplete="off"
              onKeyDown={handleKeyDown}
            />
          </div>
        </form>

        {searchQuery && (
          <div
            class={`scrollable-container absolute py-2 z-50 bg-white dark:bg-gray-600 max-h-72 overflow-y-auto w-full shadow-lg rounded-sm left-1/2 transform -translate-x-1/2 top-full mt-1 flex flex-col ${
              isOpen ? className : "hidden md:block"
            }`}
          >
            {noData && (
             <EmptyLogo message={"No data found"}/>         
            )}
            {searchResult.map((item, index) => (
              <div
                className="px-2 py-[4px] cursor-pointer"
                key={index}
                onClick={() => handleNavigate(item.link)}
              >
                <p
                  className={`px-2 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 hover:dark:text-gray-900 hover:dark:bg-primary-400 hover:bg-primary-500 text-sm text-start rounded-md hover:text-white cursor-pointer ${
                    focusedIndex === index ? "bg-primary-500 dark:bg-primary-600 text-white" : ""
                  }`}
                >
                  <div className="flex justify-between items-center">
                    {item.title}
                    <span>
                      <ArrowRightIcon />
                    </span>
                  </div>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchInput;
