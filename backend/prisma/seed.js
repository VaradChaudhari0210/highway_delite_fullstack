import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.promoCode.deleteMany();

  // Create promo codes
  const promoCodes = await Promise.all([
    prisma.promoCode.create({
      data: {
        code: 'SAVE10',
        type: 'PERCENTAGE',
        value: 10,
        isActive: true,
        maxUses: 100,
      },
    }),
    prisma.promoCode.create({
      data: {
        code: 'FLAT100',
        type: 'FIXED',
        value: 100,
        isActive: true,
        maxUses: 50,
      },
    }),
    prisma.promoCode.create({
      data: {
        code: 'WELCOME20',
        type: 'PERCENTAGE',
        value: 20,
        isActive: true,
        maxUses: 200,
      },
    }),
  ]);

  console.log('✅ Created promo codes:', promoCodes.map((p) => p.code).join(', '));

  // Create experiences
  const experiences = await Promise.all([
    prisma.experience.create({
      data: {
        title: 'Kayaking',
        location: 'Udupi',
        description:
          'Curated small-group experience. Certified guide. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking. Explore the beautiful backwaters and coastal areas of Udupi while enjoying this thrilling water sport.',
        shortDescription: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        price: 999,
        imageUrl: 'https://images.pexels.com/photos/2049422/pexels-photo-2049422.jpeg',
      },
    }),
    prisma.experience.create({
      data: {
        title: 'Nandi Hills Sunrise',
        location: 'Bangalore',
        description:
          'Curated small-group experience. Certified guide. Safety first with gear included. Experience the beautiful sunrise from Nandi Hills. Wake up early and witness the breathtaking views as the sun rises over the hills, painting the sky in vibrant colors.',
        shortDescription: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        price: 899,
        imageUrl: 'https://images.pexels.com/photos/1118874/pexels-photo-1118874.jpeg',
      },
    }),
    prisma.experience.create({
      data: {
        title: 'Coffee Trail',
        location: 'Coorg',
        description:
          'Curated small-group experience. Certified guide. Safety first with gear included. Explore the coffee plantations of Coorg. Learn about coffee cultivation, processing, and enjoy freshly brewed coffee amidst the lush greenery.',
        shortDescription: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        price: 1299,
        imageUrl: 'https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg',
      },
    }),
    prisma.experience.create({
      data: {
        title: 'Beach Kayaking',
        location: 'Udupi, Karnataka',
        description:
          'Curated small-group experience. Certified guide. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking. Paddle through the pristine beaches and explore the coastal beauty.',
        shortDescription: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        price: 999,
        imageUrl: 'https://images.pexels.com/photos/1430675/pexels-photo-1430675.jpeg',
      },
    }),
    prisma.experience.create({
      data: {
        title: 'Nandi Hills Trek',
        location: 'Bangalore',
        description:
          'Curated small-group experience. Certified guide. Safety first with gear included. Experience the beautiful sunrise from Nandi Hills. Trek through scenic trails and enjoy panoramic views from the top.',
        shortDescription: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        price: 899,
        imageUrl: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg',
      },
    }),
    prisma.experience.create({
      data: {
        title: 'Boat Cruise',
        location: 'Sunderban',
        description:
          'Curated small-group experience. Certified guide. Safety first with gear included. Enjoy a peaceful boat cruise through the mangrove forests of Sunderban. Spot wildlife and enjoy the serene beauty of nature.',
        shortDescription: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        price: 999,
        imageUrl: 'https://images.pexels.com/photos/163236/luxury-yacht-boat-speed-water-163236.jpeg',
      },
    }),
    prisma.experience.create({
      data: {
        title: 'Bunjee Jumping',
        location: 'Manali',
        description:
          'Curated small-group experience. Certified guide. Safety first with gear included. Experience the thrill of bunjee jumping from great heights. Feel the adrenaline rush as you take the leap of faith.',
        shortDescription: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        price: 1499,
        imageUrl: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
      },
    }),
    prisma.experience.create({
      data: {
        title: 'Coffee Plantation Tour',
        location: 'Coorg',
        description:
          'Curated small-group experience. Certified guide. Safety first with gear included. Explore the coffee plantations of Coorg. Walk through sprawling estates and learn the journey from bean to cup.',
        shortDescription: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        price: 1299,
        imageUrl: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg',
      },
    }),
  ]);

  console.log('✅ Created', experiences.length, 'experiences');

  const today = new Date();
  const dates = [
    new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
    new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), 
    new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), 
    new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000), 
    new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), 
  ];

  const times = ['07:00 AM', '09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'];

  let slotCount = 0;
  for (const experience of experiences) {
    for (const date of dates) {
      for (const time of times) {
        const totalSlots = Math.floor(Math.random() * 8) + 3;
        const bookedSlots = Math.floor(Math.random() * totalSlots * 0.5); 
        const availableSlots = totalSlots - bookedSlots;

        await prisma.slot.create({
          data: {
            experienceId: experience.id,
            date,
            time,
            totalSlots,
            availableSlots,
          },
        });
        slotCount++;
      }
    }
  }

  console.log('✅ Created', slotCount, 'slots');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
