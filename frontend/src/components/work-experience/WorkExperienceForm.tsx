'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import TechnologyMultiSelect from '@/components/technologies/TechnologyMultiSelect';
import { workExperiencesApi } from '@/lib/api/work-experience';
import type { TechnologyOption } from '@/types/technology';
import type {
  WorkExperience,
} from '@/types/work-experience';

interface Props {
  initialData?: WorkExperience;
}

const MONTHS = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
];

export default function WorkExperienceForm({ initialData }: Props) {
  const router = useRouter();
  const isEditing = Boolean(initialData);
  const [companyName, setCompanyName] = useState(
    initialData?.companyName ?? '',
  );
  const [position, setPosition] = useState(initialData?.position ?? '');
  const [location, setLocation] = useState(initialData?.location ?? '');
  const [startYear, setStartYear] = useState(
    String(initialData?.startYear ?? new Date().getFullYear()),
  );
  const [startMonth, setStartMonth] = useState(
    initialData?.startMonth ? String(initialData.startMonth) : '',
  );
  const [endYear, setEndYear] = useState(
    initialData?.endYear ? String(initialData.endYear) : '',
  );
  const [endMonth, setEndMonth] = useState(
    initialData?.endMonth ? String(initialData.endMonth) : '',
  );
  const [isCurrent, setIsCurrent] = useState(
    initialData?.isCurrent ?? false,
  );
  const [description, setDescription] = useState(
    initialData?.description ?? '',
  );
  const [responsibilities, setResponsibilities] = useState(
    initialData?.responsibilities ?? '',
  );
  const [achievements, setAchievements] = useState(
    initialData?.achievements ?? '',
  );
  const [sortOrder, setSortOrder] = useState(
    String(initialData?.sortOrder ?? 0),
  );
  const [technologies, setTechnologies] = useState<TechnologyOption[]>(
    initialData?.technologies.map((item) => item.technology) ?? [],
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError(null);
    const parsedStartYear = Number(startYear);
    const parsedEndYear = endYear ? Number(endYear) : undefined;
    const parsedStartMonth = startMonth ? Number(startMonth) : null;
    const parsedEndMonth = endMonth ? Number(endMonth) : null;
    const parsedOrder = Number(sortOrder);

    if (!Number.isInteger(parsedOrder) || parsedOrder < 0) {
      setError('Kolejność musi być liczbą całkowitą większą lub równą 0.');
      return;
    }
    if (!isCurrent && parsedEndMonth !== null && parsedEndYear === undefined) {
      setError('Podaj rok zakończenia, aby ustawić miesiąc.');
      return;
    }
    if (
      !isCurrent &&
      parsedEndYear !== undefined &&
      (parsedEndYear < parsedStartYear ||
        (parsedEndYear === parsedStartYear &&
          parsedStartMonth !== null &&
          parsedEndMonth !== null &&
          parsedEndMonth < parsedStartMonth))
    ) {
      setError('Data zakończenia nie może poprzedzać daty rozpoczęcia.');
      return;
    }

    try {
      setSaving(true);
      const data = {
        companyName: companyName.trim(),
        position: position.trim(),
        location: location.trim() || null,
        startYear: parsedStartYear,
        startMonth: parsedStartMonth,
        endYear: isCurrent ? null : (parsedEndYear ?? null),
        endMonth: isCurrent ? null : parsedEndMonth,
        isCurrent,
        description: description.trim() || null,
        responsibilities: responsibilities.trim() || null,
        achievements: achievements.trim() || null,
        sortOrder: parsedOrder,
        technologyIds: technologies.map((technology) => technology.id),
      };

      if (initialData) {
        await workExperiencesApi.update(initialData.id, data);
      } else {
        await workExperiencesApi.create(data);
      }
      router.push('/dashboard/work-experience');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Nie udało się zapisać doświadczenia zawodowego.',
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
              {isEditing
                ? 'Edytuj doświadczenie'
                : 'Dodaj doświadczenie'}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Uzupełnij stanowisko, okres zatrudnienia i technologie używane
              w tej pracy.
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              required
              fullWidth
              label="Firma"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              slotProps={{ htmlInput: { maxLength: 200 } }}
              disabled={saving}
            />
            <TextField
              required
              fullWidth
              label="Stanowisko"
              value={position}
              onChange={(event) => setPosition(event.target.value)}
              slotProps={{ htmlInput: { maxLength: 200 } }}
              disabled={saving}
            />
          </Stack>

          <TextField
            fullWidth
            label="Lokalizacja"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            slotProps={{ htmlInput: { maxLength: 255 } }}
            disabled={saving}
          />

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Okres zatrudnienia
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                required
                fullWidth
                type="number"
                label="Rok rozpoczęcia"
                value={startYear}
                onChange={(event) => setStartYear(event.target.value)}
                slotProps={{ htmlInput: { min: 1900, max: 9999, step: 1 } }}
                disabled={saving}
              />
              <TextField
                select
                fullWidth
                label="Miesiąc rozpoczęcia (opcjonalnie)"
                value={startMonth}
                onChange={(event) => setStartMonth(event.target.value)}
                disabled={saving}
              >
                <MenuItem value="">Nie podano</MenuItem>
                {MONTHS.map((month, index) => (
                  <MenuItem key={month} value={index + 1}>
                    {month}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mt: 2 }}
            >
              <TextField
                fullWidth
                type="number"
                label="Rok zakończenia"
                value={endYear}
                onChange={(event) => setEndYear(event.target.value)}
                slotProps={{ htmlInput: { min: 1900, max: 9999, step: 1 } }}
                disabled={saving || isCurrent}
              />
              <TextField
                select
                fullWidth
                label="Miesiąc zakończenia (opcjonalnie)"
                value={endMonth}
                onChange={(event) => setEndMonth(event.target.value)}
                disabled={saving || isCurrent}
              >
                <MenuItem value="">Nie podano</MenuItem>
                {MONTHS.map((month, index) => (
                  <MenuItem key={month} value={index + 1}>
                    {month}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <FormControlLabel
              sx={{ mt: 1 }}
              control={
                <Checkbox
                  checked={isCurrent}
                  disabled={saving}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    setIsCurrent(checked);
                    if (checked) {
                      setEndYear('');
                      setEndMonth('');
                    }
                  }}
                />
              }
              label="Obecnie pracuję na tym stanowisku"
            />
          </Box>

          <TechnologyMultiSelect
            value={technologies}
            onChange={setTechnologies}
            onError={setError}
            disabled={saving}
          />

          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Opis"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={saving}
          />
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Obowiązki"
            value={responsibilities}
            onChange={(event) => setResponsibilities(event.target.value)}
            disabled={saving}
          />
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Osiągnięcia"
            value={achievements}
            onChange={(event) => setAchievements(event.target.value)}
            disabled={saving}
          />
          <TextField
            required
            fullWidth
            type="number"
            label="Kolejność wyświetlania"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            slotProps={{ htmlInput: { min: 0, step: 1 } }}
            helperText="Mniejsza wartość oznacza wyższą pozycję."
            disabled={saving}
          />

          <Stack
            direction={{ xs: 'column-reverse', sm: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'flex-end' }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/dashboard/work-experience')}
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
                  : 'Dodaj doświadczenie'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
