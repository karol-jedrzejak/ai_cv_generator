
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
import LinkIcon from '@mui/icons-material/Link';

import { userTechnologiesApi } from '@/lib/api/user-technologies';
import type { UserTechnology } from '@/types/user-technology';
import UserTechnologiesCard from './UserTechnologyCard';
import DeleteUserTechnologiesDialog from './DeleteUserTechnologyDialog';

export default function UserTechnologiesList() {
  const router = useRouter();

  const [technologies, setTechnologies] = useState<UserTechnology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<UserTechnology | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadTechnologies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await userTechnologiesApi.getAll();
      setTechnologies(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Nie udało się pobrać technologii.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTechnologies();
  }, [loadTechnologies]);

  const handleDelete = async () => {
    if (!selected) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      await userTechnologiesApi.remove(selected.technologyId);
      setTechnologies((current) =>
        current.filter((technology) => technology.technologyId !== selected.technologyId),
      );
      setSelected(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : 'Nie udało się usunąć technologii.',
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
            <Button color="inherit" size="small" onClick={loadTechnologies}>
              Spróbuj ponownie
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {!error && (
        <>
          {technologies.length === 0 ? (
            <Paper
              variant="outlined"
              sx={{
                py: { xs: 5, sm: 8 },
                px: 3,
                textAlign: 'center',
                borderRadius: 3,
              }}
            >
              <LinkIcon
                sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}
              />

              <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
                Nie masz jeszcze żadnych technologii
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Dodaj technologie, które znasz, aby uzupełnić
                swój profil zawodowy.
              </Typography>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/dashboard/user-technologies/new')}
              >
                Dodaj pierwszą technologię
              </Button>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {technologies.map((technology) => (
                <UserTechnologiesCard
                  key={technology.technologyId+technology.userId}
                  technology={technology}
                  onEdit={(item) =>
                    router.push(
                      `/dashboard/user-technologies/${item.technologyId}/edit`,
                    )
                  }
                  onDelete={(item) => {
                    setDeleteError(null);
                    setSelected(item);
                  }}
                />
              ))}
            </Stack>
          )}
        </>
      )}

      <DeleteUserTechnologiesDialog
        open={Boolean(selected)}
        technology={selected}
        deleting={deleting}
        error={deleteError}
        onClose={() => {
          setSelected(null);
          setDeleteError(null);
        }}
        onConfirm={handleDelete}
      />
    </Stack>
  );
}