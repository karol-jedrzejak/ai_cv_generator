import { PrismaClient } from '../../generated/prisma/client';

export async function seedLanguages(prisma: PrismaClient) {
  console.log('Seeding languages...');

  const topLanguages = [
  'Polski',
  'Angielski',
  'Chiński',
  'Hindi',
  'Hiszpański',
  'Francuski',
  'Arabski',
  'Rosyjski',
  'Portugalski',
  'Indonezyjski',
  'Niemiecki',
  'Japoński',
  'Turecki',
  'Wietnamski',
  'Koreański',
  'Włoski',
  'Tajski',
  'Holenderski',
  'Grecki',
  'Czeski',
  'Węgierski',
  'Szwedzki',
  'Bułgarski',
  'Słowacki',
  'Litewski',
  'Gruziński'
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