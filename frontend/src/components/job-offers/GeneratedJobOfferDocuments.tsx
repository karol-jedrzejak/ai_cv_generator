'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  Link as MuiLink,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { languagesApi } from '@/lib/api/languages';
import {
  generatedCvsApi,
  generatedMotivationLettersApi,
} from '@/lib/api/job-offer-documents';
import type { Language } from '@/types/language-skill';
import type { GeneratedJobOfferDocumentSummary } from '@/types/generated-job-offer-document';

type DocumentKind = 'cv' | 'motivation-letter';

interface Props {
  jobOfferId: string;
}

const documentApis = {
  cv: generatedCvsApi,
  'motivation-letter': generatedMotivationLettersApi,
};

const documentLabels = {
  cv: 'CV',
  'motivation-letter': 'List motywacyjny',
};

export default function GeneratedJobOfferDocuments({
  jobOfferId,
}: Props) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [cvs, setCvs] = useState<GeneratedJobOfferDocumentSummary[]>([]);
  const [motivationLetters, setMotivationLetters] = useState<
    GeneratedJobOfferDocumentSummary[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogKind, setDialogKind] = useState<DocumentKind | null>(null);
  const [languageId, setLanguageId] = useState('');
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{
    kind: DocumentKind;
    document: GeneratedJobOfferDocumentSummary;
  } | null>(null);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [availableLanguages, generatedCvs, generatedLetters] =
        await Promise.all([
          languagesApi.getAll(),
          generatedCvsApi.getAll(jobOfferId),
          generatedMotivationLettersApi.getAll(jobOfferId),
        ]);
      setLanguages(availableLanguages);
      setCvs(generatedCvs);
      setMotivationLetters(generatedLetters);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Nie udało się pobrać wygenerowanych dokumentów.',
      );
    } finally {
      setLoading(false);
    }
  }, [jobOfferId]);

  useEffect(() => {
    void loadDocuments();
  }, [loadDocuments]);

  const existingLanguageIds = useMemo(() => {
    const docs = dialogKind === 'cv' ? cvs : motivationLetters;
    return new Set(docs.map((document) => document.languageId));
  }, [cvs, dialogKind, motivationLetters]);

  const handleGenerate = async () => {
    if (!dialogKind || !languageId) return;
    setGenerating(true);
    setActionError(null);
    try {
      await documentApis[dialogKind].generate(jobOfferId, languageId);
      setDialogKind(null);
      setLanguageId('');
      await loadDocuments();
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : `Nie udało się wygenerować: ${documentLabels[dialogKind]}.`,
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDocument) return;
    setDeleting(true);
    setActionError(null);
    try {
      await documentApis[selectedDocument.kind].remove(
        jobOfferId,
        selectedDocument.document.id,
      );
      if (selectedDocument.kind === 'cv') {
        setCvs((items) =>
          items.filter((item) => item.id !== selectedDocument.document.id),
        );
      } else {
        setMotivationLetters((items) =>
          items.filter((item) => item.id !== selectedDocument.document.id),
        );
      }
      setSelectedDocument(null);
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : `Nie udało się usunąć: ${documentLabels[selectedDocument.kind]}.`,
      );
    } finally {
      setDeleting(false);
    }
  };

  const renderDocuments = (
    kind: DocumentKind,
    documents: GeneratedJobOfferDocumentSummary[],
  ) => (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
        {documentLabels[kind]} ({documents.length})
      </Typography>
      {documents.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Brak wygenerowanych dokumentów.
        </Typography>
      ) : (
        <Stack spacing={0.5}>
          {documents.map((document) => (
            <Stack
              key={document.id}
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', minWidth: 0 }}
            >
              <MuiLink
                component={Link}
                href={`/dashboard/job-offers/${jobOfferId}/${kind === 'cv' ? 'generated-cvs' : 'generated-motivation-letters'}/${document.id}`}
                underline="hover"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  minWidth: 0,
                }}
              >
                {document.language.name ?? 'Język bez nazwy'}
                <OpenInNewIcon sx={{ fontSize: 15 }} />
              </MuiLink>
              <Tooltip title={`Usuń ${documentLabels[kind]}`}>
                <IconButton
                  size="small"
                  color="error"
                  aria-label={`Usuń ${documentLabels[kind]} (${document.language.name ?? 'język bez nazwy'})`}
                  onClick={() => {
                    setActionError(null);
                    setSelectedDocument({ kind, document });
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );

  return (
    <Box sx={{ mt: 2 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { sm: 'flex-start' } }}
      >
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setActionError(null);
            setLanguageId('');
            setDialogKind('cv');
          }}
          disabled={loading || languages.length === 0}
        >
          Generuj CV
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setActionError(null);
            setLanguageId('');
            setDialogKind('motivation-letter');
          }}
          disabled={loading || languages.length === 0}
        >
          Generuj list motywacyjny
        </Button>
      </Stack>

      {loading ? (
        <CircularProgress size={20} sx={{ mt: 2 }} />
      ) : error ? (
        <Alert
          severity="error"
          sx={{ mt: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => void loadDocuments()}
            >
              Spróbuj ponownie
            </Button>
          }
        >
          {error}
        </Alert>
      ) : (
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          sx={{ mt: 2 }}
        >
          {renderDocuments('cv', cvs)}
          {renderDocuments('motivation-letter', motivationLetters)}
        </Stack>
      )}

      <Dialog
        open={dialogKind !== null}
        onClose={generating ? undefined : () => setDialogKind(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          Wybierz język — {dialogKind ? documentLabels[dialogKind] : ''}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="generated-document-language-label">Język</InputLabel>
            <Select
              labelId="generated-document-language-label"
              value={languageId}
              label="Język"
              onChange={(event) => setLanguageId(event.target.value)}
              disabled={generating}
            >
              {languages.map((language) => {
                const unavailable = existingLanguageIds.has(language.id);
                return (
                  <MenuItem
                    key={language.id}
                    value={language.id}
                    disabled={unavailable}
                  >
                    {language.name ?? 'Język bez nazwy'}
                    {unavailable ? ' — dokument już istnieje' : ''}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {dialogKind && existingLanguageIds.size === languages.length && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Dokument istnieje już we wszystkich dostępnych językach.
            </Alert>
          )}
          {actionError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {actionError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button
            onClick={() => setDialogKind(null)}
            disabled={generating}
          >
            Anuluj
          </Button>
          <Button
            variant="contained"
            onClick={() => void handleGenerate()}
            disabled={generating || !languageId}
          >
            {generating ? 'Generowanie...' : 'Generuj'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={selectedDocument !== null}
        onClose={deleting ? undefined : () => setSelectedDocument(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Usunąć wygenerowany dokument?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Usunąć {selectedDocument && documentLabels[selectedDocument.kind]}{' '}
            dla języka{' '}
            <strong>
              {selectedDocument?.document.language.name ?? 'bez nazwy'}
            </strong>
            ?
          </DialogContentText>
          {actionError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {actionError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button
            onClick={() => setSelectedDocument(null)}
            disabled={deleting}
          >
            Anuluj
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => void handleDelete()}
            disabled={deleting}
          >
            {deleting ? 'Usuwanie...' : 'Usuń'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
