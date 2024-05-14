// MyCalendar.jsx
import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const MyCalendar = () => {
  const localizer = momentLocalizer(moment);
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleAddEvent = () => {
    if (!title || !startDate || !endDate) {
      alert("Please Fill the Blank");
      return;
    }
    const newEvent = {
      title,
      start: new Date(startDate),
      end: new Date(endDate),
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setTitle("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="w-screen mx-6 my-5 md:mx-8 md:my-6">
      <div className="grid justify-start grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-15 my-15 gap-4">
          <input
          className="w-full px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400"
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            
          />
          <div className="relative inline-block">
            {/* <label htmlFor="startDate" className="absolute top-50% left-10 translate-y-1/2 text-green-500">Start Date</label> */}
            <input
             className="w-full relative bg-transparent z-1 px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400"
              type="text"
              onFocus={(e) => (e.target.type = 'date')}
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="relative inline-block">
            <input
             className="date-input w-full relative bg-transparent z-1 px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400"
              type="text"
              placeholder="End Date"
              value={endDate}
              onFocus={(e) => (e.target.type = 'date')}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
      <button onClick={handleAddEvent}
      className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Add Event</button>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ 
            height: 600,
            marginTop: 15,       
            marginBottom: 15,
         }}
      />
    </div>
  );
};

export default MyCalendar;
