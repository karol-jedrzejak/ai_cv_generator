import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateEducationDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  institutionName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  fieldOfStudy?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(9999)
  startYear?: number | null;

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

  @IsOptional()
  @IsString()
  description?: string | null;

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
