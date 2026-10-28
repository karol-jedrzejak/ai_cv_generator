import type {
  CreateEducationDto,
  Education,
  UpdateEducationDto,
} from '@/types/education';
import { createCrudApi } from './client';

export const educationApi = createCrudApi<
  Education,
  CreateEducationDto,
  UpdateEducationDto
>('/education');
