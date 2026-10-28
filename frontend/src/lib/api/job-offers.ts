import type {
  CreateJobOfferDto,
  JobOffer,
  UpdateJobOfferDto,
} from '@/types/job-offer';
import { createCrudApi } from './client';

export const jobOffersApi = createCrudApi<
  JobOffer,
  CreateJobOfferDto,
  UpdateJobOfferDto
>('/job-offers');
