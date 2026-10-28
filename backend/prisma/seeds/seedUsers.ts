import { PrismaClient, ThemePreference } from '../../generated/prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  console.log('Seeding users...');

  const passwordHash = await bcrypt.hash('Test123!', 10);

  const users = [
    {
      id: 'user-1',
      name: 'Jan',
      surname: 'Kowalski',
      mobilePhone: '+48 123 456 789',
      hometown: 'Warsaw',
      username: 'jan.kowalski',
      email: 'jan.kowalski@example.com',
      passwordHash,

      avatarUrl: null,

      isActive: true,
      emailVerifiedAt: new Date(),

      themePreference: ThemePreference.SYSTEM,
      locale: 'pl-PL',
      timezone: 'Europe/Warsaw',

      lastLoginAt: null,
    },
    {
      id: 'user-2',
      name: 'Anna',
      surname: 'Nowak',
      mobilePhone: '+48 123 456 789',
      hometown: 'Warsaw',
      username: 'anna.nowak',
      email: 'anna.nowak@example.com',
      passwordHash,

      avatarUrl: null,

      isActive: true,
      emailVerifiedAt: new Date(),

      themePreference: ThemePreference.LIGHT,
      locale: 'pl-PL',
      timezone: 'Europe/Warsaw',

      lastLoginAt: null,
    },
  ];

  for (const userData of users) {
    await prisma.user.upsert({
      where: {
        id: userData.id,
      },
      update: {
        name: userData.name,
        surname: userData.surname,
        mobilePhone: userData.mobilePhone,
        hometown: userData.hometown,
        username: userData.username,
        email: userData.email,
        passwordHash: userData.passwordHash,

        avatarUrl: userData.avatarUrl,

        isActive: userData.isActive,
        emailVerifiedAt: userData.emailVerifiedAt,

        themePreference: userData.themePreference,
        locale: userData.locale,
        timezone: userData.timezone,

        lastLoginAt: userData.lastLoginAt,
      },
      create: userData,
    });
  }

  console.log('Users seeded successfully!');
}
