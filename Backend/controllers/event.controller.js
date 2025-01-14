import Event from '../models/event.models.js';
import { io } from '../server.js'; // Import the Socket.IO instance

// Create Event 
export const createEvent = async (req, res) => {
  try {
    const { name, description, date, category, image } = req.body;

        // Owner will be set from the logged_in user ID
        const event = await Event.create({
          name,
          description,
          date,
          category,
          image,
          owner: req.user.id,
        });

    // Emit real-time event to all connected clients
    io.emit('eventCreated', event);

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// // Create Event
// export const createEvent = async (req, res) => {
//   try {
//     const { name, description, date, category, image } = req.body;

//     // Owner will be set from the logged_in user ID
//     const event = await Event.create({
//       name,
//       description,
//       date,
//       category,
//       image,
//       owner: req.user.id,
//     });

//     res.status(201).json(event);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Get All Events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('owner', 'name email');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Event
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('owner', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to update this event' });

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Event
// export const deleteEvent = async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     console.log(event)
//     if (!event) return res.status(404).json({ message: 'Event not found' });
//     if (event.owner.toString() !== req.user.id)
//       return res.status(403).json({ message: 'Not authorized to delete this event' });

//     await event.deleteOne();
//     res.status(200).json({ message: 'Event deleted' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Delete Event
export const deleteEvent = async (req, res) => {
    try {
      const { id } = req.params;
      const event = await Event.findByIdAndDelete(id);
  
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      if (event.owner.toString() !== req.user.id)
        return res.status(403).json({ message: 'Not authorized to delete this event' });
  
      // Emit real-time event to all connected clients
      io.emit('eventDeleted', id);
  
      res.status(200).json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
