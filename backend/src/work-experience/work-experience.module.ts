import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkExperienceController } from './work-experience.controller';
import { WorkExperienceService } from './work-experience.service';

@Module({
  controllers: [WorkExperienceController],
  providers: [WorkExperienceService, PrismaService],
})
export class WorkExperienceModule {}
