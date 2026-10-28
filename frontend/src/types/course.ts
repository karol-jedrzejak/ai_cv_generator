import type { Technology } from '@/types/technology';

export type CourseTechnology = Pick<
  Technology,
  'id' | 'name' | 'category'
>;

export interface Course {
  id: string;
  userId: string;
  name: string;
  organization: string | null;
  startYear: number | null;
  startMonth: number | null;
  endYear: number | null;
  endMonth: number | null;
  description: string | null;
  learnedSkills: string | null;
  certificateUrl: string | null;
  sortOrder: number;
  technologies: Array<{ technology: CourseTechnology }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCourseDto {
  name: string;
  organization?: string | null;
  startYear?: number | null;
  startMonth?: number | null;
  endYear?: number | null;
  endMonth?: number | null;
  description?: string | null;
  learnedSkills?: string | null;
  certificateUrl?: string | null;
  sortOrder?: number;
  technologyIds?: string[];
}

export type UpdateCourseDto = Partial<CreateCourseDto>;
