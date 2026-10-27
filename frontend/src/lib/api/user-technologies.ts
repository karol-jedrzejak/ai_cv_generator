import type {
  UserTechnology,
  CreateUserTechnologyDto,
  UpdateUserTechnologyDto,
} from '@/types/user-technology';
import { createCrudApi } from './client';

export const userTechnologiesApi = createCrudApi<
  UserTechnology,
  CreateUserTechnologyDto,
  UpdateUserTechnologyDto
>('/user-technologies');