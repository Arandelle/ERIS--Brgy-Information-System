import { Toggle } from "../hooks/Toggle";
import { Tooltip } from "@mui/material";
import { useState, useEffect } from "react";
import { auth, database } from "../services/firebaseConfig";
import { ref, onValue, update } from "firebase/database";
import { getTimeDifference } from "../helper/TimeDiff";
import { formatDate } from "../helper/FormatDate";
import { useFetcher, useNavigate } from "react-router-dom";
import EmptyLogo from "../components/ReusableComponents/EmptyLogo";
import { toast } from "sonner";
import {useFetchData} from "../hooks/useFetchData"

const Notification = () => {
  const [notificationBadge, setNotificationBadge] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [openedNotifications, setOpenedNotifications] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const { isOpen, toggleDropdown } = Toggle();

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const notificationRef = ref(database, `admins/${user.uid}/notifications`);

      // Listen for changes in the notifications data
      onValue(notificationRef, (snapshot) => {
        const data = snapshot.val();
        const notificationList = [];
        let unseenCount = 0;

        // Convert the notifications data into an array
        for (let id in data) {
          const notification = {
            id, // The unique notification ID
            ...data[id], // The notification data
          };

          notificationList.push(notification);

          // Count the number of unseen notifications
          if (!notification.isSeen) {
            unseenCount++;
          }
        }

        notificationList.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotifications(notificationList);
        setNotificationBadge(unseenCount); // Update the badge 
      });
    }
  }, []);

  const handleDropdownToggle = () => {
    toggleDropdown();
    if (!isOpen) {
      // Keep track of notifications marked as seen during dropdown open
      setOpenedNotifications([]);
    }
  };

  const handleNotificationClick = (notificationId) => {
    const user = auth.currentUser;
    const notificationUpdateRef = ref(
      database,
      `admins/${user.uid}/notifications/${notificationId}`
    );

    // Mark the notification as seen in Firebase
    update(notificationUpdateRef, { isSeen: true });

    // Update the local state to reflect the notification has been seen
    setOpenedNotifications((prev) => [...prev, notificationId]);
  };

  const handleDropdownClose = () => {
    // Reset the badge count
    setNotificationBadge(0);
  };

  // Determine the notifications to display based on viewAll state
  const displayedNotifications = viewAll
    ? notifications
    : notifications.slice(0, 7);

  return (
    <div>
      <div className="flex z-50">
        <Tooltip
          title={
            <span className="text-sm">{`${
              isOpen ? "Close" : "Open"
            } Notification`}</span>
          }
          arrow
        >
          <div className="relative">
            <button
              onClick={handleDropdownToggle}
              onBlur={handleDropdownClose} // Handle closing the dropdown
              type="button"
              data-dropdown-toggle="notification-dropdown"
              className={`p-2 mr-1 ${
                isOpen ? "text-blue-600" : "text-gray-500"
              } rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600`}
            >
              <span className="sr-only">View notifications</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 14 20"
              >
                <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z" />
              </svg>
            </button>
            {notificationBadge > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center text-white font-bold rounded-full bg-red-500 w-5 h-5 text-xs">
                {notificationBadge < 16 ? notificationBadge : "15+"}
              </span>
            )}
          </div>
        </Tooltip>
      </div>
      {isOpen && (
        <div className="fixed inset-x-0 top-12 md:top-14 bottom-0 md:right-0 md:left-auto mt-3 w-screen md:w-80 bg-white dark:bg-gray-700 rounded-md flex flex-col z-10 dark:divide-gray-600">
          <div className="py-2 px-4 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            Notifications
          </div>
          <div
            className="flex-grow overflow-y-auto" // Add this line to make it scrollable
          >
            {displayedNotifications.length === 0 ? (
              <EmptyLogo message={"Your notification is empty"} />
            ) : (
              displayedNotifications.map((notification) => {
                const isNewlyOpened = openedNotifications.includes(
                  notification.id
                );
                return (
                 <NotificationItem isNewlyOpened={isNewlyOpened} notification={notification}
                  handleNotificationClick={handleNotificationClick}
                 />
                );
              })
            )}

            {!viewAll && displayedNotifications.length >= 7 && (
              <button
                href="#"
                className="block w-full py-2 text-base font-medium text-center text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                onClick={() => setViewAll(true)}
              >
                <div className="inline-flex items-center ">
                  <svg
                    aria-hidden="true"
                    className="mr-2 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  View all
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const NotificationItem = ({notification, isNewlyOpened, handleNotificationClick}) => {
  const navigation = useNavigate();
  const {data: users} = useFetchData("users");
  const {data: responders} = useFetchData("responders");

  const userDetails = users?.find((user) => user.id === notification.userId);
  const responderDetails = responders?.find((responder) => responder.id === notification.responderId);
  const image = userDetails?.img || responderDetails?.img || "Unknown"
 
  const dataType = userDetails ? "users" : "responders"

  return (
    <a
    key={notification.id}
    href="#"
    className={`${
      !notification.isSeen && !isNewlyOpened
        ? "bg-white hover:bg-gray-100 font-semibold"
        : "bg-blue-50 hover:bg-blue-100"
    } flex items-center py-4 px-5 border-b hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-700 transition-colors duration-200`}
    onClick={() => {
      handleNotificationClick(notification.id),
      navigation(`/accounts/${dataType}`)
    }}
  >
    <div className="flex-shrink-0 relative">
      <img
        className="w-12 h-12 rounded-full border-2 border-primary-500"
        src={image}
        alt="Notification avatar"
      />
      {!notification.isSeen && !isNewlyOpened && (
        <span className="absolute top-0 right-0 block h-3 w-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-700"></span>
      )}
    </div>
    <div className="pl-4 w-full">
      <div className="text-sm mb-1 text-gray-600 dark:text-gray-300">
        <p>{notification.message}</p>
      </div>
      <div className="flex justify-between text-xs text-blue-400 dark:text-gray-400">
        <span>{getTimeDifference(notification.timestamp)}</span>
        <span className="text-gray-500 dark:text-green-400">
          {formatDate(notification.date)}
        </span>
      </div>
    </div>
  </a>
  )
}
export default Notification;
