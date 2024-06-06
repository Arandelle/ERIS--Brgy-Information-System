import React, { useState, useEffect } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Spinner } from "./ReusableComponents/Skeleton";
import calendarImage from "../assets/calendar.svg";
import ContainerResizer from "../helper/ContainerResizer";
import InputReusable from "./ReusableComponents/InputReusable";
import BtnReusable from "./ReusableComponents/BtnReusable";
import HeadSide from "./ReusableComponents/HeaderSidebar";
import QuestionModal from "./ReusableComponents/AskCard";
import { toast } from "sonner";

function capitalizeFirstLetter(string) {
  return string.replace(/\b\w/g, char => char.toUpperCase());
}

const MyCalendar = () => {
  const localizer = momentLocalizer(moment);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [details, setDetails] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { containerSize, containerRef } = ContainerResizer();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventsToDelete, setEventToDelete] = useState(null);

  const [events, setEvents] = useState(() => {
    const storedEvents = localStorage.getItem("events");
    return storedEvents
      ? JSON.parse(storedEvents, (key, value) => {
          if (key === "start" || key === "end") {
            return new Date(value);
          }
          return value;
        })
      : [];
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "2-digit",
    });
  };

  const handleAddEvent = () => {
    if (
      !title ||
      !startDate ||
      !endDate ||
      !location ||
      !organizer ||
      !details
    ) {
      toast.warning("Please fill all the fields");
      return;
    }
    const newEvent = {
      id: Date.now(),
      title,
      start: new Date(startDate),
      end: new Date(endDate),
      location,
      organizer,
      details,
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setTitle("");
    setStartDate("");
    setEndDate("");
    setLocation("");
    setOrganizer("");
    setDetails("");
    toast.success("Event added successfully");
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setTitle(event.title);
    setStartDate(event.start.toISOString().split("T")[0]);
    setEndDate(event.end.toISOString().split("T")[0]);
    setLocation(event.location);
    setOrganizer(event.organizer);
    setDetails(event.details);
  };

  const handleUpdateEvent = () => {
    if (
      !title ||
      !startDate ||
      !endDate ||
      !location ||
      !organizer ||
      !details
    ) {
      toast.warning("Please fill all the fields");
      return;
    }
    const updatedEvent = {
      ...selectedEvent,
      id: Date.now(),
      title,
      start: new Date(startDate),
      end: new Date(endDate),
      location,
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
    setLocation("");
    setOrganizer("");
    setDetails("");
    toast.success("Event updated successfully");
  };

  const toggleDeleteModal = (id) => {
    setEventToDelete(id);
    setShowDeleteModal(!showDeleteModal);
  };

  const handleDeleteEvent = (id) => {
    const updatedEventsArray = events.filter((event) => event.id !== id);
    localStorage.setItem("events", JSON.stringify(updatedEventsArray));
    setEvents(updatedEventsArray);
    toast.error ("Event deleted");
    setShowDeleteModal(false);
  };

  const CustomAgendaEvent = ({ event }) => (
    <div>
      <strong>{event.title}</strong>
      <br />
      <span>Location: {event.location}</span>
      <span>Organizer: {event.organizer}</span>
      <br />
      <span>Details: {event.details}</span>
    </div>
  );

  return (
    <HeadSide
      child={
        <div className="m-3">
          <div className="grid justify-start grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputReusable
              type="text"
              placeholder="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTitle(title.toUpperCase())}
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
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onBlur={(e) => setLocation(capitalizeFirstLetter(location))}
            />
            <InputReusable
              type="text"
              placeholder="Organizer"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              onBlur={(e) => setOrganizer(capitalizeFirstLetter(organizer))}
            />
            <InputReusable
              type="text"
              placeholder="Details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              onBlur={(e) => setDetails(capitalizeFirstLetter(details))}
            />
            {selectedEvent ? (
              <BtnReusable
                onClick={handleUpdateEvent}
                value="Update Event"
                type={"edit"}
              />
            ) : (
              <BtnReusable
                onClick={handleAddEvent}
                value="Add Event"
                type={"add"}
              />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4">
            <div className="col-span-3 border-t-[3px] border-primary-500 text-gray-600 dark:text-gray-200 mt-2 bg-gray-200 dark:bg-gray-800">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{
                  height: 600,
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

            <div className="mr-3 ml-2" onSelectEvent={handleSelectEvent}>
              <div
                className="bg-gray-200 dark:bg-gray-800 dark:text-gray-400 h-full"
                ref={containerRef}
              >
                <div className="block mt-2 py-2 px-4 text-base text-center font-semibold border-y-[3px] border-orange-500">
                  Upcoming Events
                </div>
                <div className="scrollable-container p-4 text-gray-700 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-3">
                      <Spinner setLoading={setLoading} />
                    </div>
                  ) : events.length === 0 ? (
                    <div className="text-center flex flex-col justify-center items-center text-gray-500 dark:text-gray-400">
                      <img
                        src={calendarImage}
                        alt="Empty Image"
                        className="h-[200px] w-[200px]"
                      />
                      No events yet
                    </div>
                  ) : (
                    events.map((activity) => (
                      <div
                        key={activity.id}
                        className="mb-4 border-b pb-4 border-b-gray-500 dark:border-b-gray-200"
                      >
                        <div>
                          <h3 className="text-xl font-semibold mb-2 dark:text-green-500">
                            Title: {activity.title}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-200">
                            Date: {formatDate(activity.start)} -{" "}
                            {formatDate(activity.end)}
                          </p>
                          <p className="text-gray-700 dark:text-gray-200">
                            Location: {activity.location}
                          </p>
                          <p className="text-gray-700 dark:text-gray-200">
                            Organizer: {activity.organizer}
                          </p>
                          <p className="text-gray-700 dark:text-gray-200">
                            Details: {activity.details}
                          </p>
                          <BtnReusable
                            value={"Delete"}
                            type="delete"
                            onClick={() => toggleDeleteModal(activity.id)}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {events.length > 0 ? (
                  <div className="flex justify-end">
                    <BtnReusable
                      value="See more events "
                      link={"/events/event"}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          {showDeleteModal && (
            <QuestionModal
              toggleModal={toggleDeleteModal}
              question={
                <span>
                  Do you want to delete
                  <span className="text-primary-500 text-bold">
                    {" "}
                    {events.find((item) => item.id === eventsToDelete)?.title}
                  </span>{" "}
                  ?{" "}
                </span>
              }
              yesText={"Delete"}
              onConfirm={() => handleDeleteEvent(eventsToDelete)}
            />
          )}
        </div>
      }
    />
  );
};

export default MyCalendar;
