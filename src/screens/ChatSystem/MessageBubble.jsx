import { formatDateWithTimeAndWeek, formatTime } from "../../helper/FormatDate";
import { EllipsisVertical } from "lucide-react";
import handleEditData from "../../hooks/handleEditData";

export const MessageBubble = ({
  text,
  isOwn,
  timestamp,
  messageId,
  prevTimestamp,
  openMenuId,
  setOpenMenuId,
  handleDeleteMsg,
}) => {
  const showOverallTimeStamp =
    !prevTimestamp || timestamp - prevTimestamp > 60 * 1000 * 30; //if  greater than 30 minutes or no prevTimestamp
  const showSpecificTimestamp =
    !prevTimestamp || timestamp - prevTimestamp > 60 * 1000 * 5; // 5 minutes

  const isOpenMenu = openMenuId === messageId; // flag to check if the menu is open for this message
  const handleMenuToggle = () => {
    if (isOpenMenu) {
      setOpenMenuId(null); // close the menu if it's already open
    } else {
      setOpenMenuId(messageId); // open the menu for this message
    }
  };
  
  const confirmDelete = () => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      handleDeleteMsg(messageId);
      setOpenMenuId(null); // close the menu after deletion
    }
  }

  return (
    <>
      {showOverallTimeStamp && (
        <div className="flex items-center justify-center mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 px-3 py-1 rounded-full">
            {formatDateWithTimeAndWeek(timestamp)}
          </span>
        </div>
      )}
      <div
        className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2 px-4`}
      >
        <div
          className={`flex flex-col max-w-xs lg:max-w-lg text-wrap ${
            isOwn ? "items-end" : "items-start"
          }`}
        >
          <div
            className={`flex items-center ${
              isOwn ? "flex-row" : "flex-row-reverse"
            } space-x-3`}
          >
            <div className="relative">
              <button onClick={() => handleMenuToggle(messageId)}>
                <EllipsisVertical
                  size={16}
                  className={`text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 ${
                    isOwn ? "ml-2" : "mr-2"
                  }`}
                />
              </button>
              {isOpenMenu && (
                <div
                  className={`absolute ${
                    isOwn ? "right-0" : "left-0"
                  } mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10`}
                >
                  <ul className="py-1">
                    <li
                      onClick={() => console.log("Edit", messageId)}
                      className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      Edit
                    </li>
                    <li
                      onClick={confirmDelete}
                      className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700 cursor-pointer"
                    >
                      Delete
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div
              className={`px-4 py-2 rounded-2xl relative ${
                isOwn
                  ? "bg-blue-500 dark:bg-blue-600 text-white dark:text-gray-100 rounded-br-sm"
                  : "bg-gray-100 dark:bg-gray-200 text-gray-800 rounded-bl-md"
              } shadow-sm`}
            >
              <p className="text-sm leading-relaxed break-words overflow-hidden max-w-lg">
                {text}
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-500 mt-1 px-2">
            {showSpecificTimestamp && formatTime(timestamp)}
          </span>
        </div>
      </div>
    </>
  );
};
