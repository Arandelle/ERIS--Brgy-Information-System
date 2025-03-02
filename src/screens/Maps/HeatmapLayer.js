import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useFetchData } from '../../hooks/useFetchData';
import L from "leaflet";
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

export const HeatmapLayer = ({ selectedYear, setAvailableYears }) => {
    const map = useMap();
    const { data: emergencyRequest } = useFetchData("emergencyRequest");
    const [emergencyData, setEmergencyData] = useState([]);
    const [markerLayer, setMarkerLayer] = useState(null);
    const [heatLayer, setHeatLayer] = useState(null);
    const [displayMode, setDisplayMode] = useState('heat'); // Default to hybrid mode

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
                const count = cluster.getChildCount();
                let className = 'cluster-marker-small';
                
                if (count > 10) className = 'cluster-marker-medium';
                if (count > 30) className = 'cluster-marker-large';
                
                return L.divIcon({
                    html: `<div><span>${count}</span></div>`,
                    className: className,
                    iconSize: L.point(40, 40)
                });
            }
        });
        
        // Add markers to cluster group
        emergencyData.pointsData.forEach(point => {
            const marker = L.circleMarker([point.lat, point.lng], {
                radius: 8,
                fillColor: '#3388ff',
                color: '#fff',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
            
            // Add popup with count for exact coordinates
            const key = `${point.lat},${point.lng}`;
            const totalCount = emergencyData.locationMap.get(key);
            marker.bindPopup(`<b>Emergency Count: ${totalCount}</b><br>Location: ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`);
            
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
        
        // Add display mode toggle control
        const displayControl = L.control({ position: 'topright' });
        displayControl.onAdd = function() {
            const div = L.DomUtil.create('div', 'display-control');
            div.innerHTML = `
                <div class="leaflet-control leaflet-bar bg-white p-2 rounded shadow-md">
                    <div class="font-medium mb-1">Display Mode:</div>
                    <div class="flex flex-col space-y-1">
                        <label class="flex items-center">
                            <input type="radio" name="display-mode" value="hybrid" ${displayMode === 'hybrid' ? 'checked' : ''} class="mr-1" />
                            <span>Both</span>
                        </label>
                        <label class="flex items-center">
                            <input type="radio" name="display-mode" value="heat" ${displayMode === 'heat' ? 'checked' : ''} class="mr-1" />
                            <span>Heatmap</span>
                        </label>
                        <label class="flex items-center">
                            <input type="radio" name="display-mode" value="cluster" ${displayMode === 'cluster' ? 'checked' : ''} class="mr-1" />
                            <span>Clusters</span>
                        </label>
                    </div>
                </div>
            `;
            
            // Add event listeners with a slight delay to ensure DOM is ready
            setTimeout(() => {
                const radios = div.querySelectorAll('input[type="radio"]');
                radios.forEach(radio => {
                    L.DomEvent.on(radio, 'change', function(e) {
                        setDisplayMode(e.target.value);
                    });
                    L.DomEvent.disableClickPropagation(radio);
                });
            }, 100);
            
            return div;
        };
        displayControl.addTo(map);
        
        // Add custom CSS for marker clusters
        if (!document.getElementById('cluster-markers-style')) {
            const style = document.createElement('style');
            style.id = 'cluster-markers-style';
            style.innerHTML = `
                .cluster-marker-small,
                .cluster-marker-medium,
                .cluster-marker-large {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background-color: rgba(51, 136, 255, 0.8);
                    color: white;
                    font-weight: bold;
                    border: 2px solid white;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
                }
                .cluster-marker-small {
                    width: 30px;
                    height: 30px;
                }
                .cluster-marker-medium {
                    width: 40px;
                    height: 40px;
                }
                .cluster-marker-large {
                    width: 50px;
                    height: 50px;
                }
                .cluster-marker-small div,
                .cluster-marker-medium div,
                .cluster-marker-large div {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                }
            `;
            document.head.appendChild(style);
        }
        
        return () => {
            // Clean up
            if (newHeatLayer) map.removeLayer(newHeatLayer);
            if (markers) map.removeLayer(markers);
            map.removeControl(displayControl);
        };
    }, [map, emergencyData]);

    // Handle display mode changes
    useEffect(() => {
        if (!heatLayer || !markerLayer) return;
        
        // Remove existing layers
        map.removeLayer(heatLayer);
        map.removeLayer(markerLayer);
        
        // Apply the selected display mode
        if (displayMode === 'heat' || displayMode === 'hybrid') {
            heatLayer.addTo(map);
        }
        
        if (displayMode === 'cluster' || displayMode === 'hybrid') {
            markerLayer.addTo(map);
        }
    }, [map, heatLayer, markerLayer, displayMode]);

    return null; // No UI rendered directly
};