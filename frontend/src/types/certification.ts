import type { Technology } from '@/types/technology';

export type CertificationTechnology = Pick<
  Technology,
  'id' | 'name' | 'category'
>;

export interface Certification {
  id: string;
  userId: string;
  name: string;
  organization: string;
  issuedYear: number | null;
  issuedMonth: number | null;
  expirationYear: number | null;
  expirationMonth: number | null;
  credentialId: string | null;
  credentialUrl: string | null;
  description: string | null;
  certificationTechnologies: Array<{ technology: CertificationTechnology }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCertificationDto {
  name: string;
  organization: string;
  issuedYear?: number | null;
  issuedMonth?: number | null;
  expirationYear?: number | null;
  expirationMonth?: number | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  description?: string | null;
  technologyIds?: string[];
}

export type UpdateCertificationDto = Partial<CreateCertificationDto>;
