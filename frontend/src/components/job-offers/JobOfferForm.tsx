'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { jobOffersApi } from '@/lib/api/job-offers';
import type { JobOffer } from '@/types/job-offer';

interface Props {
  initialData?: JobOffer;
}

export default function JobOfferForm({ initialData }: Props) {
  const router = useRouter();
  const isEditing = Boolean(initialData);
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [companyName, setCompanyName] = useState(
    initialData?.companyName ?? '',
  );
  const [url, setUrl] = useState(initialData?.url ?? '');
  const [description, setDescription] = useState(
    initialData?.description ?? '',
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      setSaving(true);
      const data = {
        title: title.trim(),
        companyName: companyName.trim() || null,
        url: url.trim() || null,
        description: description.trim(),
      };

      if (initialData) {
        await jobOffersApi.update(initialData.id, data);
      } else {
        await jobOffersApi.create(data);
      }
      router.push('/dashboard/job-offers');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Nie udało się zapisać oferty pracy.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3, maxWidth: 900 }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {isEditing ? 'Edytuj ofertę pracy' : 'Dodaj ofertę pracy'}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Zapisz ofertę, aby później przygotować dopasowane dokumenty
              aplikacyjne.
            </Typography>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            required
            fullWidth
            label="Stanowisko"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            slotProps={{ htmlInput: { maxLength: 255 } }}
            disabled={saving}
          />
          <TextField
            fullWidth
            label="Nazwa firmy"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            slotProps={{ htmlInput: { maxLength: 255 } }}
            disabled={saving}
          />
          <TextField
            fullWidth
            type="url"
            label="Link do oferty"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            slotProps={{ htmlInput: { maxLength: 1000 } }}
            disabled={saving}
          />
          <TextField
            required
            fullWidth
            multiline
            minRows={8}
            label="Opis oferty"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={saving}
          />
          <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={2} sx={{ justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/dashboard/job-offers')}
              disabled={saving}
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={saving}
            >
              {saving ? 'Zapisywanie...' : 'Zapisz ofertę'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
