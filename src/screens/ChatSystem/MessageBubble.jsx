import { useRef, useState} from "react";
import { formatDateWithTimeAndWeek, formatTime } from "../../helper/FormatDate";
import { EllipsisVertical, CircleX } from "lucide-react";

export const MessageBubble = ({
  message,
  isOwn,
  prevTimestamp,
  openMenuId,
  setOpenMenuId,
  handleDeleteMsg,
  setText,
}) => {
  const showOverallTimeStamp =
    !prevTimestamp || message.timestamp - prevTimestamp > 60 * 1000 * 30; //if  greater than 30 minutes or no prevTimestamp
  const showSpecificTimestamp =
    !prevTimestamp || message.timestamp - prevTimestamp > 60 * 1000 * 5; // 5 minutes

  const buttonRef = useRef(null); // reference for the button to control menu position
  const [showMenuBelow, setShowMenuBelow] = useState(false); // state to control menu position

  const isOpenMenu = openMenuId === message.id; // flag to check if the menu is open for this message

  const handleMenuToggle = () => {
    if (isOpenMenu) {
      setOpenMenuId(null); // close the menu if it's already open
    } else {

      if(buttonRef.current){
        const buttonRect = buttonRef.current.getBoundingClientRect(); // get the button's position
        const windowHeight = window.innerHeight;

        if(buttonRect.top < 150){
          setShowMenuBelow(true); // show menu below if button is near the top
        } else if(windowHeight - buttonRect.bottom < 150){
          setShowMenuBelow(false); // show menu above if button is near the bottom
        } else{
          setShowMenuBelow(true); // default to showing menu below
        }
      }

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
              <button 
              ref={buttonRef}
              onClick={() => handleMenuToggle(message.id)}>
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
                    showMenuBelow ? "top-full mt-2" : "bottom-full mb-2"
                  } ${
                    isOwn ? "right-4" : "left-4"
                  } w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10`}
                >
                  {/**Close button */}
                  <button
                    onClick={() => setOpenMenuId(null)}
                    className={`absolute ${
                      isOwn ? "-top-2 -right-2" : "-top-2 -left-2"
                    } text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200`}
                  >
                    <CircleX size={16} />
                  </button>
                  <ul className="py-1">
                    <li
                      onClick={() => setText(message.text)}
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
