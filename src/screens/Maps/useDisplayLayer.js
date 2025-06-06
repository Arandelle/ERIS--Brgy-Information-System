import React, { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { formatDateWithTime } from "../../helper/FormatDate";
import { blueIcon, redIcon, greenIcon } from "../../helper/iconUtils";

export const DisplayLayer = ({
  emergencyRequest,
  selectedYear,
  setAvailableYears,
  displayMode,
  setShowResponderList,
  setSelectedEmergency,
  setMarkAsDoneModal,
}) => {
  const map = useMap();
  const [emergencyData, setEmergencyData] = useState([]);
  const [markerLayer, setMarkerLayer] = useState(null);
  const [heatLayer, setHeatLayer] = useState(null);
  const [mapMarkerLayer, setMapMarkerLayer] = useState(null);

  // Extract available years from data
  useEffect(() => {
    if (!emergencyRequest || emergencyRequest.length === 0) return;

    const years = [
      ...new Set(
        emergencyRequest.map((req) => new Date(req.timestamp).getFullYear())
      ),
    ].sort((a, b) => b - a);
    setAvailableYears(years);
  }, [emergencyRequest, setAvailableYears]);

  // Process data when selected year changes
  useEffect(() => {
    if (!emergencyRequest || emergencyRequest.length === 0) return;

    const locationMap = new Map();
    const pointsData = [];

    // Process emergency requests
    emergencyRequest.forEach((request) => {
      if (
        request.location &&
        request.location.latitude &&
        request.location.longitude &&
        request.timestamp &&
        request.status !== "reported"
      ) {
        const year = new Date(request.timestamp).getFullYear();

        if (year === selectedYear) {
          const lat = Number(request.location.latitude);
          const lng = Number(request.location.longitude);
          const key = `${lat},${lng}`;

          // Update count for this location
          const currentCount = locationMap.get(key) || 0;
          locationMap.set(key, currentCount + 1);

          // Store individual point data
          pointsData.push({
            lat,
            lng,
            count: 1,
            id: request.id || Math.random().toString(36).substr(2, 9),
            details: request, // Original data for tooltips
          });
        }
      }
    });

    // Convert map data into heatmap format
    const heatData = Array.from(locationMap.entries()).map(([key, count]) => {
      const [lat, lng] = key.split(",").map(Number);
      return [lat, lng, count]; // Use actual count as intensity
    });

    setEmergencyData({
      heatData,
      pointsData,
      locationMap,
    });
  }, [emergencyRequest, selectedYear]);

  // Create and manage layers
  useEffect(() => {
    if (!emergencyData.heatData || emergencyData.heatData.length === 0) return;

    // Remove existing layers
    if (heatLayer) map.removeLayer(heatLayer);
    if (markerLayer) map.removeLayer(markerLayer);
    if (mapMarkerLayer) map.removeLayer(mapMarkerLayer); // Remove the new map marker layer

    // Create heatmap layer
    const newHeatLayer = L.heatLayer(emergencyData.heatData, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
    });

    // Create marker cluster group
    const clusters = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: 18,
      maxClusterRadius: 50,
      iconCreateFunction: function (cluster) {
        const childMarkers = cluster.getAllChildMarkers();
        const emergencyCounts = {};

        childMarkers.forEach((marker) => {
          const emergencyType = marker.options.emergencyType || "Unknown";
          emergencyCounts[emergencyType] =
            (emergencyCounts[emergencyType] || 0) + 1;
        });

        // find dominant emergency type
        let dominantType = "Unknown";
        let maxCount = 0;

        Object.entries(emergencyCounts).forEach(([type, count]) => {
          if (count > maxCount) {
            maxCount = count;
            dominantType = type;
          }
        });

        const typeColors = {
          fire: "#ff0000",
          medical: "#ff5733",
          crime: "#000000",
          "natural disaster": "#8e44ad",
          "public disturbance": "#f1c40f",
          other: "#6C757D", // Changed from "red" to proper hex
        };

        // Fixed priority order
        const colorOrder = [
          "fire",
          "medical",
          "crime",
          "natural disaster",
          "public disturbance",
          "other",
        ];

        // check if cluster had mixed emergency type
        const presentTypes = Object.keys(emergencyCounts);
        const isMixedCluster = presentTypes.length > 1;

        function generateGradient(emergencyCounts, dominantType) {
          const presentTypes = Object.keys(emergencyCounts);
          const sortedTypes = colorOrder.filter((type) =>
            presentTypes.includes(type)
          );

          // move dominant type to the start
          const reorderedTypes = [
            dominantType,
            ...sortedTypes.filter((t) => t != dominantType),
          ];

          const colors = reorderedTypes.map((type) => typeColors[type]);
          return `linear-gradient(45deg, ${colors.join(",")})`;
        }

        const count = cluster.getChildCount();

        // generate bg style based on cluster composition
        const bgStyle = isMixedCluster
          ? generateGradient(emergencyCounts, dominantType)
          : typeColors[dominantType] || typeColors["Unknown"];

        return L.divIcon({
          html: `<div style="background: ${bgStyle}; color: white; border-radius: 50%;
                 height: 40px; width: 40px; display: flex; align-items: center;
                 justify-content: center; font-weight: bold; border: 2px solid white;
                 box-shadow: 0 0 5px rgba(0,0,0,0.3);">${count}</div>`,
          className: "",
          iconSize: L.point(40, 40),
        });
      },
    });

    // Define color mapping based on emergency type
    const emergencyTypeColors = {
      medical: "#ff5733",
      fire: "#ff0000",
      crime: "#000000",
      accident: "#f39c12",
      "natural disaster": "#8e44ad",
      "public disturbance": "#f1c40f",
      other: "#3498db",
    };

    // Create a separate layer for normal map markers
    const mapMarkers = L.layerGroup();

    // Add markers to the respective layers
    emergencyData.pointsData.forEach((point) => {
      const emergencyType = point.details.emergencyType || "other";
      const emergencyColor = emergencyTypeColors[emergencyType] || "#3388ff";
      const status = point.details.status;
      const markerIcon = status === "pending" ? redIcon : greenIcon;

      const marker = L.marker([point.lat, point.lng], { icon: markerIcon });
      const cluster = L.circleMarker([point.lat, point.lng], {
        radius: 8,
        fillColor: emergencyColor,
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        emergencyType: emergencyType,
      });

      const id = point.details.id;
      const emergencyId = point.details.emergencyId;
      const date = point.details.timestamp;
      const responderId = point.details.responderId;

      marker
        .bindPopup(
          `<div class="flex flex-col space-y-2">
            <span>ID: ${emergencyId}</span>
            <span> Type: ${emergencyType}</span>
            <span> Status: ${status}</span>
            <span> Date: ${formatDateWithTime(date)}</span>
            <span> Coordinates: ${point.lat.toFixed(4)},${point.lng.toFixed(
            4
          )}</span>
            <span>${
              status === "on-going"
                ? `<button class="bg-green-500 mt-2 p-2 rounded text-white"
             id=${emergencyId}
            >
            Mark as Done</button>`
                : ""
            } </span>
          </div>`
        )
        .on("popupopen", function () {
          setShowResponderList(true);
          setSelectedEmergency(point.details);

          // add event listener to the button after popup opens
          const button = document.getElementById(emergencyId);

          if (button) {
            button.addEventListener("click", () => {
              setMarkAsDoneModal({
                done: true,
                emergency: point.details,
                responderId: responderId,
              });
            });
          }
        })
        .on("popupclose", function () {
          setShowResponderList(false);
          setSelectedEmergency(null);
        });

      cluster.bindPopup(`<b>ID: ${emergencyId}</b><br>
                        Type: ${emergencyType}<br>
                        Status: ${status}<br>
                        Date: ${formatDateWithTime(date)}<br>
                        Coordinates: ${point.lat.toFixed(
                          4
                        )}, ${point.lng.toFixed(4)}<br>
                      `);

      if (
        (status === "on-going" || status === "pending") &&
        displayMode === "marker"
      ) {
        mapMarkers.addLayer(marker); // Add to separate marker layer
      }

      clusters.addLayer(cluster);
    });

    // Apply the selected display mode
    if (displayMode === "heat") {
      newHeatLayer.addTo(map);
    }
    if (displayMode === "cluster") {
      clusters.addTo(map);
    }
    if (displayMode === "marker") {
      mapMarkers.addTo(map); // Add map markers only in "marker" mode
    }

    // Store layers for reference
    setHeatLayer(newHeatLayer);
    setMarkerLayer(clusters);
    setMapMarkerLayer(mapMarkers); // Store new map marker layer

    return () => {
      if (newHeatLayer) map.removeLayer(newHeatLayer);
      if (clusters) map.removeLayer(clusters);
      if (mapMarkers) map.removeLayer(mapMarkers);
    };
  }, [map, emergencyData, displayMode]);

  return null; // No UI rendered directly
};
