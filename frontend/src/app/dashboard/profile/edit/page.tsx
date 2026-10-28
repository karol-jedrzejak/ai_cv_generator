'use client';

import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import SaveIcon from '@mui/icons-material/Save';
import { userProfileApi } from '@/lib/api/user-profile';
import type { UserProfile } from '@/types/user-profile';

export default function EditProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      try {
        const data = await userProfileApi.get();
        if (active) {
          setProfile(data);
          setName(data.name ?? '');
          setSurname(data.surname ?? '');
          setEmail(data.email);
          setMobilePhone(data.mobilePhone ?? '');
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Nie udało się pobrać danych profilu.',
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password || confirmPassword) {
      if (!password || !confirmPassword) {
        setError('Wpisz nowe hasło w obu polach.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Hasła muszą być identyczne.');
        return;
      }
      if (password.length < 8) {
        setError('Hasło musi mieć co najmniej 8 znaków.');
        return;
      }
    }

    try {
      setSaving(true);
      const updatedProfile = await userProfileApi.update({
        name: name.trim() || null,
        surname: surname.trim() || null,
        email: email.trim(),
        mobilePhone: mobilePhone.trim() || null,
        ...(password && { password, confirmPassword }),
      });
      setProfile(updatedProfile);
      setName(updatedProfile.name ?? '');
      setSurname(updatedProfile.surname ?? '');
      setEmail(updatedProfile.email);
      setMobilePhone(updatedProfile.mobilePhone ?? '');
      setPassword('');
      setConfirmPassword('');
      setSuccess('Dane profilu zostały zapisane.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Nie udało się zapisać danych profilu.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component={NextLink}
          href="/dashboard"
          underline="hover"
          color="inherit"
        >
          Dashboard
        </Link>
        <Typography color="text.primary">Mój profil</Typography>
      </Breadcrumbs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : !profile ? (
        <Alert severity="error">
          {error ?? 'Nie udało się załadować profilu.'}
        </Alert>
      ) : (
        <Paper
          variant="outlined"
          sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3, maxWidth: 760 }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Edytuj profil
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Zaktualizuj dane konta. Zmiana hasła jest opcjonalna.
                </Typography>
              </Box>
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Imię"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  slotProps={{ htmlInput: { maxLength: 100 } }}
                  disabled={saving}
                />
                <TextField
                  fullWidth
                  label="Nazwisko"
                  value={surname}
                  onChange={(event) => setSurname(event.target.value)}
                  slotProps={{ htmlInput: { maxLength: 100 } }}
                  disabled={saving}
                />
              </Stack>
              <TextField
                required
                fullWidth
                type="email"
                label="Adres e-mail"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                slotProps={{ htmlInput: { maxLength: 255 } }}
                disabled={saving}
              />
              <TextField
                fullWidth
                type="tel"
                label="Numer telefonu komórkowego"
                autoComplete="tel"
                value={mobilePhone}
                onChange={(event) => setMobilePhone(event.target.value)}
                slotProps={{ htmlInput: { maxLength: 30 } }}
                helperText="Podaj numer z kodem kraju, jeśli jest potrzebny."
                disabled={saving}
              />
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>
                Zmiana hasła (opcjonalnie)
              </Typography>
              <TextField
                fullWidth
                type="password"
                label="Nowe hasło"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                slotProps={{ htmlInput: { minLength: 8 } }}
                helperText="Co najmniej 8 znaków."
                disabled={saving}
              />
              <TextField
                fullWidth
                type="password"
                label="Powtórz nowe hasło"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                slotProps={{ htmlInput: { minLength: 8 } }}
                disabled={saving}
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={saving}
                sx={{ alignSelf: { sm: 'flex-start' } }}
              >
                {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
              </Button>
            </Stack>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
