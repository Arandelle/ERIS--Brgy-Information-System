import React, { useState } from "react";

const NewsList = ({news: initialNews}) => {
 
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
    <div className="bg-gray-50 dark:bg-gray-800 dark:text-gray-400 h-full rounded">
      <div className="block py-2 px-4 text-base font-medium text-center">
        Today's Activities
      </div>
      <div className="p-4 text-gray-700 ">
        {[...defaultNews, ...news].map((activity) => (
          <div key={activity.id} className="mb-4 border-b pb-4 ">

            <h3 className="text-xl font-semibold mb-2 dark:text-green-500">{activity.title}</h3>
            <p className="text-gray-700 dark:text-gray-200">{activity.description}</p>

            <div className="flex justify-between mt-2 text-gray-500 dark:text-gray-400">
              <span>{activity.startTime} - {activity.endTime}</span>
              <span>{activity.location}</span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsList;
