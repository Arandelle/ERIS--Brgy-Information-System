import React, { useEffect, useState, useRef } from "react";
import { Spinner } from "../Skeleton";

const NewsList = ({news: initialNews}) => {

  const getTimeDifference = (timestamp) => {
    const now = new Date();
    const addedTime = new Date(timestamp);
    const diff = Math.floor((now - addedTime) / 1000); // Difference in seconds
  
    if (diff < 60) return `${diff} seconds ago`;
    const diffInMinutes = Math.floor(diff / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };  
  
 const [loading, setLoading] = useState(true);
 const [containerSize, setContainerSize] = useState('large');
  const containerRef = useRef(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      const newContainerSize = entries[0].contentRect.width < 500 ? 'small' : 'large';
      setContainerSize(newContainerSize);
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);


 useEffect(()=>{
    setTimeout(()=>{
      setLoading(false);
    },2000)
 },[])



  const defaultNews = [
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
  const [news, setNews] = useState(initialNews || []);
  const addActivity = (newActivity) => {
    setNews([...news, newActivity]);
  };
 
  return (
    <div className="bg-gray-50 dark:bg-gray-800 dark:text-gray-400 h-full rounded"  ref={containerRef}>
      <div className="block py-2 px-4 text-base font-medium text-center font-semibold">
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
                <h3 className={`text-xl font-semibold mb-2 dark:text-green-500 ${containerSize === 'small' ? 'mb-0 text-md text-center' : ''}`}>{activity.title}</h3>
                <span className="text-primary text-sm text-nowrap"> Posted {getTimeDifference(activity.timestamp)}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-200">{activity.description}</p>
              <div className="flex justify-between mt-2 text-gray-500 dark:text-gray-400">
                <span>{activity.startTime} - {activity.endTime}</span>
                <span>{activity.location}</span>
              </div>
            </div>
            )}
          </div>
          ))}
      </div>
      
    </div>
  );
};

export default NewsList;
