import React, { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import { useFetchData } from "../../hooks/useFetchData";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { formatDateWithTime } from "../../helper/FormatDate";
import { blueIcon, redIcon, greenIcon } from "../../helper/iconUtils";


export const DisplayLayer = ({
  selectedYear,
  setAvailableYears,
  displayMode,
  setShowModal,
  setEmergencyId
}) => {
  const map = useMap();
  const { data: emergencyRequest } = useFetchData("emergencyRequest");
  const [emergencyData, setEmergencyData] = useState([]);
  const [markerLayer, setMarkerLayer] = useState(null);
  const [heatLayer, setHeatLayer] = useState(null);
  const [mapMarkerLayer, setMapMarkerLayer] = useState(null);

useEffect(() => {
  window.assignResponder = () => {
    setShowModal(prev => !prev);
  };
}, []);

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
        request.timestamp
      ) {
        const year = new Date(request.timestamp).getFullYear();

        if (year === selectedYear) {
          const lat = request.location.latitude;
          const lng = request.location.longitude;
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
          Unknown: "#6C757D",
        };

        const count = cluster.getChildCount();
        const bgColor = typeColors[dominantType] || "Unknown";

        return L.divIcon({
          html: `<div style="background-color: ${bgColor}; color: white; border-radius: 50%;
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
      Other: "#3498db",
    };

    // Create a separate layer for normal map markers
    const mapMarkers = L.layerGroup();

    // Add markers to the respective layers
    emergencyData.pointsData.forEach((point) => {
      const emergencyType = point.details.emergencyType || "Other";
      const emergencyColor = emergencyTypeColors[emergencyType] || "#3388ff";
      const status = point.details.status;
      const markerIcon = status === "pending" ? blueIcon : greenIcon;

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

      marker.bindPopup(`<b>ID: ${emergencyId}</b><br>
                        Type: ${emergencyType}<br>
                        Status: ${status}<br>
                        Date: ${formatDateWithTime(date)}<br>
                        Coordinates: ${point.lat.toFixed(
                          4
                        )}, ${point.lng.toFixed(4)}<br>`).on('popupopen', function(){
                          setShowModal(true);
                          setEmergencyId(id)
                        }).on('popupclose', function(){
                          setShowModal(false);
                          setEmergencyId(null);
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
