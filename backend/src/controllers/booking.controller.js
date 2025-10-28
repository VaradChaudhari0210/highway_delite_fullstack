import { validationResult } from 'express-validator';
import prisma from '../lib/prisma.js';

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { experienceId, slotId, fullName, email, quantity, promoCode } = req.body;

    const experience = await prisma.experience.findUnique({
      where: { id: experienceId },
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found',
      });
    }

    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
    });

    if (!slot) {
      return res.status(404).json({
        success: false,
        error: 'Slot not found',
      });
    }

    if (slot.availableSlots < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Not enough slots available',
        availableSlots: slot.availableSlots,
      });
    }

    let subtotal = experience.price * quantity;
    let discount = 0;

    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({
        where: { code: promoCode.toUpperCase() },
      });

      if (promo && promo.isActive) {
        if (!promo.maxUses || promo.usedCount < promo.maxUses) {
          if (!promo.expiresAt || promo.expiresAt > new Date()) {
            if (promo.type === 'PERCENTAGE') {
              discount = (subtotal * promo.value) / 100;
            } else {
              discount = promo.value;
            }

            await prisma.promoCode.update({
              where: { code: promoCode.toUpperCase() },
              data: { usedCount: { increment: 1 } },
            });
          }
        }
      }
    }

    const taxes = Math.round((subtotal - discount) * 0.059); // 5.9% tax
    const total = subtotal - discount + taxes;

    const referenceId = `BK${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const booking = await prisma.$transaction(async (tx) => {
      const currentSlot = await tx.slot.findUnique({
        where: { id: slotId },
      });

      if (!currentSlot || currentSlot.availableSlots < quantity) {
        throw new Error('Not enough slots available. Someone may have just booked this slot.');
      }

      const updatedSlot = await tx.slot.update({
        where: {
          id: slotId,
          availableSlots: {
            gte: quantity,
          },
        },
        data: {
          availableSlots: {
            decrement: quantity,
          },
        },
      });

      if (!updatedSlot) {
        throw new Error('Failed to reserve slots. Please try again.');
      }

      // Create booking
      return tx.booking.create({
        data: {
          experienceId,
          slotId,
          fullName,
          email,
          quantity,
          subtotal,
          taxes,
          discount,
          total,
          promoCode: promoCode?.toUpperCase() || null,
          referenceId,
          status: 'CONFIRMED',
        },
        include: {
          experience: true,
          slot: true,
        },
      });
    });

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully',
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    
    if (error.message && error.message.includes('Not enough slots available')) {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create booking',
    });
  }
};

// Get booking by reference ID
export const getBookingByReferenceId = async (req, res) => {
  try {
    const { referenceId } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { referenceId },
      include: {
        experience: true,
        slot: true,
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking',
    });
  }
};

// Get all bookings (for admin purposes)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        experience: true,
        slot: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings',
    });
  }
};
