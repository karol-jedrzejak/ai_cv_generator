import {
  IsInt,
  IsString,
  IsNotEmpty,
  Min,
  Max,
} from 'class-validator';

export class CreateUserTechnologyDto {
  @IsString()
  @IsNotEmpty()
  technologyId!: string;

  @IsInt()
  @Min(1)
  @Max(10)
  proficiency!: number;
}