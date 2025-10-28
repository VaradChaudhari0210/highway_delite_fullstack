import { Router } from 'express';
import { body } from 'express-validator';
import {
  createBooking,
  getBookingByReferenceId,
  getAllBookings,
} from '../controllers/booking.controller.js';

const router = Router();

// POST /api/bookings - Create a new booking
router.post(
  '/',
  [
    body('experienceId').notEmpty().withMessage('Experience ID is required'),
    body('slotId').notEmpty().withMessage('Slot ID is required'),
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  createBooking
);

// GET /api/bookings/:referenceId - Get booking by reference ID
router.get('/:referenceId', getBookingByReferenceId);

// GET /api/bookings - Get all bookings
router.get('/', getAllBookings);

export default router;
