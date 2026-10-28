import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateJobOfferDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  companyName?: string | null;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(1000)
  url?: string | null;

  @IsString()
  @MinLength(1)
  description!: string;
}
