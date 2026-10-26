
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserTechnologyDto } from './create-user-technology.dto';

export class UpdateUserTechnologyDto extends PartialType(
  CreateUserTechnologyDto,
) {}