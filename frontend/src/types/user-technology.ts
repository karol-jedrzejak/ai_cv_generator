import type { Technology } from '@/types/technology';

export interface UserTechnology {
  userId: string;
  technologyId: string;
  proficiency: number;
  technology: Technology;
}

export interface CreateUserTechnologyDto {
  technologyId: string;
  proficiency: number;
}

export interface UpdateUserTechnologyDto {
  proficiency: number;
}