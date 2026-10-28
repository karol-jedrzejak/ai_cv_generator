import type {
  Certification,
  CreateCertificationDto,
  UpdateCertificationDto,
} from '@/types/certification';
import { createCrudApi } from './client';

export const certificationsApi = createCrudApi<
  Certification,
  CreateCertificationDto,
  UpdateCertificationDto
>('/certifications');
