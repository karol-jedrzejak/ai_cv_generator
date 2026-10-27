import { PartialType } from '@nestjs/mapped-types';
import { CreateLanguageSkillDto } from './create-language-skill.dto';

export class UpdateLanguageSkillDto extends PartialType(
  CreateLanguageSkillDto,
) {}
