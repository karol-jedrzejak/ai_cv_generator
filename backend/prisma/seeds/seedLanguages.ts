import { PrismaClient } from '../../generated/prisma/client';

export async function seedLanguages(prisma: PrismaClient) {
  console.log('Seeding languages...');

  const topLanguages = [
    'English', 'Mandarin Chinese', 'Hindi', 'Spanish', 'French',
    'Standard Arabic', 'Bengali', 'Russian', 'Portuguese', 'Urdu',
    'Indonesian', 'German', 'Japanese', 'Nigerian Pidgin', 'Marathi',
    'Telugu', 'Turkish', 'Tamil', 'Yue Chinese (Cantonese)', 'Vietnamese',
    'Tagalog (Filipino)', 'Wu Chinese (Shanghainese)', 'Korean', 'Iranian Persian (Farsi)', 'Hausa',
    'Egyptian Spoken Arabic', 'Swahili', 'Javanese', 'Italian', 'Western Punjabi',
    'Kannada', 'Gujarati', 'Thai', 'Xiang Chinese', 'Southern Min (Hokkien)',
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