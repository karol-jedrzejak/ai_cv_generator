'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { languagesApi } from '@/lib/api/languages';
import { languageSkillsApi } from '@/lib/api/language-skills';
import {
  LANGUAGE_LEVELS,
  type Language,
  type LanguageLevel,
  type LanguageSkill,
} from '@/types/language-skill';

interface Props {
  initialData?: LanguageSkill;
}

const LEVEL_LABELS: Record<LanguageLevel, string> = {
  A1: 'A1 — Początkujący',
  A2: 'A2 — Podstawowy',
  B1: 'B1 — Średniozaawansowany',
  B2: 'B2 — Wyższy średniozaawansowany',
  C1: 'C1 — Zaawansowany',
  C2: 'C2 — Biegły',
  NATIVE: 'Ojczysty',
};

export default function LanguageSkillForm({ initialData }: Props) {
  const router = useRouter();
  const isEditing = Boolean(initialData);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [languageId, setLanguageId] = useState(
    initialData?.languageId ?? '',
  );
  const [level, setLevel] = useState<LanguageLevel>(
    initialData?.level ?? 'B1',
  );
  const [sortOrder, setSortOrder] = useState(
    String(initialData?.sortOrder ?? 0),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadLanguages() {
      setLoading(true);
      setError(null);
      try {
        const data = await languagesApi.getAll();
        if (active) setLanguages(data);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Nie udało się pobrać listy języków.',
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadLanguages();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError(null);
    const parsedOrder = Number(sortOrder);
    if (!Number.isInteger(parsedOrder) || parsedOrder < 0) {
      setError('Kolejność musi być liczbą całkowitą większą lub równą 0.');
      return;
    }
    if (!languageId) {
      setError('Wybierz język z listy.');
      return;
    }

    try {
      setSaving(true);
      const data = { languageId, level, sortOrder: parsedOrder };
      if (initialData) {
        await languageSkillsApi.update(initialData.id, data);
      } else {
        await languageSkillsApi.create(data);
      }
      router.push('/dashboard/language-skills');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Nie udało się zapisać znajomości języka.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3, maxWidth: 760 }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {isEditing ? 'Edytuj znajomość języka' : 'Dodaj język'}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Wybierz język i określ poziom jego znajomości.
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            select
            required
            fullWidth
            label="Język"
            value={languageId}
            onChange={(event) => setLanguageId(event.target.value)}
            disabled={loading || saving}
            helperText={
              loading
                ? 'Pobieranie listy języków...'
                : 'Wybierz język z katalogu.'
            }
          >
            {languages.map((language) => (
              <MenuItem key={language.id} value={language.id}>
                {language.name ?? 'Nieznany język'}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            required
            fullWidth
            label="Poziom znajomości"
            value={level}
            onChange={(event) =>
              setLevel(event.target.value as LanguageLevel)
            }
            disabled={saving}
          >
            {LANGUAGE_LEVELS.map((item) => (
              <MenuItem key={item} value={item}>
                {LEVEL_LABELS[item]}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            required
            fullWidth
            type="number"
            label="Kolejność wyświetlania"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            disabled={saving}
            slotProps={{ htmlInput: { min: 0, step: 1 } }}
            helperText="Mniejsza wartość oznacza wyższą pozycję."
          />

          <Stack
            direction={{ xs: 'column-reverse', sm: 'row' }}
            sx={{ justifyContent: 'flex-end' }}
          >
            <Button
              sx={{ mt: { xs: 2, sm: 0 }, mr: { xs: 0, sm: 2 } }}
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/dashboard/language-skills')}
              disabled={saving}
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={saving || loading || languages.length === 0}
            >
              {saving
                ? 'Zapisywanie...'
                : isEditing
                  ? 'Zapisz zmiany'
                  : 'Dodaj język'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
