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
import { coursesApi } from '@/lib/api/courses';
import type { TechnologyOption } from '@/types/technology';
import type { Course } from '@/types/course';

interface Props {
  initialData?: Course;
}

const MONTHS = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];

export default function CourseForm({ initialData }: Props) {
  const router = useRouter();
  const isEditing = Boolean(initialData);
  const [name, setName] = useState(initialData?.name ?? '');
  const [organization, setOrganization] = useState(
    initialData?.organization ?? '',
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
  const [learnedSkills, setLearnedSkills] = useState(
    initialData?.learnedSkills ?? '',
  );
  const [certificateUrl, setCertificateUrl] = useState(
    initialData?.certificateUrl ?? '',
  );
  const [sortOrder, setSortOrder] = useState(
    String(initialData?.sortOrder ?? 0),
  );
  const [technologies, setTechnologies] = useState<TechnologyOption[]>(
    initialData?.technologies.map(({ technology }) => technology) ?? [],
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
        name: name.trim(),
        organization: organization.trim() || null,
        startYear: parsedStartYear,
        startMonth: parsedStartMonth,
        endYear: parsedEndYear,
        endMonth: parsedEndMonth,
        description: description.trim() || null,
        learnedSkills: learnedSkills.trim() || null,
        certificateUrl: certificateUrl.trim() || null,
        sortOrder: parsedOrder,
        technologyIds: technologies.map((technology) => technology.id),
      };

      if (initialData) {
        await coursesApi.update(initialData.id, data);
      } else {
        await coursesApi.create(data);
      }
      router.push('/dashboard/courses');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Nie udało się zapisać kursu.',
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
              {isEditing ? 'Edytuj kurs' : 'Dodaj kurs'}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Uzupełnij informacje o kursie, zdobyte umiejętności i użyte
              technologie.
            </Typography>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            required
            fullWidth
            label="Nazwa kursu"
            value={name}
            onChange={(event) => setName(event.target.value)}
            slotProps={{ htmlInput: { maxLength: 255 } }}
            disabled={saving}
          />
          <TextField
            fullWidth
            label="Organizacja"
            value={organization}
            onChange={(event) => setOrganization(event.target.value)}
            slotProps={{ htmlInput: { maxLength: 255 } }}
            disabled={saving}
          />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Okres kursu (opcjonalnie)
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
                    <MenuItem key={month} value={index + 1}>{month}</MenuItem>
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
                    <MenuItem key={month} value={index + 1}>{month}</MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Stack>
          </Box>
          <TextField
            fullWidth
            type="url"
            label="Adres certyfikatu"
            value={certificateUrl}
            onChange={(event) => setCertificateUrl(event.target.value)}
            slotProps={{ htmlInput: { maxLength: 500 } }}
            disabled={saving}
          />
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
            label="Zdobyte umiejętności"
            value={learnedSkills}
            onChange={(event) => setLearnedSkills(event.target.value)}
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
              onClick={() => router.push('/dashboard/courses')}
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
                  : 'Dodaj kurs'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
