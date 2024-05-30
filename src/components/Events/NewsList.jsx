import React, { useEffect, useState, useRef } from "react";
import { Spinner } from "../Skeleton";
import { getTimeDifference } from "../../helper/TimeDiff";
import ContainerResizer from "../../helper/ContainerResizer";
import QuestionModal from "../ReusableComponents/QuestionModal";
import EmptyImage from "../../assets/emptyImage.svg"
import Question from "../../assets/question.svg"

const NewsList = ({ news, setNews, setMessage }) => {
  const [loading, setLoading] = useState(true);
  const { containerSize, containerRef } = ContainerResizer();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newsToDeleteId, setNewsToDeleteId] = useState(null);

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
      setMessage("Item Deleted");
      setNewsToDeleteId(null); // Reset the state
      setShowDeleteModal(false); // Close the modal
    } else {
      setMessage("No news items found to delete.");
    }
  };  

  return (
    <div
      className="bg-gray-50 dark:bg-gray-800 dark:text-gray-400 h-full rounded"
      ref={containerRef}
    >
      <div className="block py-2 px-4 text-base text-center font-semibold">
        Today's Activities
      </div>
      <div className="scrollable-container p-4 text-gray-700 overflow-y-auto max-h-screen">
      {loading ? (
          <div className="flex items-center justify-center py-3">
            <Spinner setLoading={setLoading} />
          </div>
        ) : news.length === 0 ? (
          <div className="text-center flex flex-col justify-center items-center text-gray-500 dark:text-gray-400">
           <img src={Question} alt="Empty Image"  className="h-[200px] w-[200px]" />
           No news yet
          </div>
        ) : (
          news.map((activity) => (
            <div key={activity.id} className="mb-4 border-b pb-4 ">
              <div>
              <div className={`flex justify-between ${containerSize === 'small' ? 'flex-col' : ''}`}>
                  <h3 className={`text-xl font-semibold mb-2 dark:text-green-500 ${containerSize === 'small' ? 'mb-0 text-md' : ''}`}>
                    {activity.title}
                  </h3>
                  <span className="text-primary text-sm text-nowrap">
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
                <button
                  className="text-red-500"
                  onClick={() => toggleDeleteModal(activity.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {showDeleteModal && (
        <QuestionModal
          toggleModal={toggleDeleteModal}
          question={ <span>Do you want to delete 
            <span className="text-primary text-bold"> {news.find(item => item.id === newsToDeleteId) ?.title}
              </span>  ? </span>}

          yesText={"Delete"}
          onConfirm={() => handleDelete(newsToDeleteId)}
        />
      )}
    </div>
  );
};

export default NewsList;
