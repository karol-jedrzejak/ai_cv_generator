import type {
  CreateWorkExperienceDto,
  UpdateWorkExperienceDto,
  WorkExperience,
} from '@/types/work-experience';
import { createCrudApi } from './client';

export const workExperiencesApi = createCrudApi<
  WorkExperience,
  CreateWorkExperienceDto,
  UpdateWorkExperienceDto
>('/work-experiences');
