import { formatDateWithTimeAndWeek, formatTime } from "../../helper/FormatDate";
import { EllipsisVertical } from "lucide-react";

export const MessageBubble = ({
  message,
  isOwn,
  prevTimestamp,
  openMenuId,
  setOpenMenuId,
  handleDeleteMsg,
  isLastMessage
}) => {
  const showOverallTimeStamp =
    !prevTimestamp || message.timestamp - prevTimestamp > 60 * 1000 * 30; //if  greater than 30 minutes or no prevTimestamp
  const showSpecificTimestamp =
    !prevTimestamp || message.timestamp - prevTimestamp > 60 * 1000 * 5; // 5 minutes

  const isOpenMenu = openMenuId === message.id; // flag to check if the menu is open for this message
  const handleMenuToggle = () => {
    if (isOpenMenu) {
      setOpenMenuId(null); // close the menu if it's already open
    } else {
      setOpenMenuId(message.id); // open the menu for this message
    }
  };

  // Function to render the message text
  const renderMessage = (message) => {
    if (message.isDeleted) {
      return (
        <div className="">
          <em>{message.text}</em> {/* "unsent a message" */}
        </div>
      );
    }
    return <div>{message.text}</div>;
  };

  const confirmDelete = (isDirectDelete = false) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      handleDeleteMsg(message.id, isDirectDelete);
      setOpenMenuId(null); // close the menu after deletion
    }
  };

  return (
    <>
      {showOverallTimeStamp && (
        <div className="flex items-center justify-center mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 px-3 py-1 rounded-full">
            {formatDateWithTimeAndWeek(message.timestamp)}
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
              <button onClick={() => handleMenuToggle(message.id)}
              onBlur={() => setOpenMenuId(null)}
              >
                <EllipsisVertical
                  size={16}
                  className={`text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 ${
                    isOwn ? "ml-2" : "mr-2"
                  }`}
                />
              </button>
              {isOpenMenu && (
                <div
                  className={`absolute ${isLastMessage ? "bottom-0" : "top-0"} ${
                    isOwn ? "right-4" : "left-4"
                  } w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10`}
                >
                  <ul className="py-1">
                    <li
                      onClick={() => console.log("Edit", message.id)}
                      className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      Edit
                    </li>
                    {!message.isDeleted && (
                      <li
                        onClick={() => confirmDelete(false)}
                        className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        Unsend
                      </li>
                    )}
                    <li
                      onClick={() => confirmDelete(true)}
                      className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700 cursor-pointer"
                    >
                     Delete for you
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
                {renderMessage(message)}
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-500 mt-1 px-2">
            {showSpecificTimestamp && formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </>
  );
};
