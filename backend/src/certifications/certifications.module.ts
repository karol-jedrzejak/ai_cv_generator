import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CertificationsController } from './certifications.controller';
import { CertificationsService } from './certifications.service';

@Module({
  controllers: [CertificationsController],
  providers: [CertificationsService, PrismaService],
})
export class CertificationsModule {}
