import type {
  CreateLanguageSkillDto,
  LanguageSkill,
  UpdateLanguageSkillDto,
} from '@/types/language-skill';
import { createCrudApi } from './client';

export const languageSkillsApi = createCrudApi<
  LanguageSkill,
  CreateLanguageSkillDto,
  UpdateLanguageSkillDto
>('/language-skill');
