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
import { certificationsApi } from '@/lib/api/certifications';
import type { TechnologyOption } from '@/types/technology';
import type { Certification } from '@/types/certification';

interface Props {
  initialData?: Certification;
}

const MONTHS = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];

export default function CertificationForm({ initialData }: Props) {
  const router = useRouter();
  const isEditing = Boolean(initialData);
  const [name, setName] = useState(initialData?.name ?? '');
  const [organization, setOrganization] = useState(
    initialData?.organization ?? '',
  );
  const [issuedYear, setIssuedYear] = useState(
    initialData?.issuedYear ? String(initialData.issuedYear) : '',
  );
  const [issuedMonth, setIssuedMonth] = useState(
    initialData?.issuedMonth ? String(initialData.issuedMonth) : '',
  );
  const [expirationYear, setExpirationYear] = useState(
    initialData?.expirationYear ? String(initialData.expirationYear) : '',
  );
  const [expirationMonth, setExpirationMonth] = useState(
    initialData?.expirationMonth ? String(initialData.expirationMonth) : '',
  );
  const [credentialId, setCredentialId] = useState(
    initialData?.credentialId ?? '',
  );
  const [credentialUrl, setCredentialUrl] = useState(
    initialData?.credentialUrl ?? '',
  );
  const [description, setDescription] = useState(
    initialData?.description ?? '',
  );
  const [technologies, setTechnologies] = useState<TechnologyOption[]>(
    initialData?.certificationTechnologies.map(
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
    const parsedIssuedYear = issuedYear ? Number(issuedYear) : null;
    const parsedIssuedMonth = issuedMonth ? Number(issuedMonth) : null;
    const parsedExpirationYear = expirationYear
      ? Number(expirationYear)
      : null;
    const parsedExpirationMonth = expirationMonth
      ? Number(expirationMonth)
      : null;

    if (parsedIssuedMonth !== null && parsedIssuedYear === null) {
      setError('Podaj rok uzyskania, aby ustawić miesiąc.');
      return;
    }
    if (parsedExpirationMonth !== null && parsedExpirationYear === null) {
      setError('Podaj rok wygaśnięcia, aby ustawić miesiąc.');
      return;
    }
    if (
      parsedIssuedYear !== null &&
      parsedExpirationYear !== null &&
      (parsedExpirationYear < parsedIssuedYear ||
        (parsedExpirationYear === parsedIssuedYear &&
          parsedIssuedMonth !== null &&
          parsedExpirationMonth !== null &&
          parsedExpirationMonth < parsedIssuedMonth))
    ) {
      setError('Data wygaśnięcia nie może poprzedzać daty uzyskania.');
      return;
    }

    try {
      setSaving(true);
      const data = {
        name: name.trim(),
        organization: organization.trim(),
        issuedYear: parsedIssuedYear,
        issuedMonth: parsedIssuedMonth,
        expirationYear: parsedExpirationYear,
        expirationMonth: parsedExpirationMonth,
        credentialId: credentialId.trim() || null,
        credentialUrl: credentialUrl.trim() || null,
        description: description.trim() || null,
        technologyIds: technologies.map((technology) => technology.id),
      };

      if (initialData) {
        await certificationsApi.update(initialData.id, data);
      } else {
        await certificationsApi.create(data);
      }
      router.push('/dashboard/certifications');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Nie udało się zapisać certyfikatu.',
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
              {isEditing ? 'Edytuj certyfikat' : 'Dodaj certyfikat'}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Uzupełnij dane certyfikatu, dane weryfikacyjne i powiązane
              technologie.
            </Typography>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              required
              fullWidth
              label="Nazwa certyfikatu"
              value={name}
              onChange={(event) => setName(event.target.value)}
              slotProps={{ htmlInput: { maxLength: 255 } }}
              disabled={saving}
            />
            <TextField
              required
              fullWidth
              label="Organizacja"
              value={organization}
              onChange={(event) => setOrganization(event.target.value)}
              slotProps={{ htmlInput: { maxLength: 255 } }}
              disabled={saving}
            />
          </Stack>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Ważność certyfikatu (opcjonalnie)
            </Typography>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Rok uzyskania"
                  value={issuedYear}
                  onChange={(event) => setIssuedYear(event.target.value)}
                  slotProps={{ htmlInput: { min: 1900, max: 9999, step: 1 } }}
                  disabled={saving}
                />
                <TextField
                  select
                  fullWidth
                  label="Miesiąc uzyskania"
                  value={issuedMonth}
                  onChange={(event) => setIssuedMonth(event.target.value)}
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
                  label="Rok wygaśnięcia"
                  value={expirationYear}
                  onChange={(event) => setExpirationYear(event.target.value)}
                  slotProps={{ htmlInput: { min: 1900, max: 9999, step: 1 } }}
                  disabled={saving}
                />
                <TextField
                  select
                  fullWidth
                  label="Miesiąc wygaśnięcia"
                  value={expirationMonth}
                  onChange={(event) => setExpirationMonth(event.target.value)}
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
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="ID poświadczenia"
              value={credentialId}
              onChange={(event) => setCredentialId(event.target.value)}
              slotProps={{ htmlInput: { maxLength: 255 } }}
              disabled={saving}
            />
            <TextField
              fullWidth
              type="url"
              label="Adres poświadczenia"
              value={credentialUrl}
              onChange={(event) => setCredentialUrl(event.target.value)}
              slotProps={{ htmlInput: { maxLength: 500 } }}
              disabled={saving}
            />
          </Stack>
          <TechnologyMultiSelect
            value={technologies}
            onChange={setTechnologies}
            onError={setError}
            disabled={saving}
          />
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Opis"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
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
              onClick={() => router.push('/dashboard/certifications')}
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
                  : 'Dodaj certyfikat'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
