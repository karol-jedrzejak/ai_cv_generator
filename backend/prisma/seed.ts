import dotenv from 'dotenv';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { seedUsers } from './seeds/seedUsers';
import { seedLanguages } from './seeds/seedLanguages';
import { seedTechnologies } from './seeds/seedTechnology';


const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding database...');

    await seedUsers(prisma);
    await seedLanguages(prisma);
    await seedTechnologies(prisma);

    console.log('🌱 Seed completed!');
}

main()
    .catch((error) => {
        console.error('❌ Seed failed:');
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });