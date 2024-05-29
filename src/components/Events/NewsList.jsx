import React, { useEffect, useState, useRef } from "react";
import { Spinner } from "../Skeleton";
import { getTimeDifference } from "../../helper/TimeDiff";
import ContainerResizer from "../../helper/ContainerResizer";

export const defaultNews = [
  {
    id: 1,
    title: "Community Cleanup Drive",
    description:
      "Join us in cleaning up our barangay! Bring gloves and garbage bags.",
    startTime: "9:00",
    endTime: "12:00",
    location: "Barangay Hall",
  },
  {
    id: 2,
    title: "Free Medical Checkup",
    description:
      "Free medical checkup for all residents. Services include basic checkup and consultations.",
    startTime: "14:00",
    endTime: "18:00",
    location: "Barangay Health Center",
  },
  // Add more activities as needed
];

const NewsList = ({news}) => {
  
const [loading, setLoading] = useState(true);
const {containerSize, containerRef }= ContainerResizer();

 useEffect(()=>{
    setTimeout(()=>{
      setLoading(false);
    },2000)
 },[])

  const handleDelete = (id) => {
    const storedNews = localStorage.getItem("news");
    if (storedNews) {
      const newsArray = JSON.parse(storedNews);
      const updatedNewsArray = newsArray.filter((newsItem) => newsItem.id !== id);
      localStorage.setItem("news", JSON.stringify(updatedNewsArray));
      setNews(updatedNewsArray);
      setMessage("News item deleted successfully!");
    } else {
      setMessage("No news items found to delete.");
    }
  };
  return (
    <div className="bg-gray-50 dark:bg-gray-800 dark:text-gray-400 h-full rounded"  ref={containerRef}>
      <div className="block py-2 px-4 text-base text-center font-semibold">
        Today's Activities
      </div>
        <div className="scrollable-container p-4 text-gray-700 overflow-y-auto max-h-screen">
        {[...defaultNews, ...news].map((activity) => (
          <div key={activity.id} className="mb-4 border-b pb-4 ">
             {loading ? (<div className="flex items-center justify-center py-3">
               <Spinner setLoading={setLoading}/>
             </div>) :  (        
            <div>
              <div className={`flex justify-between ${containerSize === 'small' ? 'flex-col' : ''}`}>
                <h3 className={`text-xl font-semibold mb-2 dark:text-green-500 ${containerSize === 'small' ? 'mb-0 text-md' : ''}`}>{activity.title}</h3>
                <span className="text-primary text-sm text-nowrap"> Posted {getTimeDifference(activity.timestamp)}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-200">{activity.description}</p>
              <div className="flex justify-between mt-2 text-gray-500 dark:text-gray-400">
                <span>{activity.startTime} - {activity.endTime}</span>
                <span>{activity.location}</span>
              </div>
              <button onClick={() => handleDelete(activity.id)}>Delete</button>
            </div>
            )}
          </div>
          ))}
      </div>
      
    </div>
  );
};

export default NewsList;
