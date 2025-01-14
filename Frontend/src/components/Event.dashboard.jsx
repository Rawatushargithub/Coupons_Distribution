import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axiosInstance from "../axios.instance"; // Import the custom Axios instance

// Initialize Socket.IO
const socket = io("http://localhost:8000/api/v1/events"); // Replace with your backend URL

const EventDashboard = () => {
  const [events, setEvents] = useState([]); // State for events
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
  }); // State for form input

  // Fetch initial events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get("/events"); // Automatically includes the token
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error.message);
      }
    };

    fetchEvents();

    // Real-time updates
    socket.on("eventCreated", (newEvent) => {
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    });

    socket.on("eventDeleted", (eventId) => {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId)
      );
    });

    return () => {
      socket.off("eventCreated");
      socket.off("eventDeleted");
    };
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/events", formData);
      const newEvent = response.data;
      console.log(newEvent)
      setFormData({ name: "", description: "", date: "", time: "" });
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      toast.success("Event created successfully!");
      
    } catch (error) {
      console.error("Error creating event:", error.message);
      toast.error("Failed to create event. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event Dashboard</h1>

      {/* Event Creation Form */}
      <form className="mb-6" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">
            Event Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
        >
          Create Event
        </button>
      </form>

      {/* Event List */}
      <ul>
        {events.map((event) => (
          <li key={event._id} className="mb-2">
            <div className="p-4 bg-black rounded-md text-white shadow-md">
              <h3 className="text-lg font-semibold">{event.name}</h3>
              <p>{event.description}</p>
              <p>
                {new Date(event.date).toLocaleDateString()} at {event.time}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default EventDashboard;
