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
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import { projectsApi } from '@/lib/api/projects';
import type { Project } from '@/types/project';
import DeleteProjectDialog from './DeleteProjectDialog';
import ProjectCard from './ProjectCard';

export default function ProjectList() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProjects(await projectsApi.getAll());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Nie udało się pobrać projektów.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const handleDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await projectsApi.remove(selected.id);
      setProjects((current) =>
        current.filter((project) => project.id !== selected.id),
      );
      setSelected(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Nie udało się usunąć projektu.',
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
              onClick={() => void loadProjects()}
            >
              Spróbuj ponownie
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      {!error &&
        (projects.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              py: { xs: 5, sm: 8 },
              px: 3,
              textAlign: 'center',
              borderRadius: 3,
            }}
          >
            <FolderSpecialIcon
              sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
              Nie masz jeszcze dodanych projektów
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Dodaj projekty, linki, osiągnięcia i technologie.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/dashboard/projects/new')}
            >
              Dodaj pierwszy projekt
            </Button>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={(item) =>
                  router.push(`/dashboard/projects/${item.id}/edit`)
                }
                onDelete={(item) => {
                  setDeleteError(null);
                  setSelected(item);
                }}
              />
            ))}
          </Stack>
        ))}
      <DeleteProjectDialog
        open={Boolean(selected)}
        project={selected}
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
