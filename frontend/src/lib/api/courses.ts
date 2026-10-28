import type {
  Course,
  CreateCourseDto,
  UpdateCourseDto,
} from '@/types/course';
import { createCrudApi } from './client';

export const coursesApi = createCrudApi<
  Course,
  CreateCourseDto,
  UpdateCourseDto
>('/courses');
