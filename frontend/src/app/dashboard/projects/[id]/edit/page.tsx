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
import ProjectForm from '@/components/projects/ProjectForm';
import { projectsApi } from '@/lib/api/projects';
import type { Project } from '@/types/project';

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadProject() {
      try {
        setLoading(true);
        setError(null);
        const data = await projectsApi.getOne(id);
        if (active) setProject(data);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Nie udało się pobrać projektu.',
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProject();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component={NextLink}
          href="/dashboard"
          underline="hover"
          color="inherit"
        >
          Dashboard
        </Link>
        <Link
          component={NextLink}
          href="/dashboard/projects"
          underline="hover"
          color="inherit"
        >
          Moje projekty
        </Link>
        <Typography color="text.primary">Edytuj projekt</Typography>
      </Breadcrumbs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert
          severity="error"
          action={
            <Link
              component={NextLink}
              href="/dashboard/projects"
              color="inherit"
            >
              Wróć do listy
            </Link>
          }
        >
          {error}
        </Alert>
      ) : project ? (
        <ProjectForm initialData={project} />
      ) : (
        <Alert severity="warning">Nie znaleziono projektu.</Alert>
      )}
    </Box>
  );
}
