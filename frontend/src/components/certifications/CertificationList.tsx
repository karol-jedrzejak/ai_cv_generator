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
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { certificationsApi } from '@/lib/api/certifications';
import type { Certification } from '@/types/certification';
import CertificationCard from './CertificationCard';
import DeleteCertificationDialog from './DeleteCertificationDialog';

export default function CertificationList() {
  const router = useRouter();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Certification | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadCertifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCertifications(await certificationsApi.getAll());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Nie udało się pobrać certyfikatów.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCertifications();
  }, [loadCertifications]);

  const handleDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await certificationsApi.remove(selected.id);
      setCertifications((items) =>
        items.filter((item) => item.id !== selected.id),
      );
      setSelected(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : 'Nie udało się usunąć certyfikatu.',
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  }

  return (
    <Stack spacing={3}>
      {error && (
        <Alert
          severity="error"
          action={<Button color="inherit" size="small" onClick={() => void loadCertifications()}>Spróbuj ponownie</Button>}
        >
          {error}
        </Alert>
      )}
      {!error &&
        (certifications.length === 0 ? (
          <Paper variant="outlined" sx={{ py: { xs: 5, sm: 8 }, px: 3, textAlign: 'center', borderRadius: 3 }}>
            <WorkspacePremiumOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
              Nie masz jeszcze dodanych certyfikatów
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Dodaj certyfikaty zawodowe i technologie, których dotyczą.
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => router.push('/dashboard/certifications/new')}>
              Dodaj pierwszy certyfikat
            </Button>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {certifications.map((certification) => (
              <CertificationCard
                key={certification.id}
                certification={certification}
                onEdit={(item) =>
                  router.push(`/dashboard/certifications/${item.id}/edit`)
                }
                onDelete={(item) => {
                  setDeleteError(null);
                  setSelected(item);
                }}
              />
            ))}
          </Stack>
        ))}
      <DeleteCertificationDialog
        open={Boolean(selected)}
        certification={selected}
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
