import type {
  GeneratedJobOfferDocument,
  GeneratedJobOfferDocumentSummary,
} from '@/types/generated-job-offer-document';
import type { Language } from '@/types/language-skill';
import { apiRequest } from './client';

export const generationLanguagesApi = {
  getAll: () => apiRequest<Language[]>('/job-offers/generation-languages'),
};

function createDocumentApi(resource: string) {
  const offerPath = (jobOfferId: string) =>
    `/job-offers/${encodeURIComponent(jobOfferId)}/${resource}`;
  const documentPath = (jobOfferId: string, documentId: string) =>
    `${offerPath(jobOfferId)}/${encodeURIComponent(documentId)}`;

  return {
    getAll: (jobOfferId: string) =>
      apiRequest<GeneratedJobOfferDocumentSummary[]>(offerPath(jobOfferId)),
    generate: (jobOfferId: string, languageId: string) =>
      apiRequest<GeneratedJobOfferDocument>(
        `${offerPath(jobOfferId)}/generate`,
        {
          method: 'POST',
          body: JSON.stringify({ languageId }),
        },
      ),
    getOne: (jobOfferId: string, documentId: string) =>
      apiRequest<GeneratedJobOfferDocument>(
        documentPath(jobOfferId, documentId),
      ),
    remove: (jobOfferId: string, documentId: string) =>
      apiRequest<{ id: string }>(documentPath(jobOfferId, documentId), {
        method: 'DELETE',
      }),
  };
}

export const generatedCvsApi = createDocumentApi('generated-cvs');
export const generatedMotivationLettersApi = createDocumentApi(
  'generated-motivation-letters',
);
