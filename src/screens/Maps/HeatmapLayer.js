import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useFetchData } from '../../hooks/useFetchData';
import L from "leaflet";
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

export const HeatmapLayer = ({ selectedYear, setAvailableYears, displayMode }) => {
    const map = useMap();
    const { data: emergencyRequest } = useFetchData("emergencyRequest");
    const [emergencyData, setEmergencyData] = useState([]);
    const [markerLayer, setMarkerLayer] = useState(null);
    const [heatLayer, setHeatLayer] = useState(null);

    // Extract available years from data
    useEffect(() => {
        if (!emergencyRequest || emergencyRequest.length === 0) return;

        const years = [...new Set(emergencyRequest.map(req => new Date(req.timestamp).getFullYear()))].sort((a, b) => b - a);
        setAvailableYears(years);
    }, [emergencyRequest, setAvailableYears]);

    // Process data when selected year changes
    useEffect(() => {
        if (!emergencyRequest || emergencyRequest.length === 0) return;
        
        const locationMap = new Map();
        const pointsData = [];

        // Process emergency requests
        emergencyRequest.forEach((request) => {
            if (request.location && request.location.latitude && request.location.longitude && request.timestamp) {
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
                        details: request // Original data for tooltips
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
            locationMap
        });
    }, [emergencyRequest, selectedYear]);

    // Create and manage layers
    useEffect(() => { 
        if (!emergencyData.heatData || emergencyData.heatData.length === 0) return;
        
        // Remove existing layers
        if (heatLayer) map.removeLayer(heatLayer);
        if (markerLayer) map.removeLayer(markerLayer);
        
        // Create heatmap layer
        const newHeatLayer = L.heatLayer(emergencyData.heatData, {
            radius: 25,
            blur: 15,
            maxZoom: 17
        });
        
        // Create marker cluster group
        const markers = L.markerClusterGroup({
            showCoverageOnHover: false,
            spiderfyOnMaxZoom: true,
            disableClusteringAtZoom: 18,
            maxClusterRadius: 50,
            // Custom icon creation for clusters to show the count
            iconCreateFunction: function(cluster) {
                const childMarkers = cluster.getAllChildMarkers();
                const emergencyCounts = {};

                childMarkers.forEach(marker => {
                  const emergencyType = marker.options.emergencyType || "Unknown";
                  emergencyCounts[emergencyType] = (emergencyCounts[emergencyType] || 0) + 1;
                });

                // Determine the dominant emergency type
                let dominantType = "Unknown";
                let maxCount = 0;

                Object.entries(emergencyCounts).forEach(([type, count]) => {
                  if(count > maxCount){
                    maxCount = count;
                    dominantType = type
                  }
                });

                // Define colors based on dominant type
                const typeColors = {
                  "fire": "#FF5733",
                  "medical": "#28A745",
                  "crime": "#FFC107",
                  "natural disaster": "#007BFF",
                  "Unknown": "#6C757D" // Default gray for unknown types
                }

                const count = cluster.getChildCount();
                const bgColor = typeColors[dominantType] || "Unknown";
                
                return L.divIcon({
                    html: `<div style="
                    background-color: ${bgColor};
                    color: white;
                    border-radius: 50%;
                    height: 40px;
                    width: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    border: 2px solid white;
                    box-shadow: 0 0 5px rgba(0,0,0,0.3);
                    ">${count}</div>`,
                    className: "",
                    iconSize: L.point(40, 40)
                });
            }
        });

        // Define color mapping based on emergency type
        const emergencyTypeColors = {
          "medical": "#ff5733",  // Red-Orange
          "fire": "#ff0000",     // Red
          "crime": "#000000",    // Black
          "accident": "#f39c12", // Yellow-Orange
          "natural disaster": "#8e44ad", // Purple
          "Other": "#3498db"     // Blue
      };      
        // Add markers to cluster group
        emergencyData.pointsData.forEach(point => {
            const emergencyType = point.details.emergencyType || "Other" // default type if undefined
            const emergencyColor = emergencyTypeColors[emergencyType] || "#3388ff" // default color
            const marker = L.circleMarker([point.lat, point.lng], {
                radius: 8,
                fillColor: emergencyColor,
                color: '#fff',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8,
                emergencyType: point.details.emergencyType
            });
            
            // Add popup with count for exact coordinates
            const key = `${point.lat},${point.lng}`;
            const totalCount = emergencyData.locationMap.get(key);
            const type = point.details.emergencyType
            const emergencyId = point.details.emergencyId

            marker.bindPopup(`<b>${emergencyId}</b><br>
              <b>Emergency Count: ${totalCount}</b><br>
              Coordinates: ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}<br>
              Emergency Type: ${type}`);
            markers.addLayer(marker);
        });
        
        // Apply the selected display mode
        if (displayMode === 'heat' || displayMode === 'hybrid') {
            newHeatLayer.addTo(map);
        }
        
        if (displayMode === 'cluster' || displayMode === 'hybrid') {
            markers.addTo(map);
        }
        
        // Store layers for later reference
        setHeatLayer(newHeatLayer);
        setMarkerLayer(markers);
                
        return () => {
            // Clean up
            if (newHeatLayer) map.removeLayer(newHeatLayer);
            if (markers) map.removeLayer(markers);
           
        };
    }, [map, emergencyData, displayMode]);

    return null; // No UI rendered directly
};