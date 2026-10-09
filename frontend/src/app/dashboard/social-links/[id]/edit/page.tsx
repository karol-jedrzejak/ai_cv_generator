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

import { socialLinksApi } from '@/lib/api/social-links';
import type { SocialLink } from '@/types/social-link';
import SocialLinkForm from '@/components/social-links/SocialLinkForm';

export default function EditSocialLinkPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [link, setLink] = useState<SocialLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadLink() {
      try {
        setLoading(true);
        setError(null);

        const data = await socialLinksApi.getOne(id);

        if (active) {
          setLink(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Nie udało się pobrać linku.',
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadLink();

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
          href="/dashboard/social-links"
          underline="hover"
          color="inherit"
        >
          Moje linki
        </Link>

        <Typography color="text.primary">Edytuj link</Typography>
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
              href="/dashboard/social-links"
              color="inherit"
            >
              Wróć do listy
            </Link>
          }
        >
          {error}
        </Alert>
      ) : link ? (
        <SocialLinkForm initialData={link} />
      ) : (
        <Alert severity="warning">Nie znaleziono linku.</Alert>
      )}
    </Box>
  );
}