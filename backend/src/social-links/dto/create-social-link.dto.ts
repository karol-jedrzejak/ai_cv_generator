import { LinkType } from '@generated/prisma';

import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateSocialLinkDto {
  @IsEnum(LinkType)
  type!: LinkType;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  label?: string;

  @IsUrl({ require_protocol: true })
  @MaxLength(500)
  url!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}