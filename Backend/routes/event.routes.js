import express from 'express';
import {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/event.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
 
router.route('/').post(protect, createEvent).get(getAllEvents);
router
  .route('/:id')
  .get(protect, getEvent)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

export default router;
