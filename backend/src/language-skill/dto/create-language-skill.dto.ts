import { LanguageLevel } from '@generated/prisma';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateLanguageSkillDto {
  @IsUUID()
  languageId!: string;

  @IsEnum(LanguageLevel)
  level!: LanguageLevel;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
