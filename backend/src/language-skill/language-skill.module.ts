import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LanguageSkillController } from './language-skill.controller';
import { LanguageSkillService } from './language-skill.service';

@Module({
  controllers: [LanguageSkillController],
  providers: [LanguageSkillService, PrismaService],
})
export class LanguageSkillModule {}
