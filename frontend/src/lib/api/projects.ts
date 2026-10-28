import type {
  CreateProjectDto,
  Project,
  UpdateProjectDto,
} from '@/types/project';
import { createCrudApi } from './client';

export const projectsApi = createCrudApi<
  Project,
  CreateProjectDto,
  UpdateProjectDto
>('/projects');
