import { Router } from 'express';
import {
  getAllExperiences,
  getExperienceById,
  getExperienceSlots,
} from '../controllers/experience.controller.js';

const router = Router();

// GET /api/experiences - Get all experiences
router.get('/', getAllExperiences);

// GET /api/experiences/:id - Get experience by ID with slots
router.get('/:id', getExperienceById);

// GET /api/experiences/:id/slots - Get available slots for an experience
router.get('/:id/slots', getExperienceSlots);

export default router;
