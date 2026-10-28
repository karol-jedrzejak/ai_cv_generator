'use client';

import { useParams } from 'next/navigation';
import GeneratedDocumentView from '@/components/job-offers/GeneratedDocumentView';

export default function GeneratedMotivationLetterPage() {
  const params = useParams<{ id: string; documentId: string }>();

  return (
    <GeneratedDocumentView
      jobOfferId={params.id}
      documentId={params.documentId}
      kind="motivation-letter"
    />
  );
}
