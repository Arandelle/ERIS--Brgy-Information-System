
import React, { useState, useEffect } from "react";

const DateToday = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [timeMessage, setTimeMessage] = useState("");

  useEffect(() => {
    const date = new Date();
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const formattedDate = date.toLocaleDateString(undefined, options);
    setCurrentDate(formattedDate);
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setTimeOfDay("morning");
      setTimeMessage("Goodmorning");
    } else if (hour >= 12 && hour < 18) {
      setTimeOfDay("afternoon");
      setTimeMessage("Goodafternoon");
    } else if (hour >= 18 && hour < 22) {
      setTimeOfDay("night");
      setTimeMessage("Goodevening");
    } else {
      setTimeOfDay("night");
      setTimeMessage("Goodnight");
    }
  }, []);

  const getIcon = () => {
    switch (timeOfDay) {
      case "morning":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6 text-yellow-300 dark:text-yellow-200"
          >
            <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
          </svg>
        );
      case "afternoon":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-10 text-purple-500 dark:text-purple-400"
          >
            <path
              fill-rule="evenodd"
              d="M4.5 9.75a6 6 0 0 1 11.573-2.226 3.75 3.75 0 0 1 4.133 4.303A4.5 4.5 0 0 1 18 20.25H6.75a5.25 5.25 0 0 1-2.23-10.004 6.072 6.072 0 0 1-.02-.496Z"
              clip-rule="evenodd"
            />
          </svg>
        );
      case "night":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6 text-primary-500 dark:text-primary-400"
          >
            <path
              fill-rule="evenodd"
              d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
              clip-rule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white px-4 border-l-4 border-l-primary-500 dark:border-l-primary-400 flex flex-row items-center py-4 mb-2 m-3 rounded-md dark:bg-gray-800">
      {timeOfDay && <div>{getIcon()}</div>}
      <div className="flex flex-col ml-3 text-gray-700 dark:text-gray-100 text-md">
        {timeMessage}, Arandelle!
        <span className=" font-thin text-sm text-gray-600 dark:text-gray-200">{currentDate}</span>
      </div>{" "}
    </div>
  );
};

export default DateToday;
