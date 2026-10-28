export interface JobOffer {
  id: string;
  userId: string;
  title: string;
  companyName: string | null;
  url: string | null;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateJobOfferDto {
  title: string;
  companyName?: string | null;
  url?: string | null;
  description: string;
}

export type UpdateJobOfferDto = Partial<CreateJobOfferDto>;
