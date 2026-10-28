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

export class CreateCertificationDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  organization!: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(9999)
  issuedYear?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  issuedMonth?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(9999)
  expirationYear?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  expirationMonth?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  credentialId?: string | null;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(500)
  credentialUrl?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  technologyIds?: string[];
}
