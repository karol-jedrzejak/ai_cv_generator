'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Alert,
  Box,
  Breadcrumbs,
  CircularProgress,
  Link,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import LanguageSkillForm from '@/components/language-skills/LanguageSkillForm';
import { languageSkillsApi } from '@/lib/api/language-skills';
import type { LanguageSkill } from '@/types/language-skill';

export default function EditLanguageSkillPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [languageSkill, setLanguageSkill] =
    useState<LanguageSkill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadLanguageSkill() {
      try {
        setLoading(true);
        setError(null);
        const data = await languageSkillsApi.getOne(id);
        if (active) setLanguageSkill(data);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Nie udało się pobrać znajomości języka.',
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadLanguageSkill();
    return () => {
      active = false;
    };
  }, [id]);

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
        <Link
          component={NextLink}
          href="/dashboard/language-skills"
          underline="hover"
          color="inherit"
        >
          Moje języki
        </Link>
        <Typography color="text.primary">Edytuj znajomość języka</Typography>
      </Breadcrumbs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert
          severity="error"
          action={
            <Link
              component={NextLink}
              href="/dashboard/language-skills"
              color="inherit"
            >
              Wróć do listy
            </Link>
          }
        >
          {error}
        </Alert>
      ) : languageSkill ? (
        <LanguageSkillForm initialData={languageSkill} />
      ) : (
        <Alert severity="warning">Nie znaleziono języka.</Alert>
      )}
    </Box>
  );
}
