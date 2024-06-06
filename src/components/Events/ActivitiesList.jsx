import React, { useEffect, useState, useRef } from "react";
import { Spinner } from "../ReusableComponents/Skeleton";
import { getTimeDifference } from "../../helper/TimeDiff";
import QuestionModal from "../ReusableComponents/AskCard";
import BtnReusable from "../ReusableComponents/BtnReusable";
import Question from "../../assets/question.svg"
import { toast } from "sonner";

const ActivitiesList = ({ news, setNews,isFullscreen }) => {
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newsToDeleteId, setNewsToDeleteId] = useState(null);
  const containerRef = useRef(null);

  const toggleDeleteModal = (id) => {
    setNewsToDeleteId(id);
    setShowDeleteModal(!showDeleteModal);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handleDelete = (id) => {
    const storedNews = localStorage.getItem("news"); {/*get the array data from local storage*/}
    if (storedNews) {
      const newsArray = JSON.parse(storedNews); {/**Parse the JSON string into an array: */}
      const updatedNewsArray = newsArray.filter((newsItem) => newsItem.id !== id); {/* filter for specific item */}
      {/*Save the updated array back tolocalStorage */}
      localStorage.setItem("news", JSON.stringify(updatedNewsArray)); 
      setNews(updatedNewsArray);
      toast.error("Item Deleted");
      setNewsToDeleteId(null); // Reset the state
      setShowDeleteModal(false); // Close the modal
    } else {
      toast("No news items found to delete.");
    }
  };  

  return (
    <div
      className="bg-gray-50 dark:bg-gray-800 dark:text-gray-400 rounded-md shadow-md"
      ref={containerRef}
    >
      <div className="block py-2 px-3 text-base text-center font-semibold">
        Today's Activities
      </div>
      <div className="scrollable-container p-4 text-gray-700 overflow-y-auto">
      {loading ? (
          <div className="flex items-center justify-center py-3">
            <Spinner setLoading={setLoading} />
          </div>
        ) : news.length === 0 ? (
          <div className="text-center flex flex-col justify-center items-center text-gray-500 dark:text-gray-400">
           <img src={Question} alt="Empty Image"  className="h-[200px] w-[200px]" />
           No Activities yet
          </div>
        ) : (
          news.map((activity) => (
            <div key={activity.id} className="mb-4 border-b pb-4 ">
              <div>
              <div className={`flex justify-between ${isFullscreen ? 'flex-col' : ''}`}>
                  <h3 className={`text-xl font-semibold mb-2 dark:text-green-500 ${isFullscreen ? 'mb-0 text-md' : ''}`}>
                    {activity.title}
                  </h3>
                  <span className="text-primary-500 text-sm text-nowrap">
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
                <BtnReusable
                  value={"Delete"}
                  type="delete"
                  onClick={() => toggleDeleteModal(activity.id)}
                />
              </div>
            </div>
          ))
        )}
      </div>
      {showDeleteModal && (
        <QuestionModal
          toggleModal={toggleDeleteModal}
          question={ <span>Do you want to delete 
            <span className="text-primary-500 text-bold"> {news.find(item => item.id === newsToDeleteId) ?.title}
              </span>  ? </span>}

          yesText={"Delete"}
          onConfirm={() => handleDelete(newsToDeleteId)}
        />
      )}
    </div>
  );
};

export default ActivitiesList;
