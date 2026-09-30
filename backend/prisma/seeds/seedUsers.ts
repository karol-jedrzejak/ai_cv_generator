import { PrismaClient, UserRole, ThemePreference } from '../../generated/prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  console.log('Seeding users...');

  const passwordHash = await bcrypt.hash('Test123!', 10);

  const users = [
    {
      id: 'user-1',
      username: 'admin',
      email: 'admin@example.com',
      passwordHash,
      role: UserRole.ADMIN,
      displayName: 'Administrator',
      avatarUrl: null,
      bio: 'Test administrator account',
      isActive: true,
      isEmailVerified: true,
      themePreference: ThemePreference.SYSTEM,
    },
    {
      id: 'user-2',
      username: 'testuser',
      email: 'user@example.com',
      passwordHash,
      role: UserRole.USER,
      displayName: 'Test User',
      avatarUrl: null,
      bio: 'Test user account',
      isActive: true,
      isEmailVerified: true,
      themePreference: ThemePreference.LIGHT,
    },
  ];

  for (const userData of users) {
    await prisma.user.upsert({
      where: {
        id: userData.id,
      },
      update: {
        username: userData.username,
        email: userData.email,
        passwordHash: userData.passwordHash,
        role: userData.role,
        displayName: userData.displayName,
        avatarUrl: userData.avatarUrl,
        bio: userData.bio,
        isActive: userData.isActive,
        isEmailVerified: userData.isEmailVerified,
        themePreference: userData.themePreference,
      },
      create: userData,
    });
  }

  console.log('Users seeded!');
}