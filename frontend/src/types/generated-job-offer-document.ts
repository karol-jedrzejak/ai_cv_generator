import type { Language } from '@/types/language-skill';

export interface GeneratedJobOfferDocumentSummary {
  id: string;
  jobOfferId: string;
  languageId: string;
  description: string | null;
  createdAt: string;
  language: Language;
}

export interface GeneratedJobOfferDocument
  extends GeneratedJobOfferDocumentSummary {
  content: unknown;
}
