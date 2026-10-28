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
import CertificationForm from '@/components/certifications/CertificationForm';
import { certificationsApi } from '@/lib/api/certifications';
import type { Certification } from '@/types/certification';

export default function EditCertificationPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [certification, setCertification] = useState<Certification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadCertification() {
      try {
        setLoading(true);
        setError(null);
        const data = await certificationsApi.getOne(id);
        if (active) setCertification(data);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Nie udało się pobrać certyfikatu.',
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadCertification();
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
        <Link component={NextLink} href="/dashboard/certifications" underline="hover" color="inherit">
          Moje certyfikaty
        </Link>
        <Typography color="text.primary">Edytuj certyfikat</Typography>
      </Breadcrumbs>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert
          severity="error"
          action={
            <Link component={NextLink} href="/dashboard/certifications" color="inherit">
              Wróć do listy
            </Link>
          }
        >
          {error}
        </Alert>
      ) : certification ? (
        <CertificationForm initialData={certification} />
      ) : (
        <Alert severity="warning">Nie znaleziono certyfikatu.</Alert>
      )}
    </Box>
  );
}
