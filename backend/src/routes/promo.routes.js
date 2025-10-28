import { Router } from 'express';
import { body } from 'express-validator';
import {
  validatePromoCode,
  getActivePromoCodes,
} from '../controllers/promo.controller.js';

const router = Router();

// POST /api/promo/validate - Validate a promo code
router.post(
  '/validate',
  [
    body('code').notEmpty().withMessage('Promo code is required'),
  ],
  validatePromoCode
);

// GET /api/promo - Get all active promo codes
router.get('/', getActivePromoCodes);

export default router;
