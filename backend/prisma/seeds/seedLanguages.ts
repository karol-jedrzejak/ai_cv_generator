import { PrismaClient } from '../../generated/prisma/client';

export async function seedLanguages(prisma: PrismaClient) {
  console.log('Seeding languages...');

  const topLanguages = [
    'English', 'Chinese', 'Hindi', 'Spanish', 'French',
    'Arabic', 'Russian', 'Portuguese',
    'Indonesian', 'German', 'Japanese', 
    'Turkish', 'Vietnamese',
    'Korean', 
    'Italian','Thai',
    'Dutch', 'Greek', 'Czech', 'Hungarian','Swedish', 'Bulgarian',
    'Slovak', 'Lithuanian', 'Georgian'
  ];

  // Mapujemy nazwy języków na obiekty do wstawienia
  const languagesData = topLanguages.map((name) => ({ name }));

  // createMany z skipDuplicates jest najszybsze przy masowym wstawianiu
  await prisma.language.createMany({
    data: languagesData,
    skipDuplicates: true,
  });

  console.log('Languages seeded successfully!');
}