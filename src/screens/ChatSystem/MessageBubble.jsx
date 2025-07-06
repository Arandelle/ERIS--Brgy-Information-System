import { useRef, useState, useEffect } from "react";
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
    !prevTimestamp || message.timestamp - prevTimestamp > 60 * 1000 * 30;
  const showSpecificTimestamp =
    !prevTimestamp || message.timestamp - prevTimestamp > 60 * 1000 * 5;

  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const [showMenuBelow, setShowMenuBelow] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const isOpenMenu = openMenuId === message.id;

  // Check if screen is small
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768); // md breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Calculate menu position
  const calculateMenuPosition = () => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    
    let showBelow = true;
    let menuLeft = 0;
    let menuTop = 0;

    // Vertical positioning
    if (buttonRect.top < 150) {
      showBelow = true;
      menuTop = buttonRect.bottom + 8;
    } else if (windowHeight - buttonRect.bottom < 300) {
      showBelow = false;
      menuTop = buttonRect.top - 8;
    } else {
      showBelow = true;
      menuTop = buttonRect.bottom + 8;
    }

    // Horizontal positioning for small screens
    if (isSmallScreen) {
      // Center the menu or position it to avoid overflow
      const menuWidth = 192; // w-48 = 12rem = 192px
      
      if (windowWidth < menuWidth + 32) {
        // Very small screen - make menu full width with padding
        menuLeft = 16;
      } else {
        // Center the menu horizontally
        menuLeft = Math.max(16, Math.min(
          windowWidth - menuWidth - 16,
          buttonRect.left + buttonRect.width / 2 - menuWidth / 2
        ));
      }
    } else {
      // Desktop positioning
      if (isOwn) {
        menuLeft = buttonRect.right - 192; // Align to right edge
      } else {
        menuLeft = buttonRect.left; // Align to left edge
      }
    }

    setShowMenuBelow(showBelow);
    setMenuPosition({ top: menuTop, left: menuLeft });
  };

  const handleMenuToggle = () => {
    if (isOpenMenu) {
      setOpenMenuId(null);
    } else {
      calculateMenuPosition();
      setOpenMenuId(message.id);
    }
  };

  // Recalculate position on window resize
  useEffect(() => {
    if (isOpenMenu) {
      calculateMenuPosition();
    }
  }, [isOpenMenu, isSmallScreen]);

  const renderMessage = (message) => {
    if (message.isDeleted) {
      return (
        <div className="">
          <em>{message.text}</em>
        </div>
      );
    }
    return <div>{message.text}</div>;
  };

  const confirmDelete = (isDirectDelete = false) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      handleDeleteMsg(message.id, isDirectDelete);
      setOpenMenuId(null);
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
                onClick={handleMenuToggle}
              >
                <EllipsisVertical
                  size={16}
                  className={`text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 ${
                    isOwn ? "ml-2" : "mr-2"
                  }`}
                />
              </button>
              
              {/* Menu Portal for small screens */}
              {isOpenMenu && isSmallScreen && (
                <div
                  ref={menuRef}
                  className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
                  style={{
                    top: `${menuPosition.top}px`,
                    left: `${menuPosition.left}px`,
                    width: window.innerWidth < 224 ? `${window.innerWidth - 32}px` : '192px',
                    maxWidth: 'calc(100vw - 32px)'
                  }}
                >
                  {/* Close button */}
                  <button
                    onClick={() => setOpenMenuId(null)}
                    className="absolute -top-2 -right-2 text-red-500 dark:text-red-300 hover:text-gray-700 dark:hover:text-gray-200 bg-white dark:bg-gray-800 rounded-full p-1"
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

              {/* Regular menu for larger screens */}
              {isOpenMenu && !isSmallScreen && (
                <div
                  className={`absolute ${
                    showMenuBelow ? "top-full mt-2" : "bottom-full mb-2"
                  } ${
                    isOwn ? "right-4" : "left-4"
                  } w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10`}
                >
                  <button
                    onClick={() => setOpenMenuId(null)}
                    className={`absolute ${
                      isOwn ? "-top-2 -right-2" : "-top-2 -left-2"
                    } text-red-500 dark:text-red-300 hover:text-gray-700 dark:hover:text-gray-200`}
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