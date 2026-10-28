import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name!: string;

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
  responsibilities?: string | null;

  @IsOptional()
  @IsString()
  achievements?: string | null;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(500)
  projectUrl?: string | null;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(500)
  repositoryUrl?: string | null;

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
