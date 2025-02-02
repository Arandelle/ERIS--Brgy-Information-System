import { push, ref, serverTimestamp } from "firebase/database";
import { auth, database } from "../services/firebaseConfig";
import { toast } from "sonner";

const useSendNotification = () => {
  const currentUser = auth.currentUser;

  const sendNotification = async (
    dataType,
    userId,
    messageType,
    subMessageType,
    newNotificationData
  ) => {
    const mainNotificationData = {
      isSeen: false,
      date: new Date().toISOString(),
      timestamp: serverTimestamp(),
      adminId: currentUser?.uid
    };

    const notificationMessage = {
      certificateStatus: {
        rejected: {
          ...mainNotificationData,
          title: "Certification Status Update",
          message: "Sorry your certification request is rejected",
          description: "Please check your details and try again",
          icon: "close-circle",
        },
        "ready for pickup": {
          ...mainNotificationData,
          title: "Certification Status Update",
          message: "Your certification request is ready for pickup",
          description: "Go to your barangay hall and pickup your certificate",
          icon: "clipboard-check-outline",
        },
        done: {
          ...mainNotificationData,
          title: "Certification Status Update",
          message: "Your certification request was successfully printed",
          icon: "check-circle",
        },
      },
      createAccount: {
        admin: {
          ...mainNotificationData,
          ...newNotificationData,
          title: "Account Created",
          message: `You have successfully created an account for ${newNotificationData?.type}`,
        },
        user: {
          ...mainNotificationData,
          ...newNotificationData,
          title: "Account Created",
          message: `Welcome! Your account has been created successfully.`,
          icon: "account-check"
        }
      }
    };

    try {
      const notificationRef = ref(
        database,
        `${dataType}/${userId}/notifications`
      );
      // check if subMessageType is provided and exists in messageType
      const notificationData =
        subMessageType &&
        notificationMessage[messageType] &&
        notificationMessage[messageType][subMessageType]
          ? notificationMessage[messageType][subMessageType]
          : notificationMessage[messageType];

      // ensure notificationData is not undefined before pushing
      await push(notificationRef, notificationData);
    console.log(`${dataType}/${userId}/notifications `);
    } catch (error) {
      toast.error("Error", "Error submitting notification");
    }
  };

  return { sendNotification };
};

export default useSendNotification;
