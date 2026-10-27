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
import WorkExperienceForm from '@/components/work-experience/WorkExperienceForm';
import { workExperiencesApi } from '@/lib/api/work-experience';
import type { WorkExperience } from '@/types/work-experience';

export default function EditWorkExperiencePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [experience, setExperience] = useState<WorkExperience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadExperience() {
      try {
        setLoading(true);
        setError(null);
        const data = await workExperiencesApi.getOne(id);
        if (active) setExperience(data);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Nie udało się pobrać doświadczenia zawodowego.',
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadExperience();
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
          href="/dashboard/work-experience"
          underline="hover"
          color="inherit"
        >
          Moje doświadczenie
        </Link>
        <Typography color="text.primary">Edytuj doświadczenie</Typography>
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
              href="/dashboard/work-experience"
              color="inherit"
            >
              Wróć do listy
            </Link>
          }
        >
          {error}
        </Alert>
      ) : experience ? (
        <WorkExperienceForm initialData={experience} />
      ) : (
        <Alert severity="warning">Nie znaleziono doświadczenia.</Alert>
      )}
    </Box>
  );
}
