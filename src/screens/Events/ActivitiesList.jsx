import React, { useEffect, useState, useRef } from "react";
import { Spinner } from "../../components/ReusableComponents/Skeleton";
import { getTimeDifference } from "../../helper/TimeDiff";
import QuestionModal from "../../components/ReusableComponents/AskCard"
import Question from "../../assets/question.svg";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MoreVert from "@mui/icons-material/MoreVert"
import { formatDate } from "../../helper/FormatDate";
import { toast } from "sonner";

const actionButtons = [
  { title: "Delete" },
  { title: "Edit" },
  { title: "Archive" },
];
const ActivitiesList = ({ activity, setActivity, isFullscreen }) => {
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newsToDeleteId, setNewsToDeleteId] = useState(null);
  const [activeButtonId, setActiveButtonId] = useState(null);
  const containerRef = useRef(null);

  const toggleShowButtons = (id) => {
    setActiveButtonId((prevId) => (prevId === id ? null : id));
  };

  const handleButtons = (title, id) => {
    if (title === "Delete") {
      setNewsToDeleteId(id);
      setShowDeleteModal(!showDeleteModal);
    } else if (title === "Edit") {
      toast("edit");
    } else {
      toast("archive");
    }
  };
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
    toast.error(`deleted`)
  };

  return (
    <div
      className="bg-gray-50 dark:bg-gray-800 dark:text-gray-400 rounded-md shadow-md"
      ref={containerRef}
    >
      <div className="block py-2 px-3 text-base text-center font-semibold">
        List of Announcement
      </div>
      <div className="scrollable-container p-4 text-gray-700 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-3">
            <Spinner setLoading={setLoading} />
          </div>
        ) : activity.length === 0 ? (
          <div className="text-center flex flex-col justify-center items-center text-gray-500 dark:text-gray-400">
            <img
              src={Question}
              alt="Empty Image"
              className="h-[200px] w-[200px]"
            />
            No Announcement yet
          </div>
        ) : (
          activity.map((activity) => (
            <div key={activity.id} className={`mb-4 border-b pb-4`}>
              <div
                className={`flex justify-between ${
                  isFullscreen
                    ? "flex-row items-center "
                    : "flex-col items-left"
                }`}
              >
                <div className={`flex  ${isFullscreen ? "flex-col" : ""}`}>
                  <div
                    className={`flex font-semibold mb-2 dark:text-green-500 ${
                      isFullscreen ? "mb-0 text-md flex-col" : "flex-col"
                    }`}
                  >
                    <span
                      className={`flex items-center gap-2 ${
                        isFullscreen ? "flex-row text-lg" : "flex-row"
                      }`}
                    >
                      {activity.title}
                      <span className="text-primary-500 text-xs font-thin text-nowrap">
                        {getTimeDifference(activity.timestamp)}
                      </span>          
                    </span>
                    <span className="font-thin text-md">
                      {" "}
                      {formatDate(activity.startDate)}
                    </span>
                  </div>
                </div>
                <span>{activity.location}</span>
                <p className="text-gray-700 dark:text-gray-200">
                  {activity.description}
                </p>
                <span>
                  {activity.startTime} - {activity.endTime}
                </span>
                        {isFullscreen ?  <MoreHorizIcon
                          className="cursor-pointer hover:bg-gray-200 rounded-full"
                          onClick={() => toggleShowButtons(activity.id)}
                        />  :  <MoreVert
                        className="cursor-pointer"
                        onClick={() => toggleShowButtons(activity.id)}
                      />}
                        {activeButtonId === activity.id && (
                          <div className="z-10 absolute right-3 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                            <ul>
                              {actionButtons.map((button, key) => (
                                <button
                                  key={key}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                  onClick={() =>
                                    handleButtons(button.title, activity.id)
                                  }
                                >
                                  {button.title}
                                </button>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
              </div>
          )))}
      </div>
      {showDeleteModal && (
        <QuestionModal
          toggleModal={toggleDeleteModal}
          question={
            <span>
              Do you want to delete
              <span className="text-primary-500 text-bold">
                {" "}
                {activity.find((item) => item.id === newsToDeleteId)?.title}
              </span>{" "}
              ?{" "}
            </span>
          }
          yesText={"Delete"}
          onConfirm={() => handleDelete(newsToDeleteId)}
        />
      )}
    </div>
  );
};

export default ActivitiesList;
