import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateWorkExperienceDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  companyName!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  position!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string | null;

  @IsInt()
  @Min(1900)
  @Max(9999)
  startYear!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  startMonth?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(9999)
  endYear?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  endMonth?: number | null;

  @IsBoolean()
  isCurrent!: boolean;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  responsibilities?: string | null;

  @IsOptional()
  @IsString()
  achievements?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  technologyIds?: string[];
}
