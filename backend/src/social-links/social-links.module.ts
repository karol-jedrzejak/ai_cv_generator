import { Module } from '@nestjs/common';
import { SocialLinksController } from './social-links.controller';
import { SocialLinksService } from './social-links.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SocialLinksController],
  providers: [SocialLinksService, PrismaService],
})
export class SocialLinksModule {}