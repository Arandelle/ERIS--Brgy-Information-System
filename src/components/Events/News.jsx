import React, { useState, useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar/Sidebar";
import { Toggle } from "../../hooks/Toggle";
import NewsList from "./NewsList";
import InputReusable from "../ReusableComponents/InputReusable";

const News = () => {
  const { isOpen, toggleDropdown } = Toggle();
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setContent] = useState("");
  const [location, setPlace] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notAllowed, setNotAllowed] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setNotAllowed(false);
    }, 2000);
  }, []);
  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const [news, setNews] = useState(() => {
    // Get the news data from localStorage, or an empty array if it doesn't exist
    const storedNews = localStorage.getItem("news");
    return storedNews ? JSON.parse(storedNews) : [];
  });

  useEffect(() => {
    // Save the news data to localStorage whenever it changes
    localStorage.setItem("news", JSON.stringify(news));
  }, [news]);

  const handleAddNews = () => {
    if (!title || !description || !location || !startTime || !endTime) {
      alert("Please complete the form");
      return;
    }

    const addedNews = {
      id: Date.now(), // Generate a unique ID for the new activity
      title,
      startTime,
      endTime,
      location,
      description,
      timestamp: new Date().toISOString(), // Add a timestamp
    };

    setNews((prevNews) => [...prevNews, addedNews]);

    // Update localStorage with the updated news data
    setTitle("");
    setStartTime("");
    setEndTime("");
    setPlace("");
    setContent("");
    setMessage("Submitted successfully");
  };

  return (
    <div className="w-full flex-col flex">
      <Header toggleSideBar={toggleDropdown} />
      {message && (
        <div className="flex justify-center items-center">
          <div
            className="flex absolute z-50 justify-center items-center p-2 mb-4 mt-4 text-sm text-blue-500 rounded-lg bg-blue-200 dark:bg-gray-600 dark:text-green-500"
            role="alert"
          >
            <svg
              className="flex-shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            {message}
          </div>
        </div>
      )}
      <div className="flex">
        <div className="fixed z-50">
          <Sidebar isOpen={isOpen} toggleSidebar={toggleDropdown} />
        </div>
        <div className={`w-full ${isOpen ? "ml-0" : "md:ml-60"}`}>
          <div className="m-3">
            <div className="flex flex-col gap-4">
              <div className="grid justify-start grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-15 my-15 gap-4">
                <InputReusable
                  type="text"
                  value={title}
                  placeholder="Event Title"
                  onChange={(e) => setTitle(e.target.value)}
                  notAllowed={notAllowed}
                />
                <InputReusable
                  type="text"
                  onFocus={(e) => (e.target.type = "time")}
                  onBlur={(e) => (e.target.type = "text")}
                  value={startTime}
                  placeholder="Start"
                  onChange={(e) => setStartTime(e.target.value)}
                  notAllowed={notAllowed}
                />
                <InputReusable
                  type="text"
                  onFocus={(e) => (e.target.type = "time")}
                  onBlur={(e) => (e.target.type = "text")}
                  value={endTime}
                  placeholder="End"
                  onChange={(e) => setEndTime(e.target.value)}
                  notAllowed={notAllowed}
                />
                <InputReusable
                  type="text"
                  value={location}
                  placeholder="Place"
                  onChange={(e) => setPlace(e.target.value)}
                  notAllowed={notAllowed}
                />
              </div>
              <div>
                <textarea
                  className={`w-full relative z-1 px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-gray-400 dark:placeholder:text-gray-50 dark:text-white dark:bg-gray-600 ${
                    notAllowed ? "cursor-wait" : "cursor-auto"
                  }`}
                  value={description}
                  placeholder="Description"
                  onChange={(e) => setContent(e.target.value)}
                />
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                  onClick={handleAddNews}
                >
                  Submit
                </button>
              </div>
                <NewsList news={news} setNews={setNews} setMessage={setMessage}/>
            </div>
          </div>
        </div>
      </div>
    </div>  
  );
};

export default News;
