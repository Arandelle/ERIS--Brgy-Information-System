import React, { useState, useEffect, useRef } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Toggle } from "../hooks/Toggle";
import { Spinner } from "./ReusableComponents/Skeleton";
import Header from "./Header";
import Sidebar from "./Sidebar/Sidebar";
import calendarImage from "../assets/calendar.svg"
import ContainerResizer from "../helper/ContainerResizer";
import InputReusable from "./ReusableComponents/InputReusable";
import BtnReusable from "./ReusableComponents/BtnReusable";

const MyCalendar = () => {
  const { isOpen, toggleDropdown } = Toggle();
  const localizer = momentLocalizer(moment);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [details, setDetails] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const { containerSize, containerRef } = ContainerResizer();
  
  const [events, setEvents] = useState(() => {
    const storedEvents = localStorage.getItem('events');
    return storedEvents ? JSON.parse(storedEvents, (key, value) => {
      if (key === "start" || key === "end") {
        return new Date(value);
      }
      return value;
    }) : [];
  });

  // handle navigation for the components
  // const navigate = useNavigate();
  // const handleNavigation = (link) => {
  //   navigate(link);
  // };

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(()=>{
    localStorage.setItem('events', JSON.stringify(events));
  },[events])

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
    setStartDate(event.start.toISOString().split("T")[0]);
    setEndDate(event.end.toISOString().split("T")[0]);
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
          className={`w-screen p-4 dark:bg-gray-800 dark:text-white ${
            isOpen ? "ml-0" : "md:ml-60"
          }`}
        >
          <div className="grid justify-start grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputReusable
              type="text"
              placeholder="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <InputReusable
              type="text"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <InputReusable
              type="text"
              placeholder="End Date"
              value={endDate}
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <InputReusable
              type="text"
              placeholder="Organizer"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
            />
            <InputReusable
              type="text"
              placeholder="Details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
            {selectedEvent ? (
              <BtnReusable onClick={handleUpdateEvent} value="Update Event" type={"edit"} />
            ) : ( <BtnReusable onClick={handleAddEvent} value="Add Event" type={"add"} />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4">
            <div className="col-span-3">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{
                  height: 600,
                  marginTop: 15,
                  marginBottom: 15,
                  paddingTop: 10,
                }}
                components={{
                  agenda: {
                    event: CustomAgendaEvent,
                  },
                }}
                onSelectEvent={handleSelectEvent}
              />
            </div>
            <div className="mr-3 ml-2"  onSelectEvent={handleSelectEvent}>
              <div
                className="bg-gray-200 shadow-md dark:bg-gray-800 dark:text-gray-400 h-full"
                ref={containerRef}
              >
                <div className="block py-2 px-4 text-base text-center font-semibold border-[3px] border-gray-400">
                  Upcoming Events
                </div>
                <div className="scrollable-container p-4 text-gray-700 overflow-y-auto max-h-screen">
                  {loading ? (
                    <div className="flex items-center justify-center py-3">
                      <Spinner setLoading={setLoading} />
                    </div>
                  ) : events.length === 0 ? (
                    <div className="text-center flex flex-col justify-center items-center text-gray-500 dark:text-gray-400">
                    <img src={calendarImage} alt="Empty Image"  className="h-[200px] w-[200px]" />
                    No events yet
                   </div>
                  ) : (
                    events.map((activity, key) => (
                      <div key={key} className="mb-4 border-b pb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2 dark:text-green-500">
                            Title: {activity.title}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-200">
                            Date: {activity.start.toISOString().split("T")[0]} - {activity.end.toISOString().split("T")[0]}
                          </p>
                          <p className="text-gray-700 dark:text-gray-200">
                            Organizer: {activity.organizer}
                          </p>
                          <p className="text-gray-700 dark:text-gray-200">
                            Details: {activity.details}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <BtnReusable value="Show More" link={"/events/announcement"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCalendar;
