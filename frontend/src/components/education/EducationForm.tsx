'use client';

import { useState } from 'react';
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
import TechnologyMultiSelect from '@/components/technologies/TechnologyMultiSelect';
import { educationApi } from '@/lib/api/education';
import type { TechnologyOption } from '@/types/technology';
import type { Education } from '@/types/education';

interface Props {
  initialData?: Education;
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

export default function EducationForm({ initialData }: Props) {
  const router = useRouter();
  const isEditing = Boolean(initialData);
  const [institutionName, setInstitutionName] = useState(
    initialData?.institutionName ?? '',
  );
  const [fieldOfStudy, setFieldOfStudy] = useState(
    initialData?.fieldOfStudy ?? '',
  );
  const [startYear, setStartYear] = useState(
    initialData?.startYear ? String(initialData.startYear) : '',
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
  const [description, setDescription] = useState(
    initialData?.description ?? '',
  );
  const [achievements, setAchievements] = useState(
    initialData?.achievements ?? '',
  );
  const [sortOrder, setSortOrder] = useState(
    String(initialData?.sortOrder ?? 0),
  );
  const [technologies, setTechnologies] = useState<TechnologyOption[]>(
    initialData?.educationalTechnologies.map(
      ({ technology }) => technology,
    ) ?? [],
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError(null);
    const parsedStartYear = startYear ? Number(startYear) : null;
    const parsedStartMonth = startMonth ? Number(startMonth) : null;
    const parsedEndYear = endYear ? Number(endYear) : null;
    const parsedEndMonth = endMonth ? Number(endMonth) : null;
    const parsedOrder = Number(sortOrder);

    if (!Number.isInteger(parsedOrder) || parsedOrder < 0) {
      setError('Kolejność musi być liczbą całkowitą większą lub równą 0.');
      return;
    }
    if (parsedStartMonth !== null && parsedStartYear === null) {
      setError('Podaj rok rozpoczęcia, aby ustawić miesiąc.');
      return;
    }
    if (parsedEndMonth !== null && parsedEndYear === null) {
      setError('Podaj rok zakończenia, aby ustawić miesiąc.');
      return;
    }
    if (
      parsedStartYear !== null &&
      parsedEndYear !== null &&
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
        institutionName: institutionName.trim(),
        fieldOfStudy: fieldOfStudy.trim() || null,
        startYear: parsedStartYear,
        startMonth: parsedStartMonth,
        endYear: parsedEndYear,
        endMonth: parsedEndMonth,
        description: description.trim() || null,
        achievements: achievements.trim() || null,
        sortOrder: parsedOrder,
        technologyIds: technologies.map((technology) => technology.id),
      };

      if (initialData) {
        await educationApi.update(initialData.id, data);
      } else {
        await educationApi.create(data);
      }
      router.push('/dashboard/education');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Nie udało się zapisać wykształcenia.',
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
              {isEditing ? 'Edytuj wykształcenie' : 'Dodaj wykształcenie'}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Uzupełnij placówkę, kierunek, okres nauki i powiązane technologie.
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            required
            fullWidth
            label="Placówka"
            value={institutionName}
            onChange={(event) => setInstitutionName(event.target.value)}
            slotProps={{ htmlInput: { maxLength: 255 } }}
            disabled={saving}
          />
          <TextField
            fullWidth
            label="Kierunek"
            value={fieldOfStudy}
            onChange={(event) => setFieldOfStudy(event.target.value)}
            slotProps={{ htmlInput: { maxLength: 255 } }}
            disabled={saving}
          />

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Okres nauki (opcjonalnie)
            </Typography>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
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
                  label="Miesiąc rozpoczęcia"
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
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Rok zakończenia"
                  value={endYear}
                  onChange={(event) => setEndYear(event.target.value)}
                  slotProps={{ htmlInput: { min: 1900, max: 9999, step: 1 } }}
                  disabled={saving}
                />
                <TextField
                  select
                  fullWidth
                  label="Miesiąc zakończenia"
                  value={endMonth}
                  onChange={(event) => setEndMonth(event.target.value)}
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
            </Stack>
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
            disabled={saving}
            helperText="Mniejsza wartość oznacza wyższą pozycję."
          />
          <Stack
            direction={{ xs: 'column-reverse', sm: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'flex-end' }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/dashboard/education')}
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
                  : 'Dodaj wykształcenie'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
