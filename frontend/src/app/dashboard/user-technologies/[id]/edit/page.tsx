'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Breadcrumbs,
  CircularProgress,
  Link,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';

import { userTechnologiesApi } from '@/lib/api/user-technologies';
import type { UserTechnology } from '@/types/user-technology';
import UserTechnologyForm from '@/components/user-technologies/UserTechnologyForm';

export default function EditUserTechnologyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [technology, setTechnology] = useState<UserTechnology | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadTechnology() {
      try {
        setLoading(true);
        setError(null);

        const data = await userTechnologiesApi.getOne(id);

        if (active) {
          setTechnology(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Nie udało się pobrać technologii.',
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadTechnology();

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
          href="/dashboard/user-technologies"
          underline="hover"
          color="inherit"
        >
          Moje technologie
        </Link>

        <Typography color="text.primary">Edytuj technologię</Typography>
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
              href="/dashboard/user-technologies"
              color="inherit"
            >
              Wróć do listy
            </Link>
          }
        >
          {error}
        </Alert>
      ) : technology ? (
        <UserTechnologyForm initialData={technology} />
      ) : (
        <Alert severity="warning">Nie znaleziono technologii.</Alert>
      )}
    </Box>
  );
}