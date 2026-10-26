import { Module } from '@nestjs/common';
import { UserTechnologiesController } from './user-technologies.controller';
import { UserTechnologiesService } from './user-technologies.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UserTechnologiesController],
  providers: [UserTechnologiesService, PrismaService],
})
export class UserTechnologiesModule {}