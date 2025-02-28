import React, {useState, useEffect} from 'react'
import { useMap } from 'react-leaflet'
import { useFetchData } from '../../hooks/useFetchData';
import L from "leaflet";

export const HeatmapLayer = () => {

    const map = useMap();
    const {data: emergencyRequest} = useFetchData("emergencyRequest");
    const [emergencyData, setEmergencyData] = useState([]);

    useEffect(() => {

        if(!emergencyRequest || emergencyRequest.length === 0) return;
        
        const locationMap = new Map(); //map object to ensure unique locations and counts emergencies per location

        //process emergency request
        emergencyRequest.forEach((request) => {
            if(request.location && request.location.latitude && request.location.longitude){
                const lat = request.location.latitude;
                const lng = request.location.longitude;
                const key = `${lat},${lng}`; // store as a key

                locationMap.set(key, (locationMap.get(key) || 0) + 0.8);
            }
        });

        //convert map data into heatmap format
        const heatData = Array.from(locationMap.entries()).map(([key, count]) => {
            const [lat, lng] = key.split(",").map(Number); // split the lat/lng into separate number
            return [lat,lng, count]; // use count as intensity [[14.395, 120.857, 1.6], [14.396, 120.858, 0.8], ...]
        });

        setEmergencyData(heatData); // add the data

    }, [emergencyRequest]);

    useEffect(() => {
        if(emergencyData.length === 0) return;

        const heatLayer = L.heatLayer(emergencyData, {
            radius: 25, //size of each heat point
            blur: 15, //smoothness of the heatmap
            maxZoom: 17 // heatmap fades when zoom in/out
        }).addTo(map);
        
    return () => {
        map.removeLayer(heatLayer); //Prevents duplicate heat layers every time emergencyData updates
        //Cleans up the previous layer before adding a new one.

    };
}, [map, emergencyData]);

  return null; //This component doesn't render any UI, it only modifies the map.
};


