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
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { educationApi } from '@/lib/api/education';
import type { Education } from '@/types/education';
import DeleteEducationDialog from './DeleteEducationDialog';
import EducationCard from './EducationCard';

export default function EducationList() {
  const router = useRouter();
  const [entries, setEntries] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Education | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadEducation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setEntries(await educationApi.getAll());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Nie udało się pobrać wykształcenia.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEducation();
  }, [loadEducation]);

  const handleDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await educationApi.remove(selected.id);
      setEntries((current) =>
        current.filter((entry) => entry.id !== selected.id),
      );
      setSelected(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : 'Nie udało się usunąć wykształcenia.',
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
            <Button
              color="inherit"
              size="small"
              onClick={() => void loadEducation()}
            >
              Spróbuj ponownie
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      {!error &&
        (entries.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              py: { xs: 5, sm: 8 },
              px: 3,
              textAlign: 'center',
              borderRadius: 3,
            }}
          >
            <SchoolOutlinedIcon
              sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
              Nie masz jeszcze dodanego wykształcenia
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Dodaj placówki, kierunki i technologie poznane podczas nauki.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/dashboard/education/new')}
            >
              Dodaj pierwszy wpis
            </Button>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {entries.map((education) => (
              <EducationCard
                key={education.id}
                education={education}
                onEdit={(item) =>
                  router.push(`/dashboard/education/${item.id}/edit`)
                }
                onDelete={(item) => {
                  setDeleteError(null);
                  setSelected(item);
                }}
              />
            ))}
          </Stack>
        ))}
      <DeleteEducationDialog
        open={Boolean(selected)}
        education={selected}
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
