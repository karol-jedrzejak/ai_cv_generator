import { Module } from '@nestjs/common';
import { TechnologiesController } from './technologies.controller';
import { TechnologiesService } from './technologies.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [TechnologiesController],
  providers: [TechnologiesService, PrismaService],
})
export class TechnologiesModule {}