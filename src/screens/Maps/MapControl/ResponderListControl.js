import { useEffect, useMemo } from "react";
import { useMap } from "react-leaflet";
import { useFetchData } from "../../../hooks/useFetchData";
import { push, ref, serverTimestamp, update } from "firebase/database";
import { database } from "../../../services/firebaseConfig";
import logAuditTrail from "../../../hooks/useAuditTrail";
import { toast } from "sonner";

export const ResponderListControl = ({selectedEmergency}) => {
  const map = useMap();
  const { data: responders } = useFetchData("responders");

  // Memoize available responders to prevent unnecessary recalculations
  const availableResponders = useMemo(() => {
    return responders ? responders.filter((responder) => !responder.pendingEmergency) : [];
  }, [responders]);

  const updateEmergencyStatus = async (selectedEmergency, responderData) => {
    if(!selectedEmergency) return alert("No emergency found");

    try{
        // Create history entry
        const historyRef = ref(database, `responders/${responderData.id}/history`);
        const newHistoryEntry = {
          emergencyId: selectedEmergency.emergencyId,
          userId: selectedEmergency.userId,
          timestamp: serverTimestamp(),
          location: selectedEmergency.location.geoCodeLocation,
          description: selectedEmergency.description ?? "No description",
          status: "on-going",
          date: selectedEmergency.date,
          responseTime: new Date().toISOString(),
        };

        const newHistoryRef = await push(historyRef, newHistoryEntry);
        const historyId = newHistoryRef.key;

        const updates = {
            [`responders/${responderData.id}/pendingEmergency`]: {
              userId: selectedEmergency.userId,
              emergencyId: selectedEmergency.emergencyId,
              historyId: historyId,
              locationCoords: {
                latitude: selectedEmergency.location.latitude,
                longitude: selectedEmergency.location.longitude,
              },
            },
            [`emergencyRequest/${selectedEmergency.id}/status`]: "on-going",
            [`emergencyRequest/${selectedEmergency.id}/locationOfResponder`]: {
              latitude: responderData.location.latitude,
              longitude: responderData.location.longitude,
            },
            [`emergencyRequest/${selectedEmergency.id}/responderId`]: responderData.id,
            [`emergencyRequest/${selectedEmergency.id}/responseTime`]:
              new Date().toISOString(),
            [`users/${selectedEmergency.userId}/emergencyHistory/${selectedEmergency.id}/status`]:
              "on-going",
            [`users/${selectedEmergency.userId}/emergencyHistory/${selectedEmergency.id}/locationOfResponder`]:
              {
                latitude: responderData.location.latitude,
                longitude: responderData.location.longitude,
              },
            [`users/${selectedEmergency.userId}/emergencyHistory/${selectedEmergency.id}/responderId`]:
              responderData.id,
            [`users/${selectedEmergency.userId}/emergencyHistory/${selectedEmergency.id}/responseTime`]:
              new Date().toISOString(),
            [`users/${selectedEmergency.userId}/activeRequest/responderId`]: responderData.id,
            [`users/${selectedEmergency.userId}/activeRequest/locationOfResponder`]: {
              latitude: responderData.location.latitude,
              longitude: responderData.location.longitude,
            },
          };
  
          // Create notification
          const notificationRef = ref(
            database,
            `users/${selectedEmergency.userId}/notifications`
          );
          await push(notificationRef, {
            responderId: responderData.id,
            type: "responder",
            title: "Emergency Response Dispatched",
            message: `A responder has been dispatched for your ${selectedEmergency.type} emergency.`,
            isSeen: false,
            date: new Date().toISOString(),
            timestamp: serverTimestamp(),
            icon: "car-emergency",
          });
  
          await update(ref(database), updates);
          await logAuditTrail("Deployed Responder", responderData.id);
          toast.info("Successfully deployed!");

    }catch(error){
        console.error(error);
    }
  }


  useEffect(() => {
    const marker = L.control({ position: "topleft" });

    marker.onAdd = function () {
      const div = L.DomUtil.create("div", "responder-list");
      div.innerHTML = `<div class="leaflet-bar bg-white p-2 rounded-md shadow-md" style="min-width: 150px;">
          <div class="mb-2 p-1 text-center font-semibold">
            Available Responders
          </div>
          <div id="responder-list-container">
          ${availableResponders.length > 0 ? (
          ``) : `<p>No available responder</p>`}
          </div>
        </div>`;

      return div;
    };

    marker.addTo(map);

    // Wait for the control to be added, then append responder list dynamically
    setTimeout(() => {
      const container = document.getElementById("responder-list-container");
      if (container && availableResponders.length > 0) {
        availableResponders.forEach((responder) => {
          const responderDiv = document.createElement("div");
          responderDiv.classList.add("flex", "items-center", "space-x-2", "mb-1");

          // Responder Image
          const img = document.createElement("img");
          img.src = responder.img;
          img.alt = "responder";
          img.classList.add("w-10", "h-10", "border", "rounded-full", "shadow-md");

          // Responder Name
          const name = document.createElement("p");
          name.textContent = responder.fullname;
          name.classList.add("text-green-500", "font-bold");

          // Deploy Button
          const button = document.createElement("button");
          button.textContent = "Deploy";
          button.classList.add("bg-blue-500", "text-white", "px-3", "py-1", "rounded-md", "hover:bg-blue-600");

          // Add click event listener
          button.addEventListener("click", async () => {
            await updateEmergencyStatus(selectedEmergency, responder);
          });

          // Append elements to the responder div
          responderDiv.appendChild(img);
          responderDiv.appendChild(name);
          responderDiv.appendChild(button);

          // Append responder div to the container
          container.appendChild(responderDiv);
        });
      }
    }, 100); // Small delay to ensure the container exists

    return () => {
      marker.remove();
    };
  }, [map, availableResponders]);

  return null;
};
