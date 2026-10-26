
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { TechnologyCategory } from '../../../generated/prisma/browser';

export class FindTechnologiesDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsEnum(TechnologyCategory)
  category?: TechnologyCategory;
}