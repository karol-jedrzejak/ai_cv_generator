export const LINK_TYPES = [
  'GITHUB',
  'LINKEDIN',
  'FACEBOOK',
  'X',
  'TWITTER',
  'INSTAGRAM',
  'YOUTUBE',
  'PERSONAL_WEBSITE',
  'OTHER',
] as const;

export type LinkType = (typeof LINK_TYPES)[number];

export interface SocialLink {
  id: string;
  type: LinkType;
  label: string | null;
  url: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSocialLinkDto {
  type: LinkType;
  label?: string;
  url: string;
  sortOrder?: number;
}

export type UpdateSocialLinkDto = Partial<CreateSocialLinkDto>;