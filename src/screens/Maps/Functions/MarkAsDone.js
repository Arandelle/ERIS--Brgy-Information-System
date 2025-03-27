import {
  get,
  push,
  ref,
  remove,
  serverTimestamp,
  update,
} from "firebase/database";
import { database } from "../../../services/firebaseConfig";
import logAuditTrail from "../../../hooks/useAuditTrail";
import { toast } from "sonner";

export const handleEmergencyDone = async (emergency, responderId, setLoading = false) => {
  try {
    if (responderId) {
      setLoading(true);
      const responderDataRef = ref(
        database,
        `responders/${responderId}/pendingEmergency`
      );
      const responderSnapshot = await get(responderDataRef);

      if (responderSnapshot.exists()) {
        const responderData = responderSnapshot.val();
        const historyId = responderData?.historyId;

        await remove(
          ref(database, `responders/${responderId}/pendingEmergency`)
        );
        await remove(ref(database, `users/${emergency.userId}/activeRequest`));

        const notificationRefForUser = ref(
          database,
          `users/${emergency.userId}/notifications`
        );

        await push(notificationRefForUser, {
          responderId,
          type: "responder",
          title: "Emergency report resolved!",
          message: `Your report for ${emergency.type} has been resolved`,
          isSeen: false,
          date: new Date().toISOString(),
          timestamp: serverTimestamp(),
          icon: "shield-check",
        });
        await logAuditTrail("Marked Emergency Done", emergency.id);

        const updates = {
          [`emergencyRequest/${emergency.id}/status`]: "resolved",
          [`users/${emergency.userId}/emergencyHistory/${emergency.id}/status`]:
            "resolved",
          [`responders/${responderId}/history/${historyId}/status`]: "resolved",
          [`emergencyRequest/${emergency.id}/dateResolved`]:
            new Date().toISOString(),
          [`users/${emergency.userId}/emergencyHistory/${emergency.id}/dateResolved`]:
            new Date().toISOString(),
          [`responders/${responderId}/history/${historyId}/dateResolved`]:
            new Date().toISOString(),
        };

        await update(ref(database), updates);

        toast.info("Emergency request successfully resolved!");
      } else {
        console.log("No pending emergency");
      }
    } else {
      console.log("No user available");
    }
  } catch (error) {
    console.error("Error", error);
  } finally {
    setLoading(false);
  }
};
