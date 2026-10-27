
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

import { userTechnologiesApi } from '@/lib/api/user-technologies';
import { technologiesApi } from '@/lib/api/technologies';

import type {
  UserTechnology,
} from '@/types/user-technology';

import type {Technology } from '@/types/technology';


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

function formatCategory(category: string) {
  return category
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function UserTechnologyForm({
  initialData,
}: Props) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const [options, setOptions] = useState<Technology[]>([]);
  const [selected, setSelected] = useState<Technology | null>(
    initialData?.technology ?? null,
  );

  const [proficiency, setProficiency] = useState(
    initialData?.proficiency ?? 5,
  );

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing || !isSearching || search.trim().length < 2) {
      setOptions([]);
      setLoading(false);
      return;
    }

    let active = true;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await technologiesApi.search(
          search.trim(),
        );

        if (active) {
          setOptions(results);
        }
      } catch (err) {
        if (active) {
          setOptions([]);
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
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, isEditing]);

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
        console.log('Creating user technology with:', {
          technologyId: selected.id,
          proficiency,
        });
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

          <Autocomplete
            fullWidth
            options={options}
            value={selected}
            inputValue={
              isEditing
                ? initialData?.technology.name ?? ''
                : isSearching
                  ? search
                  : selected?.name ?? ''
            }
            loading={loading}
            disabled={isEditing || saving}
            filterOptions={(items) => items}
            getOptionLabel={(option) => option.name}
            groupBy={(option) => option.category}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            onInputChange={(_, value, reason) => {
              if (reason === 'input') {
                setSearch(value);
                setIsSearching(true);
              }

              if (reason === 'clear') {
                setSearch('');
                setSelected(null);
                setIsSearching(true);
              }
            }}
            onChange={(_, value) => {
              setSelected(value);
              setSearch('');
              setIsSearching(false);
              setOptions([]);
            }}
            onOpen={() => {
              if (!isEditing) {
                setSearch('');
                setIsSearching(true);
              }
            }}
            noOptionsText={
              search.trim().length < 2
                ? 'Wpisz minimum 2 znaki'
                : 'Nie znaleziono technologii'
            }
            loadingText="Wyszukiwanie..."
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                key={option.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                <div key={option.id}>
                  <Typography>{option.name}</Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {formatCategory(option.category)}
                  </Typography>
                </div>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Technologia"
                placeholder="Wyszukaj technologię..."
                required
                fullWidth
                size="small"
                helperText="Wpisz nazwę technologii, aby wyszukać ją w katalogu."
                slotProps={{
                  ...params.slotProps,
                  input: {
                    ...params.slotProps.input,
                    endAdornment: (
                      <>
                        {loading && <CircularProgress size={18} />}
                        {params.slotProps.input?.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
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
