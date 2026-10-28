import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';

@Module({
  controllers: [EducationController],
  providers: [EducationService, PrismaService],
})
export class EducationModule {}
