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
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import { workExperiencesApi } from '@/lib/api/work-experience';
import type { WorkExperience } from '@/types/work-experience';
import DeleteWorkExperienceDialog from './DeleteWorkExperienceDialog';
import WorkExperienceCard from './WorkExperienceCard';

export default function WorkExperienceList() {
  const router = useRouter();
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<WorkExperience | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadExperiences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setExperiences(await workExperiencesApi.getAll());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Nie udało się pobrać doświadczenia zawodowego.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadExperiences();
  }, [loadExperiences]);

  const handleDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await workExperiencesApi.remove(selected.id);
      setExperiences((current) =>
        current.filter((item) => item.id !== selected.id),
      );
      setSelected(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : 'Nie udało się usunąć doświadczenia zawodowego.',
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
              onClick={() => void loadExperiences()}
            >
              Spróbuj ponownie
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      {!error &&
        (experiences.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              py: { xs: 5, sm: 8 },
              px: 3,
              textAlign: 'center',
              borderRadius: 3,
            }}
          >
            <WorkHistoryIcon
              sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
              Nie masz jeszcze dodanego doświadczenia
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Dodaj stanowiska, obowiązki, osiągnięcia i technologie używane
              w pracy.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/dashboard/work-experience/new')}
            >
              Dodaj pierwsze doświadczenie
            </Button>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {experiences.map((experience) => (
              <WorkExperienceCard
                key={experience.id}
                experience={experience}
                onEdit={(item) =>
                  router.push(
                    `/dashboard/work-experience/${item.id}/edit`,
                  )
                }
                onDelete={(item) => {
                  setDeleteError(null);
                  setSelected(item);
                }}
              />
            ))}
          </Stack>
        ))}
      <DeleteWorkExperienceDialog
        open={Boolean(selected)}
        experience={selected}
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
