import React, { useState, useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar/Sidebar";
import { Toggle } from "../../hooks/Toggle";
import ActivitiesList from "./ActivitiesList";
import InputReusable from "../ReusableComponents/InputReusable";
import MsgReusable from "../ReusableComponents/MsgReusable";
import BtnReusable from "../ReusableComponents/BtnReusable";
const Activities = () => {
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
          <MsgReusable message={message} type={message.includes('successfully') ? "success" : "delete" }/>
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
                  placeholder="Start Time"
                  onChange={(e) => setStartTime(e.target.value)}
                  notAllowed={notAllowed}
                />
                <InputReusable
                  type="text"
                  onFocus={(e) => (e.target.type = "time")}
                  onBlur={(e) => (e.target.type = "text")}
                  value={endTime}
                  placeholder="End Time"
                  onChange={(e) => setEndTime(e.target.value)}
                  notAllowed={notAllowed}
                />
                <InputReusable
                  type="text"
                  value={location}
                  placeholder="Location"
                  onChange={(e) => setPlace(e.target.value)}
                  notAllowed={notAllowed}
                />
              </div>
              <div>
                <textarea
                  className={`w-full relative z-1 px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-gray-400 dark:placeholder:text-gray-200 dark:text-gray-200 dark:bg-gray-600 ${
                    notAllowed ? "cursor-wait" : "cursor-auto"
                  }`}
                  value={description}
                  placeholder="Description"
                  onChange={(e) => setContent(e.target.value)}
                />
                <BtnReusable
                value={"Submit"}
                type={"add"}
                onClick={handleAddNews}
                />
              </div>
                <ActivitiesList news={news} setNews={setNews} setMessage={setMessage}/>
            </div>
          </div>
        </div>
      </div>
    </div>  
  );
};

export default Activities;
