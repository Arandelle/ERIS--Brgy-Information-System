import React, { useState, useEffect } from "react";
import {toast} from "sonner"
import ActivitiesList from "./ActivitiesList";
import InputReusable from "../../components/ReusableComponents/InputReusable";
import BtnReusable from "../../components/ReusableComponents/BtnReusable";
import HeadSide from "../../components/ReusableComponents/HeaderSidebar";
import { capitalizeFirstLetter } from "../../helper/CapitalizeFirstLetter";
import { onValue, push, ref, serverTimestamp, update } from "firebase/database";
import { database } from "../../services/firebaseConfig";

const Activities = () => {

  const [activity, setActivity] = useState([]);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  useEffect(()=>{
    const announcementRef = ref(database, `announcement`);
    const unsubscribe = onValue(announcementRef, (snapshot) => {
      try{
        const announcementData = snapshot.val();
        const announcementList = Object.keys(announcementData).map((key) => ({
          id: key,
          ...announcementData[key]
        }));
        setActivity(announcementList)
      } catch(error){
        console.log("Error: ", error)
      }
    });

    return ()=> unsubscribe()
  }, [])

  const handleAddAnnouncement = async () => {
    if (!title || !description || !location || !startTime || !endTime) {
      toast.info("Please complete the form")
      return;
    }
    if(new Date(startDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)){
      toast.error("Start date must be greater than or equal to today's date");
      return;
    }

    const startHour = new Date(`1970-01-01T${startTime}`);
    const endHour = new Date(`1970-01-01T${endTime}`)

    if(startHour >= endHour){
      toast.error("Start time must be earlier than end time");
      return;
    }

    const addedNews = {
      id: Date.now(), // Generate a unique ID for the new activity
      title,
      startDate,
      startTime,
      endTime,
      location,
      description,
      timestamp: serverTimestamp(), // Add a timestamp
    };

    const announcementRef = ref(database, `announcement`);

    try{
      await push(announcementRef, addedNews);
    }
    catch(error){
      console.error("Error :", error)
    }

    setTitle("");
    setStartDate("");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setDescription("");
    toast.success("Submitted successfully");
  };

  return (
    <HeadSide child={  <div className="m-3">
    <div className="flex flex-col gap-4">
      <div className="grid justify-start grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-15 my-15 gap-4">
        <InputReusable
          type="text"
          value={title}
          placeholder="Activity Title"
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTitle(title.toUpperCase())}
        />
         <InputReusable
          type="text"
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => (e.target.type = "text")}
          value={startDate}
          placeholder="Date"
          onChange={(e) => setStartDate(e.target.value)}
        />
        <InputReusable
          type="text"
          onFocus={(e) => (e.target.type = "time")}
          onBlur={(e) => (e.target.type = "text")}
          value={startTime}
          placeholder="Start Time"
          onChange={(e) => setStartTime(e.target.value)}
        />
        <InputReusable
          type="text"
          onFocus={(e) => (e.target.type = "time")}
          onBlur={(e) => (e.target.type = "text")}
          value={endTime}
          placeholder="End Time"
          onChange={(e) => setEndTime(e.target.value)}
        />
        <InputReusable
          type="text"
          value={location}
          placeholder="Location"
          className = {"col-span-4"}
          onChange={(e) => setLocation(e.target.value)}
          onBlur={() => setLocation(capitalizeFirstLetter(location))}
        />
      </div>
      <div>
        <textarea
          className={`w-full relative z-1 px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-gray-400 dark:placeholder:text-gray-200 dark:text-gray-200 dark:bg-gray-600
          }`}
          value={description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />
        <BtnReusable
        value={"Submit"}
        type={"add"}
        onClick={handleAddAnnouncement}
        />
      </div>
        <ActivitiesList activity={activity} setActivity={setActivity} isFullscreen={true}/>
    </div>
  </div>} />
  );
};

export default Activities;
