import prisma from '../lib/prisma.js';

// Get all experiences
export const getAllExperiences = async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: experiences,
    });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch experiences',
    });
  }
};

// Get single experience by ID
export const getExperienceById = async (req, res) => {
  try {
    const { id } = req.params;

    const experience = await prisma.experience.findUnique({
      where: { id },
      include: {
        slots: {
          where: {
            date: {
              gte: new Date(),
            },
          },
          orderBy: [
            { date: 'asc' },
            { time: 'asc' },
          ],
        },
      },
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found',
      });
    }

    const slotsByDate = experience.slots.reduce((acc, slot) => {
      const dateStr = slot.date.toISOString().split('T')[0];
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push({
        id: slot.id,
        time: slot.time,
        availableSlots: slot.availableSlots,
        totalSlots: slot.totalSlots,
      });
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        ...experience,
        slotsByDate,
      },
    });
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch experience details',
    });
  }
};

// Get available slots for an experience
export const getExperienceSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const experience = await prisma.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found',
      });
    }

    const whereClause = {
      experienceId: id,
      date: {
        gte: new Date(),
      },
    };

    if (date) {
      const selectedDate = new Date(date);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      whereClause.date = {
        gte: selectedDate,
        lt: nextDay,
      };
    }

    const slots = await prisma.slot.findMany({
      where: whereClause,
      orderBy: [
        { date: 'asc' },
        { time: 'asc' },
      ],
    });

    res.json({
      success: true,
      data: slots,
    });
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch slots',
    });
  }
};
