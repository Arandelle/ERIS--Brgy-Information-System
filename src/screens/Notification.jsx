import { Tooltip } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { auth, database } from "../services/firebaseConfig";
import { ref, update } from "firebase/database";
import { getTimeDifference } from "../helper/TimeDiff";
import { formatDate } from "../helper/FormatDate";
import { useNavigate } from "react-router-dom";
import EmptyLogo from "../components/ReusableComponents/EmptyLogo";
import { useFetchData } from "../hooks/useFetchData";
import icons from "../assets/icons/Icons";
import { toast } from "sonner";
import handleDeleteData from "../hooks/handleDeleteData";

const Notification = () => {
  const navigation = useNavigate();
  const [notificationBadge, setNotificationBadge] = useState(0);
  const [openedNotifications, setOpenedNotifications] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const currentUser = auth.currentUser;
  const { data: notifications } = useFetchData(
    `admins/${currentUser?.uid}/notifications`
  );

  useEffect(() => {
    if (notifications.length) {
      let unseenCount = 0;

      notifications.forEach((notification) => {
        if (!notification.isSeen) {
          unseenCount++;
        }
      });

      notifications.sort((a, b) => new Date(b.date) - new Date(a.date));
      setNotificationBadge(unseenCount); // Update the badge
    }
  }, [notifications]);

  const handleDropdownToggle = () => {
    toggleDropdown();
    if (!isOpen) {
      // Keep track of notifications marked as seen during dropdown open
      setOpenedNotifications([]);
    }
  };

  const handleNotificationClick = (notification) => {
    const user = auth.currentUser;
    const notificationUpdateRef = ref(
      database,
      `admins/${user?.uid}/notifications/${notification.id}`
    );

    // Mark the notification as seen in Firebase
    update(notificationUpdateRef, { isSeen: true });

    // Update the local state to reflect the notification has been seen
    setOpenedNotifications((prev) => [...prev, notification.id]);
    // Navigate based on notification type
    navigateByType(notification);
    toggleDropdown();
  };

  const navigateByType = (notification) => {
    const { type, data } = notification;

    switch (type) {
      case "responders":
        navigation("/accounts/responders");
        break;

      case "reported":
        // Navigate to records with filter applied for reported items
        navigation("/incident-report");
        break;

      case "emergency":
        // Navigate to specific emergency record
        navigation("/records", {
          state: {
            viewRecord: data?.emergencyId,
            emergencyId: data?.emergencyId,
          },
        });
        break;

      case "users":
        navigation("/accounts/residents");
        break;
      case "admins":
        navigation("/accounts/admins");
        break;
      case "certification":
        navigation("/certification");
        break;

      default:
        // Default navigation or dashboard
        navigation("/dashboard");
        break;
    }
  };

  const handleDropdownClose = () => {
    // Reset the badge count
    setNotificationBadge(0);
  };

  // Determine the notifications to display based on viewAll state
  const displayedNotifications = viewAll
    ? notifications
    : notifications.slice(0, 7);

  const handleDeleteNotification = async (id) => {
    try {
      await handleDeleteData(id, `admins/${currentUser?.uid}/notifications`);
    } catch (error) {
      toast.error(error);
    }
  };

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
              className={`p-2 mr-1 ${
                isOpen ? "text-blue-600" : "text-gray-500"
              } rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600`}
            >
              <span className="sr-only">View notifications</span>
              <icons.notifation />
            </button>
            {/** Show notification badge it its below 100 */}
            {notificationBadge > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center text-white font-bold rounded-full bg-red-500 w-6 h-6 text-xs">
                {notificationBadge < 100 ? notificationBadge : "99+"}
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
                  <NotificationItem
                    isNewlyOpened={isNewlyOpened}
                    notification={notification}
                    handleNotificationClick={handleNotificationClick}
                    handleDeleteNotification={handleDeleteNotification}
                  />
                );
              })
            )}

            {!viewAll && displayedNotifications.length >= 7 && (
              <button
                href="#"
                className="block w-full py-2 text-base font-medium text-center text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-600"
                onClick={() => setViewAll(true)}
              >
                <div className="inline-flex items-center ">
                  <icons.view />
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

const NotificationItem = ({
  notification,
  isNewlyOpened,
  handleNotificationClick,
  handleDeleteNotification,
}) => {
  const { data: users } = useFetchData("users");
  const { data: responders } = useFetchData("responders");
  const { data: admins } = useFetchData("admins");

  const adminDetails = useMemo(
    () => admins?.find((admin) => admin.id === notification.userId),
    [admins, notification.userId]
  );

  const userDetails = useMemo(
    () => users?.find((user) => user.id === notification.userId),
    [users, notification.userId]
  );

  const responderDetails = useMemo(
    () => responders?.find((responder) => responder.id === notification.userId),
    [responders, notification.userId]
  );

  const image = useMemo(() => {
    const img = userDetails?.img || responderDetails?.img || adminDetails?.img;
    return img && img.trim() !== "" ? img : null;
  }, [userDetails, responderDetails, adminDetails]);

  const FallbackImage = icons.face;

  return (
    <a
      key={notification.id}
      href="#"
      className={`group ${
        !notification.isSeen && !isNewlyOpened
          ? "bg-white dark:bg-gray-600 hover:bg-gray-100 font-semibold"
          : "bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-900"
      } flex items-center py-4 px-5 border-b hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-700 transition-colors duration-200 relative`}
      onClick={() => {
        handleNotificationClick(notification);
      }}
    >
      <div className="flex-shrink-0 relative">
        {image ? (
          <img
            className="w-12 h-12 rounded-full border-2 border-primary-500"
            src={image}
            alt="Notification avatar"
          />
        ) : (
          <div className="w-12 h-12 rounded-full flex items-center justify-center">
            <FallbackImage
              fontSize="large"
              className="text-gray-500 dark:text-gray-50"
            />
          </div>
        )}

        {!notification.isSeen && !isNewlyOpened && (
          <span className="absolute top-0 right-0 block h-3 w-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-700"></span>
        )}
      </div>
      <div className="pl-4 w-full">
        <div className="mb-1 text-gray-600 dark:text-gray-300">
          <p className="text-md font-bold">{notification.title}</p>
          <p className="text-sm font-thin">{notification.message}</p>
        </div>
        <div className="flex justify-between text-xs text-blue-400 dark:text-gray-400">
          <span>{getTimeDifference(notification.date)}</span>
          <span className="text-gray-500 dark:text-green-400">
            {formatDate(notification.date)}
          </span>
        </div>
      </div>
      {/* Delete Button */}
      <button
        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 hidden group-hover:block bg-white dark:bg-gray-700 p-2 rounded shadow-lg focus:outline-none"
        onClick={(e) => {
          e.stopPropagation(); // Prevent parent onClick from firing
          handleDeleteNotification(notification.id);
        }}
      >
        Delete
      </button>
    </a>
  );
};

export default Notification;
