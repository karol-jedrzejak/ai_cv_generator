import {
  IsInt,
  Min,
  Max,
} from 'class-validator';


export class UpdateUserTechnologyDto
{
  @IsInt()
  @Min(1)
  @Max(10)
  proficiency!: number;
}