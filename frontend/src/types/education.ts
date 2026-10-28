import type { Technology } from '@/types/technology';

export type EducationTechnology = Pick<
  Technology,
  'id' | 'name' | 'category'
>;

export interface Education {
  id: string;
  userId: string;
  institutionName: string;
  fieldOfStudy: string | null;
  startYear: number | null;
  startMonth: number | null;
  endYear: number | null;
  endMonth: number | null;
  description: string | null;
  achievements: string | null;
  sortOrder: number;
  educationalTechnologies: Array<{ technology: EducationTechnology }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEducationDto {
  institutionName: string;
  fieldOfStudy?: string | null;
  startYear?: number | null;
  startMonth?: number | null;
  endYear?: number | null;
  endMonth?: number | null;
  description?: string | null;
  achievements?: string | null;
  sortOrder?: number;
  technologyIds?: string[];
}

export type UpdateEducationDto = Partial<CreateEducationDto>;
