
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

import { socialLinksApi } from '@/lib/api/social-links';
import type { SocialLink } from '@/types/social-link';
import SocialLinkCard from './SocialLinkCard';
import DeleteSocialLinkDialog from './DeleteSocialLinkDialog';

export default function SocialLinkList() {
  const router = useRouter();

  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SocialLink | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadLinks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await socialLinksApi.getAll();
      setLinks(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Nie udało się pobrać linków.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLinks();
  }, [loadLinks]);

  const handleDelete = async () => {
    if (!selected) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      await socialLinksApi.remove(selected.id);
      setLinks((current) =>
        current.filter((link) => link.id !== selected.id),
      );
      setSelected(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : 'Nie udało się usunąć linku.',
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
            <Button color="inherit" size="small" onClick={loadLinks}>
              Spróbuj ponownie
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {!error && (
        <>
          {links.length === 0 ? (
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
                Nie masz jeszcze żadnych linków
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Dodaj GitHub, LinkedIn lub portfolio, aby uzupełnić
                swój profil zawodowy.
              </Typography>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/dashboard/social-links/new')}
              >
                Dodaj pierwszy link
              </Button>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {links.map((link) => (
                <SocialLinkCard
                  key={link.id}
                  link={link}
                  onEdit={(item) =>
                    router.push(
                      `/dashboard/social-links/${item.id}/edit`,
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

      <DeleteSocialLinkDialog
        open={Boolean(selected)}
        link={selected}
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