
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Alert,
  Box,
  Button,
  Paper,
  Slider,
  Stack,
  Typography,
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

import TechnologyMultiSelect from '@/components/technologies/TechnologyMultiSelect';
import { userTechnologiesApi } from '@/lib/api/user-technologies';
import type { TechnologyOption } from '@/types/technology';
import type { UserTechnology } from '@/types/user-technology';

interface Props {
  initialData?: UserTechnology;
}

const PROFICIENCY_LABELS: Record<number, string> = {
  1: 'Początkujący',
  2: 'Podstawowy',
  3: 'Podstawowy',
  4: 'Średniozaawansowany',
  5: 'Średniozaawansowany',
  6: 'Średniozaawansowany',
  7: 'Zaawansowany',
  8: 'Zaawansowany',
  9: 'Bardzo zaawansowany',
  10: 'Ekspert',
};

export default function UserTechnologyForm({
  initialData,
}: Props) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  const [technologies, setTechnologies] = useState<TechnologyOption[]>(
    initialData
      ? [
          {
            id: initialData.technology.id,
            name: initialData.technology.name,
            category: initialData.technology.category,
          },
        ]
      : [],
  );
  const selected = technologies[0] ?? null;

  const [proficiency, setProficiency] = useState(
    initialData?.proficiency ?? 5,
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError(null);

    if (!selected) {
      setError('Wybierz technologię z listy.');
      return;
    }

    try {
      setSaving(true);

      if (initialData) {
        await userTechnologiesApi.update(
          initialData.technologyId,
          { proficiency },
        );
      } else {
        await userTechnologiesApi.create({
          technologyId: selected.id,
          proficiency,
        });
      }

      router.push('/dashboard/user-technologies');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Nie udało się zapisać technologii.',
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
              {isEditing
                ? 'Edytuj technologię'
                : 'Dodaj technologię'}
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {isEditing
                ? 'Zaktualizuj poziom swojej znajomości technologii.'
                : 'Wyszukaj technologię z katalogu i określ swój poziom znajomości.'}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error">{error}</Alert>
          )}

          <TechnologyMultiSelect
            value={technologies}
            onChange={(selection) => setTechnologies(selection.slice(-1))}
            onError={setError}
            disabled={isEditing || saving}
            label="Technologia"
            maxSelections={1}
          />

          <Box sx={{ px: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Poziom znajomości
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              {proficiency}/10 — {PROFICIENCY_LABELS[proficiency]}
            </Typography>

            <Slider
              value={proficiency}
              min={1}
              max={10}
              step={1}
              disabled={saving}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}/10`}
              marks={[
                { value: 1, label: '1' },
                { value: 5, label: '5' },
                { value: 10, label: '10' },
              ]}
              onChange={(_, value) => {
                setProficiency(value as number);
              }}
              aria-label="Poziom znajomości technologii"
            />
          </Box>

          <Stack
            direction={{ xs: 'column-reverse', sm: 'row' }}
            sx={{ justifyContent: 'flex-end' }}
          >
            <Button
              sx={{ mt: { xs: 2, sm: 0 }, mr: { xs: 0, sm: 2 } }}
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              disabled={saving}
              onClick={() =>
                router.push('/dashboard/user-technologies')
              }
            >
              Anuluj
            </Button>

            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={saving || !selected}
            >
              {saving
                ? 'Zapisywanie...'
                : isEditing
                  ? 'Zapisz zmiany'
                  : 'Dodaj technologię'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
