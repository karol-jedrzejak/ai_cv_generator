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
import EducationForm from '@/components/education/EducationForm';
import { educationApi } from '@/lib/api/education';
import type { Education } from '@/types/education';

export default function EditEducationPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [education, setEducation] = useState<Education | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadEducation() {
      try {
        setLoading(true);
        setError(null);
        const data = await educationApi.getOne(id);
        if (active) setEducation(data);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Nie udało się pobrać wykształcenia.',
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadEducation();
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
          href="/dashboard/education"
          underline="hover"
          color="inherit"
        >
          Moje wykształcenie
        </Link>
        <Typography color="text.primary">Edytuj wykształcenie</Typography>
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
              href="/dashboard/education"
              color="inherit"
            >
              Wróć do listy
            </Link>
          }
        >
          {error}
        </Alert>
      ) : education ? (
        <EducationForm initialData={education} />
      ) : (
        <Alert severity="warning">Nie znaleziono wpisu wykształcenia.</Alert>
      )}
    </Box>
  );
}
