import type {
  SocialLink,
  CreateSocialLinkDto,
  UpdateSocialLinkDto,
} from '@/types/social-link';
import { createCrudApi } from './client';

export const socialLinksApi = createCrudApi<
  SocialLink,
  CreateSocialLinkDto,
  UpdateSocialLinkDto
>('/social-links');