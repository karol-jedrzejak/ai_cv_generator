import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeneratedCvsController } from './generated-cvs.controller';
import { GeneratedMotivationLettersController } from './generated-motivation-letters.controller';
import { JobOffersController } from './job-offers.controller';
import { JobOffersService } from './job-offers.service';

@Module({
  controllers: [
    JobOffersController,
    GeneratedCvsController,
    GeneratedMotivationLettersController,
  ],
  providers: [JobOffersService, PrismaService],
})
export class JobOffersModule {}
