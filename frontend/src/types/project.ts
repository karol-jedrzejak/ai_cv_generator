import type { Technology } from '@/types/technology';

export type ProjectTechnology = Pick<
  Technology,
  'id' | 'name' | 'category'
>;

export interface Project {
  id: string;
  userId: string;
  name: string;
  startYear: number | null;
  startMonth: number | null;
  endYear: number | null;
  endMonth: number | null;
  description: string | null;
  responsibilities: string | null;
  achievements: string | null;
  projectUrl: string | null;
  repositoryUrl: string | null;
  sortOrder: number;
  technologies: Array<{ technology: ProjectTechnology }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectDto {
  name: string;
  startYear?: number | null;
  startMonth?: number | null;
  endYear?: number | null;
  endMonth?: number | null;
  description?: string | null;
  responsibilities?: string | null;
  achievements?: string | null;
  projectUrl?: string | null;
  repositoryUrl?: string | null;
  sortOrder?: number;
  technologyIds?: string[];
}

export type UpdateProjectDto = Partial<CreateProjectDto>;
