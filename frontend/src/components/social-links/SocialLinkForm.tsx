
'use client';

import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { useRouter } from 'next/navigation';

import { socialLinksApi } from '@/lib/api/social-links';
import {
  LINK_TYPES,
  type SocialLink,
  type LinkType,
} from '@/types/social-link';

interface Props {
  initialData?: SocialLink;
}

const TYPE_LABELS: Record<LinkType, string> = {
  GITHUB: 'GitHub',
  LINKEDIN: 'LinkedIn',
  FACEBOOK: 'Facebook',
  X: 'X',
  TWITTER: 'Twitter',
  INSTAGRAM: 'Instagram',
  YOUTUBE: 'YouTube',
  PERSONAL_WEBSITE: 'Strona internetowa',
  OTHER: 'Inne',
};

export default function SocialLinkForm({ initialData }: Props) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  const [type, setType] = useState<LinkType>(
    initialData?.type ?? 'GITHUB',
  );
  const [label, setLabel] = useState(initialData?.label ?? '');
  const [url, setUrl] = useState(initialData?.url ?? '');
  const [sortOrder, setSortOrder] = useState(
    String(initialData?.sortOrder ?? 0),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError(null);

    const parsedOrder = Number(sortOrder);

    if (
      !Number.isInteger(parsedOrder) ||
      parsedOrder < 0
    ) {
      setError('Kolejność musi być liczbą całkowitą większą lub równą 0.');
      return;
    }

    try {
      setSaving(true);

      const data = {
        type,
        label: label.trim() || undefined,
        url: url.trim(),
        sortOrder: parsedOrder,
      };

      if (initialData) {
        await socialLinksApi.update(initialData.id, data);
      } else {
        await socialLinksApi.create(data);
      }

      router.push('/dashboard/social-links');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Nie udało się zapisać linku.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2.5, sm: 4 },
        borderRadius: 3,
        maxWidth: 760,
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {isEditing ? 'Edytuj link' : 'Dodaj link'}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Uzupełnij dane linku, który chcesz wyświetlać
              w swoim profilu CV.
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            select
            required
            fullWidth
            label="Typ linku"
            value={type}
            onChange={(event) =>
              setType(event.target.value as LinkType)
            }
          >
            {LINK_TYPES.map((item) => (
              <MenuItem key={item} value={item}>
                {TYPE_LABELS[item]}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Nazwa wyświetlana"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            sx={{ maxLength: 100 }}
            helperText="Opcjonalnie, np. Moje portfolio"
          />

          <TextField
            required
            fullWidth
            type="url"
            label="Adres URL"
            placeholder="https://github.com/twoj-profil"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            sx={{ maxLength: 500 }}
          />

          <TextField
            required
            fullWidth
            type="number"
            label="Kolejność wyświetlania"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            slotProps={{
              htmlInput: { min: 0, step: 1 },
            }}
            helperText="Mniejsza wartość oznacza wyższą pozycję."
          />

          <Stack
            sx={{ direction: { xs: 'column-reverse', sm: 'row' }, spacing: 2, justifyContent: 'flex-end' }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/dashboard/social-links')}
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
              {saving
                ? 'Zapisywanie...'
                : isEditing
                  ? 'Zapisz zmiany'
                  : 'Dodaj link'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}