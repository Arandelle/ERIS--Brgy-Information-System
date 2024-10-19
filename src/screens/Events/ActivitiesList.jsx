import React, { useEffect, useState, useRef } from "react";
import { Spinner } from "../../components/ReusableComponents/Skeleton";
import { getTimeDifference } from "../../helper/TimeDiff";
import QuestionModal from "../../components/ReusableComponents/AskCard"
import Question from "../../assets/images/question.svg";
import { formatDate } from "../../helper/FormatDate";
import { toast } from "sonner";
import Table from "../../components/Table";
import icons from "../../assets/icons/Icons";

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
    <Table 
      
    /> 
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
