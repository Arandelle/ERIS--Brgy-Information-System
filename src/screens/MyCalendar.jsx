import React, { useState, useEffect } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Spinner } from "../components/ReusableComponents/Skeleton";
import ContainerResizer from "../helper/ContainerResizer";
import InputReusable from "../components/ReusableComponents/InputReusable";
import ButtonStyle from "../components/ReusableComponents/Button";
import HeadSide from "../components/ReusableComponents/HeaderSidebar";
import QuestionModal from "../components/ReusableComponents/AskCard";
import { toast } from "sonner";
import { formatDate, formatTime } from "../helper/FormatDate";
import EmptyLogo from "../components/ReusableComponents/EmptyLogo";
import icons from "../assets/icons/Icons";
import { capitalizeFirstLetter } from "../helper/CapitalizeFirstLetter";
import useFetchActivity from "../hooks/useFetchActivity";
import handleAddData from "../hooks/handleAddData";
import handleEditData from "../hooks/handleEditData";
import handleDeleteData from "../hooks/handleDeleteData";
import ActivityDetails from "./ActivityDetails";

const CustomToolbar = ({ label, onNavigate, onView, handleAddEventModal }) => {
  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onNavigate("TODAY")}>
          Today
        </button>
        <button type="button" onClick={() => onNavigate("PREV")}>
          Back
        </button>
        <button type="button" onClick={() => onNavigate("NEXT")}>
          Next
        </button>
        <button
          class="toolbar-btn-addEvent"
          onClick={() => handleAddEventModal(null)}
        >
          Add Events
        </button>
      </span>
      <span className="rbc-toolbar-label">{label}</span>
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onView("month")}>
          Month
        </button>
        <button type="button" onClick={() => onView("week")}>
          Week
        </button>
        <button type="button" onClick={() => onView("day")}>
          Day
        </button>
      </span>
    </div>
  );
};
const MyCalendar = () => {
  const localizer = momentLocalizer(moment);
  const { activity, setActivity } = useFetchActivity("events");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { containerSize, containerRef } = ContainerResizer();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventsToDelete, setEventToDelete] = useState(null);
  const [addEventModal, setAddEventModal] = useState(false);
  const [eventDetailModal, setEventDetailModal] = useState(false);

  const events = activity.map((event) => ({
    id: event.id,
    title: event.title,
    start: new Date(event.startDate),
    end: new Date(event.endDate),
    location: event.location,
    organizer: event.organizer,
    details: event.description,
    image: event.imageUrl,
  }));

  const handleAddEventModal = (event) => {
    if (event) {
      setSelectedEvent(event);
      setTitle(event.title);
      setStartDate(event.start.toISOString().split("T")[0]);
      setEndDate(event.end.toISOString().split("T")[0]);
      setLocation(event.location);
      setOrganizer(event.organizer);
      setDetails(event.details);
      setImage(event.imageUrl);
    } else {
      setSelectedEvent(null);
      setTitle("");
      setStartDate("");
      setEndDate("");
      setLocation("");
      setOrganizer("");
      setDetails("");
      setImage(null);
    }
    setAddEventModal(true);
    setEventDetailModal(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
    }
  };
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setEventDetailModal(true);
  };

  const handleCloseAddEventModal = () => {
    setAddEventModal(false);
    setSelectedEvent(null);
  };

  const handleCloseDetailModal = () => {
    setEventDetailModal(false);
    setSelectedEvent(null);
  };

  const handleAddOrUpdateEvent = async () => {
    if (
      new Date(startDate) > new Date(endDate) ||
      new Date(startDate) < new Date().setHours(0, 0, 0, 0)
    ) {
      toast.warning("Start date must be before the end date");
      return;
    }

    const eventData = {
      id: selectedEvent ? selectedEvent.id : Date.now(),
      title,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      location,
      organizer,
      image,
      description: details,
    };

    if (selectedEvent) {
      await handleEditData(selectedEvent.id, eventData, "events");
    } else {
      await handleAddData(eventData, "events");
    }

    handleCloseAddEventModal();
  };

  const toggleDeleteModal = (id) => {
    setEventToDelete(id);
    setShowDeleteModal(!showDeleteModal);
  };

  const handleDeleteEvent = async () => {
    const itemToDelete = activity.find((item) => item.id === eventsToDelete);
    setActivity((prevAct) =>
      prevAct.filter((item) => item.id !== eventsToDelete)
    );
    try {
      await handleDeleteData(eventsToDelete, "events");
    } catch (error) {
      setActivity((prevActivity) => [...prevActivity, itemToDelete]);
      console.error("Error deleting an item: ", error);
    }
    setShowDeleteModal(!showDeleteModal);
  };

  const CustomAgendaEvent = ({ event }) => (
    <div className="flex flex-row items-center space-x-2">
      <img
        alt="not available"
        src={event.image}
        className="h-12 w-12 rounded-full"
      />
      <div>
        <p className="text-sm">{event?.title}</p>
        <p className="text-sm">
          {formatTime(event?.start)} - {formatTime(event?.end)}
        </p>
        <p className="text-sm">{event?.description}</p>
      </div>
    </div>
  );

  // Add this temporarily to check your data
  useEffect(() => {
    console.log("All activities:", activity);
    activity.forEach((event) => {
      console.log("Event image URL:", event.imageUrl);
    });
  }, [activity]);

  return (
    <HeadSide
      child={
        <>
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
                  toolbar: (toolbarProps) => (
                    <CustomToolbar
                      {...toolbarProps}
                      handleAddEventModal={handleAddEventModal}
                    />
                  ),
                  agenda: {
                    event: CustomAgendaEvent,
                  },
                  event: CustomAgendaEvent,
                }}
                onSelectEvent={handleSelectEvent}
              />
            </div>

            {addEventModal && (
              <div className="fixed flex items-center justify-center inset-0 z-50">
                <div
                  className="fixed h-full w-full bg-gray-600 bg-opacity-50"
                  onClick={handleCloseAddEventModal}
                ></div>
                <div className="relative p-5 bg-white rounded-md shadow-md">
                  <h2 className="py-2 px-2 text-primary-500 border-2 mb-5">
                    {selectedEvent ? "Edit Event" : "Add New Event"}
                  </h2>
                  <button
                    className="absolute p-2 top-0 right-0"
                    onClick={handleCloseAddEventModal}
                  >
                    <icons.close style={{ fontSize: "large" }} />
                  </button>
                  <div className="flex flex-col justify-between space-y-2">
                    <div className="grid justify-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <InputReusable
                        type="text"
                        placeholder="Event Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={() => setTitle(capitalizeFirstLetter(title))}
                      />
                      <InputReusable
                        type="text"
                        onFocus={(e) => (e.target.type = "datetime-local")}
                        onBlur={(e) => (e.target.type = "text")}
                        placeholder="Start Date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      <InputReusable
                        type="text"
                        placeholder="End Date"
                        value={endDate}
                        onFocus={(e) => (e.target.type = "datetime-local")}
                        onBlur={(e) => (e.target.type = "text")}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                      <InputReusable
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onBlur={(e) =>
                          setLocation(capitalizeFirstLetter(location))
                        }
                      />
                      <InputReusable
                        type="text"
                        placeholder="Organizer"
                        value={organizer}
                        onChange={(e) => setOrganizer(e.target.value)}
                        onBlur={(e) =>
                          setOrganizer(capitalizeFirstLetter(organizer))
                        }
                      />
                      <InputReusable
                        type="text"
                        placeholder="Details"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        onBlur={(e) =>
                          setDetails(capitalizeFirstLetter(details))
                        }
                      />
                      <InputReusable type="file" onChange={handleImageChange} />
                      <ButtonStyle
                        onClick={handleAddOrUpdateEvent}
                        label={selectedEvent ? "Update Event" : "Add Event"}
                        color={selectedEvent ? "green" : "blue"}
                        icon={selectedEvent ? icons.edit : icons.addCircle}
                        fontSize={"small"}
                      />
                      <ButtonStyle
                        onClick={handleCloseAddEventModal}
                        label="Cancel"
                        color="gray"
                        fontSize={"small"}
                        icon={icons.close}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="mr-3 ml-2" onSelectEvent={handleSelectEvent}>
              <div
                className="bg-gray-200 dark:bg-gray-800 dark:text-gray-400 h-full"
                ref={containerRef}
              >
                <div className="block mt-2 py-2 px-4 text-base text-center font-semibold border-y-[3px] border-orange-500">
                  Upcoming Events
                </div>
                <div className="scrollable-container p-2 text-gray-700 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-3">
                      <Spinner setLoading={setLoading} />
                    </div>
                  ) : activity.length === 0 ? (
                    <EmptyLogo message={"No activity yet"} />
                  ) : (
                    activity
                      .map((activity) => (
                        <div
                          key={activity.id}
                          className="mb-3 border-b pb-4 border-b-gray-500 dark:border-b-gray-200"
                        >
                          <div>
                            <img src={activity.imageUrl} alt="not defined" />
                            <h2 className="font-semibold mb-2 dark:text-green-500">
                              Title: {activity.title}
                            </h2>
                            <p className="text-gray-700 dark:text-gray-200">
                              {activity.location}
                            </p>
                            <p className="text-gray-700 dark:text-gray-200">
                              Organizer: {activity.organizer}
                            </p>
                            <p className="text-gray-700 dark:text-gray-200">
                              Details: {activity.description}
                            </p>
                            <ButtonStyle
                              label={"Delete"}
                              color={"red"}
                              fontSize={"small"}
                              icon={icons.delete}
                              onClick={() => toggleDeleteModal(activity.id)}
                            />
                          </div>
                        </div>
                      ))
                      .slice(0, 2)
                  )}
                </div>
                {activity.length > 1 ? (
                  <div className="flex justify-end">
                    <ButtonStyle
                      icon={icons.view}
                      color={"blue"}
                      fontSize={"small"}
                      label="See more events "
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
                    {activity.find((item) => item.id === eventsToDelete)?.title}
                  </span>{" "}
                  ?{" "}
                </span>
              }
              yesText={"Delete"}
              onConfirm={() => handleDeleteEvent(eventsToDelete)}
            />
          )}

          {eventDetailModal && (
                <ActivityDetails 
                  handleCloseDetailModal={handleCloseDetailModal}
                  handleAddEventModal={handleAddEventModal}
                  selectedEvent={selectedEvent}
                />
              )}
        </>
      }
    />
  );
};

export default MyCalendar;
