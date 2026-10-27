import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LanguagesController } from './languages.controller';
import { LanguagesService } from './languages.service';

@Module({
  controllers: [LanguagesController],
  providers: [LanguagesService, PrismaService],
})
export class LanguagesModule {}
