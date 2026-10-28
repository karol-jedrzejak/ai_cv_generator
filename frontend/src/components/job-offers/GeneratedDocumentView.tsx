'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Box,
  Breadcrumbs,
  CircularProgress,
  Link as MuiLink,
  Paper,
  Typography,
} from '@mui/material';
import {
  generatedCvsApi,
  generatedMotivationLettersApi,
} from '@/lib/api/job-offer-documents';
import type { GeneratedJobOfferDocument } from '@/types/generated-job-offer-document';
import GeneratedCoverLetter, {
  isCoverLetterContent,
} from './GeneratedCoverLetter';

type DocumentKind = 'cv' | 'motivation-letter';

interface Props {
  jobOfferId: string;
  documentId: string;
  kind: DocumentKind;
}

const documentApis = {
  cv: generatedCvsApi,
  'motivation-letter': generatedMotivationLettersApi,
};

const documentLabels = {
  cv: 'CV',
  'motivation-letter': 'List motywacyjny',
};

export default function GeneratedDocumentView({
  jobOfferId,
  documentId,
  kind,
}: Props) {
  const [document, setDocument] = useState<GeneratedJobOfferDocument | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadDocument() {
      try {
        setLoading(true);
        setError(null);
        const result = await documentApis[kind].getOne(jobOfferId, documentId);
        if (active) setDocument(result);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : `Nie udało się pobrać: ${documentLabels[kind]}.`,
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadDocument();
    return () => {
      active = false;
    };
  }, [documentId, jobOfferId, kind]);

  return (
    <Box>
      {kind !== 'motivation-letter' && (
        <Breadcrumbs sx={{ mb: 3 }}>
          <MuiLink
            component={Link}
            href="/dashboard/job-offers"
            underline="hover"
            color="inherit"
          >
            Oferty pracy
          </MuiLink>
          <MuiLink
            component={Link}
            href={`/dashboard/job-offers/${jobOfferId}/edit`}
            underline="hover"
            color="inherit"
          >
            Oferta
          </MuiLink>
          <Typography color="text.primary">{documentLabels[kind]}</Typography>
        </Breadcrumbs>
      )}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : document ? (
        kind === 'motivation-letter' &&
        isCoverLetterContent(document.content) ? (
          <GeneratedCoverLetter
            content={document.content}
            languageName={document.language.name}
          />
        ) : kind === 'motivation-letter' ? (
          <Alert severity="error">
            Zawartość listu motywacyjnego ma nieprawidłowy format.
          </Alert>
        ) : (
          <Paper
            variant="outlined"
            sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3 }}
          >
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
              {documentLabels[kind]}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              {document.language.name ?? 'Język bez nazwy'}
              {document.description ? ` · ${document.description}` : ''}
            </Typography>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 2,
                borderRadius: 2,
                bgcolor: 'action.hover',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'anywhere',
                fontFamily: 'monospace',
              }}
            >
              {JSON.stringify(document.content, null, 2)}
            </Box>
          </Paper>
        )
      ) : (
        <Alert severity="warning">Nie znaleziono dokumentu.</Alert>
      )}
    </Box>
  );
}
