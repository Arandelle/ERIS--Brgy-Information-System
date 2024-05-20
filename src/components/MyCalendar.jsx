import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Toggle } from "../hooks/Toggle";
import Header from "./Header";
import Sidebar from "./Sidebar/Sidebar";

const MyCalendar = () => {
  const { isOpen, toggleDropdown } = Toggle();
  const localizer = momentLocalizer(moment);
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [details, setDetails] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleAddEvent = () => {
    if (!title || !startDate || !endDate || !organizer || !details) {
      alert("Please fill all the fields");
      return;
    }
    const newEvent = {
      title,
      start: new Date(startDate),
      end: new Date(endDate),
      organizer,
      details,
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setTitle("");
    setStartDate("");
    setEndDate("");
    setOrganizer("");
    setDetails("");
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setTitle(event.title);
    setStartDate(event.start.toISOString().split('T')[0]);
    setEndDate(event.end.toISOString().split('T')[0]);
    setOrganizer(event.organizer);
    setDetails(event.details);
  };

  const handleUpdateEvent = () => {
    if (!title || !startDate || !endDate || !organizer || !details) {
      alert("Please fill all the fields");
      return;
    }
    const updatedEvent = {
      ...selectedEvent,
      title,
      start: new Date(startDate),
      end: new Date(endDate),
      organizer,
      details,
    };

    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event === selectedEvent ? updatedEvent : event
      )
    );
    setSelectedEvent(null);
    setTitle("");
    setStartDate("");
    setEndDate("");
    setOrganizer("");
    setDetails("");
  };

  const CustomAgendaEvent = ({ event }) => (
    <div>
      <strong>{event.title}</strong>
      <br />
      <span>Organizer: {event.organizer}</span>
      <br />
      <span>Details: {event.details}</span>
    </div>
  );

  return (
    <div className="flex flex-col w-full">
      <Header toggleSideBar={toggleDropdown} />
      <div className="flex">
        <div className="fixed z-50">
          <Sidebar isOpen={isOpen} toggleSidebar={toggleDropdown} />
        </div>
        <div
          className={`w-screen p-4 dark:bg-gray-800 dark:text-white rounded-md mx-6 my-5 md:mx-8 md:my-5 ${
            isOpen ? "ml-10" : "md:ml-64"
          }`}
        >
          <div className="grid justify-start grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-15 my-15 gap-4">
            <input
              className="w-full px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400 dark:placeholder:text-gray-50 dark:text-white dark:bg-gray-600"
              type="text"
              placeholder="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="w-full relative z-1 px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400 dark:placeholder:text-gray-50 dark:bg-gray-600"
              type="text"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              className="date-input w-full relative z-1 px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400 dark:placeholder:text-gray-50 dark:bg-gray-600"
              type="text"
              placeholder="End Date"
              value={endDate}
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <input
              className="w-full px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400 dark:placeholder:text-gray-50 dark:text-white dark:bg-gray-600"
              type="text"
              placeholder="Organizer"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
            />
            <input
              className="w-full px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400 dark:placeholder:text-gray-50 dark:text-white dark:bg-gray-600"
              type="text"
              placeholder="Details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
            {selectedEvent ? (
              <button
                onClick={handleUpdateEvent}
                className="px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:bg-green-600"
              >
                Update Event
              </button>
            ) : (
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                Add Event
              </button>
            )}
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
            components={{
              agenda: {
                event: CustomAgendaEvent,
              },
            }}
            onSelectEvent={handleSelectEvent}
          />
        </div>
      </div>
    </div>
  );
};

export default MyCalendar;
