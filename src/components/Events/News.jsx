import React, { useState, useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar/Sidebar";
import { Toggle } from "../../hooks/Toggle";
// import NewsList from "./NewsList";
import { Spinner } from "../Skeleton";
import { getTimeDifference } from "../../helper/TimeDiff";
import { defaultNews } from "./NewsList";
import QuestionModal from "../Admin/QuestionModal";

const News = () => {
  const { isOpen, toggleDropdown } = Toggle();
  const [notAllowed, setNotAllowed] = useState(true);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setContent] = useState("");
  const [location, setPlace] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newsToDeleteId, setNewsToDeleteId] = useState(null);

  const toggleDeleteModal = (id) => {
    setNewsToDeleteId(id);
    setShowDeleteModal(!showDeleteModal);
  };

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
    setMessage("News item added successfully!");
  };

  const handleDelete = (id) => {
    const storedNews = localStorage.getItem("news"); {/*get the array data from local storage*/}
    if (storedNews) {
      const newsArray = JSON.parse(storedNews); {/**Parse the JSON string into an array: */}
      const updatedNewsArray = newsArray.filter((newsItem) => newsItem.id !== id); {/* filter for specific item */}
      {/*Save the updated array back tolocalStorage */}
      localStorage.setItem("news", JSON.stringify(updatedNewsArray)); 
      setNews(updatedNewsArray);
      setMessage("Item Deleted");
      setNewsToDeleteId(null); // Reset the state
      setToggleDelete(false); // Close the modal
    } else {
      setMessage("No news items found to delete.");
    }
  };

  return (
    <div className="w-full flex-col flex">
      <Header toggleSideBar={toggleDropdown} />
      <div className="flex">
        <div className="fixed z-50">
          <Sidebar isOpen={isOpen} toggleSidebar={toggleDropdown} />
        </div>
        <div className={`w-full ${isOpen ? "ml-0" : "md:ml-60"}`}>
          <div className="m-3">
            <div className="flex flex-col gap-4">
              <div className="grid justify-start grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-15 my-15 gap-4">
                <input
                  className={`w-full px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400 dark:placeholder:text-gray-50 dark:text-white dark:bg-gray-600
                    ${notAllowed ? "cursor-not-allowed" : "cursor-auto"}`}
                  type="text"
                  value={title}
                  placeholder="Event Title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  className={`w-full px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400 dark:placeholder:text-gray-50 dark:text-white dark:bg-gray-600
                    ${notAllowed ? "cursor-not-allowed" : "cursor-auto"}`}
                  type="text"
                  onFocus={(e) => (e.target.type = "time")}
                  onBlur={(e) => (e.target.type = "text")}
                  value={startTime}
                  placeholder="Start"
                  onChange={(e) => setStartTime(e.target.value)}
                />
                <input
                  className={`w-full px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400 dark:placeholder:text-gray-50 dark:text-white dark:bg-gray-600
                    ${notAllowed ? "cursor-not-allowed" : "cursor-auto"}`}
                  type="text"
                  onFocus={(e) => (e.target.type = "time")}
                  onBlur={(e) => (e.target.type = "text")}
                  value={endTime}
                  placeholder="End"
                  onChange={(e) => setEndTime(e.target.value)}
                />
                <input
                  className={`w-full px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400 dark:placeholder:text-gray-50 dark:text-white dark:bg-gray-600
                    ${notAllowed ? "cursor-not-allowed" : "cursor-auto"}`}
                  type="text"
                  value={location}
                  placeholder="Place"
                  onChange={(e) => setPlace(e.target.value)}
                />
              </div>
              <div>
                <textarea
                  className={`w-full relative z-1 px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-gray-400 dark:placeholder:text-gray-50 dark:text-white dark:bg-gray-600 ${
                    notAllowed ? "cursor-not-allowed" : "cursor-auto"
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
              {message && (
                <div className="mt-4 p-2 bg-green-500 text-white rounded-md">
                  {message}
                </div>
              )}
              <div>
                <div className="scrollable-container p-4 text-gray-700 overflow-y-auto max-h-screen">
                  {[...defaultNews, ...news].map((activity) => (
                    <div key={activity.id} className="mb-4 border-b pb-4 ">
                      {loading ? (
                        <div className="flex items-center justify-center py-3">
                          <Spinner setLoading={setLoading} />
                        </div>
                      ) : (
                        <div>
                          <div className={`flex justify-between`}>
                            <h3
                              className={`text-xl font-semibold mb-2 dark:text-green-500`}
                            >
                              {activity.title}
                            </h3>
                            <span className="text-primary text-sm text-nowrap">
                              {" "}
                              Posted {getTimeDifference(activity.timestamp)}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-200">
                            {activity.description}
                          </p>
                          <div className="flex justify-between mt-2 text-gray-500 dark:text-gray-400">
                            <span>
                              {activity.startTime} - {activity.endTime}
                            </span>
                            <span>{activity.location}</span>
                          </div>
                          <button className="text-red-500" onClick={() => toggleDeleteModal(activity.id)}>Delete</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {showDeleteModal && ( <QuestionModal toggleModal={toggleDeleteModal} question={"Delete this Item"} yesText={"Delete"}
                onConfirm={() => handleDelete(newsToDeleteId)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>  
  );
};

export default News;
