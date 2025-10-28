import prisma from '../lib/prisma.js';

// Validate promo code
export const validatePromoCode = async (req, res) => {
  try {
    const { code, amount } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Promo code is required',
      });
    }

    const promo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promo) {
      return res.status(404).json({
        success: false,
        error: 'Invalid promo code',
      });
    }

    if (!promo.isActive) {
      return res.status(400).json({
        success: false,
        error: 'Promo code is inactive',
      });
    }

    // Check if promo has reached max uses
    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return res.status(400).json({
        success: false,
        error: 'Promo code has reached maximum usage limit',
      });
    }

    // Check if promo has expired
    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Promo code has expired',
      });
    }

    // Calculate discount
    let discount = 0;
    if (amount) {
      if (promo.type === 'PERCENTAGE') {
        discount = (amount * promo.value) / 100;
      } else {
        discount = promo.value;
      }
    }

    res.json({
      success: true,
      data: {
        code: promo.code,
        type: promo.type,
        value: promo.value,
        discount,
      },
      message: 'Promo code is valid',
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate promo code',
    });
  }
};

// Get all active promo codes (for admin or display purposes)
export const getActivePromoCodes = async (req, res) => {
  try {
    const promoCodes = await prisma.promoCode.findMany({
      where: {
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } },
        ],
      },
    });

    res.json({
      success: true,
      data: promoCodes,
    });
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch promo codes',
    });
  }
};
