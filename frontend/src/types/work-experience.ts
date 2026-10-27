import type { Technology } from '@/types/technology';

export type WorkExperienceTechnology = Pick<
  Technology,
  'id' | 'name' | 'category'
>;

export interface WorkExperience {
  id: string;
  userId: string;
  companyName: string;
  position: string;
  location: string | null;
  startYear: number;
  startMonth: number | null;
  endYear: number | null;
  endMonth: number | null;
  isCurrent: boolean;
  description: string | null;
  responsibilities: string | null;
  achievements: string | null;
  sortOrder: number;
  technologies: Array<{ technology: WorkExperienceTechnology }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateWorkExperienceDto {
  companyName: string;
  position: string;
  location?: string | null;
  startYear: number;
  startMonth?: number | null;
  endYear?: number | null;
  endMonth?: number | null;
  isCurrent: boolean;
  description?: string | null;
  responsibilities?: string | null;
  achievements?: string | null;
  sortOrder?: number;
  technologyIds?: string[];
}

export type UpdateWorkExperienceDto =
  Partial<CreateWorkExperienceDto>;
