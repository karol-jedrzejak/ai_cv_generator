'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Alert,
  Box,
  Breadcrumbs,
  CircularProgress,
  Link,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import JobOfferForm from '@/components/job-offers/JobOfferForm';
import { jobOffersApi } from '@/lib/api/job-offers';
import type { JobOffer } from '@/types/job-offer';

export default function EditJobOfferPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [jobOffer, setJobOffer] = useState<JobOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadJobOffer() {
      try {
        setLoading(true);
        setError(null);
        const data = await jobOffersApi.getOne(id);
        if (active) setJobOffer(data);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Nie udało się pobrać oferty pracy.',
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadJobOffer();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={NextLink} href="/dashboard" underline="hover" color="inherit">
          Dashboard
        </Link>
        <Link component={NextLink} href="/dashboard/job-offers" underline="hover" color="inherit">
          Oferty pracy
        </Link>
        <Typography color="text.primary">Edytuj ofertę</Typography>
      </Breadcrumbs>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert
          severity="error"
          action={
            <Link component={NextLink} href="/dashboard/job-offers" color="inherit">
              Wróć do listy
            </Link>
          }
        >
          {error}
        </Alert>
      ) : jobOffer ? (
        <JobOfferForm initialData={jobOffer} />
      ) : (
        <Alert severity="warning">Nie znaleziono oferty pracy.</Alert>
      )}
    </Box>
  );
}
