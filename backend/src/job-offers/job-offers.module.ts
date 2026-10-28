import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobOffersController } from './job-offers.controller';
import { JobOffersService } from './job-offers.service';

@Module({
  controllers: [JobOffersController],
  providers: [JobOffersService, PrismaService],
})
export class JobOffersModule {}
