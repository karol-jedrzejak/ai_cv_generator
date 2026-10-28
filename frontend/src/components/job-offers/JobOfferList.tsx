'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import WorkOutlineIcon from '@mui/icons-material/WorkOutlined';
import { jobOffersApi } from '@/lib/api/job-offers';
import type { JobOffer } from '@/types/job-offer';
import JobOfferCard from './JobOfferCard';
import DeleteJobOfferDialog from './DeleteJobOfferDialog';

export default function JobOfferList() {
  const router = useRouter();
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<JobOffer | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadJobOffers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setJobOffers(await jobOffersApi.getAll());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Nie udało się pobrać ofert pracy.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadJobOffers();
  }, [loadJobOffers]);

  const handleDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await jobOffersApi.remove(selected.id);
      setJobOffers((items) => items.filter((item) => item.id !== selected.id));
      setSelected(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Nie udało się usunąć oferty pracy.',
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void loadJobOffers()}>
              Spróbuj ponownie
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      {!error &&
        (jobOffers.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              py: { xs: 5, sm: 8 },
              px: 3,
              textAlign: 'center',
              borderRadius: 3,
            }}
          >
            <WorkOutlineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
              Nie masz jeszcze zapisanych ofert pracy
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Dodaj ofertę, którą chcesz wykorzystać przy przygotowaniu
              dokumentów aplikacyjnych.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/dashboard/job-offers/new')}
            >
              Dodaj pierwszą ofertę
            </Button>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {jobOffers.map((jobOffer) => (
              <JobOfferCard
                key={jobOffer.id}
                jobOffer={jobOffer}
                onEdit={(item) =>
                  router.push(`/dashboard/job-offers/${item.id}/edit`)
                }
                onDelete={(item) => {
                  setDeleteError(null);
                  setSelected(item);
                }}
              />
            ))}
          </Stack>
        ))}
      <DeleteJobOfferDialog
        open={Boolean(selected)}
        jobOffer={selected}
        deleting={deleting}
        error={deleteError}
        onClose={() => {
          setSelected(null);
          setDeleteError(null);
        }}
        onConfirm={() => void handleDelete()}
      />
    </Stack>
  );
}
