'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LanguageIcon from '@mui/icons-material/Language';
import { languageSkillsApi } from '@/lib/api/language-skills';
import type { LanguageSkill } from '@/types/language-skill';
import DeleteLanguageSkillDialog from './DeleteLanguageSkillDialog';
import LanguageSkillCard from './LanguageSkillCard';

export default function LanguageSkillList() {
  const router = useRouter();
  const [languageSkills, setLanguageSkills] = useState<LanguageSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<LanguageSkill | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadLanguageSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setLanguageSkills(await languageSkillsApi.getAll());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Nie udało się pobrać znajomości języków.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLanguageSkills();
  }, [loadLanguageSkills]);

  const handleDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await languageSkillsApi.remove(selected.id);
      setLanguageSkills((current) =>
        current.filter((skill) => skill.id !== selected.id),
      );
      setSelected(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : 'Nie udało się usunąć znajomości języka.',
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {error && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => void loadLanguageSkills()}
            >
              Spróbuj ponownie
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      {!error &&
        (languageSkills.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              py: { xs: 5, sm: 8 },
              px: 3,
              textAlign: 'center',
              borderRadius: 3,
            }}
          >
            <LanguageIcon
              sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
              Nie masz jeszcze dodanych języków
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Dodaj języki i określ swój poziom ich znajomości.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/dashboard/language-skills/new')}
            >
              Dodaj pierwszy język
            </Button>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {languageSkills.map((languageSkill) => (
              <LanguageSkillCard
                key={languageSkill.id}
                languageSkill={languageSkill}
                onEdit={(item) =>
                  router.push(
                    `/dashboard/language-skills/${item.id}/edit`,
                  )
                }
                onDelete={(item) => {
                  setDeleteError(null);
                  setSelected(item);
                }}
              />
            ))}
          </Stack>
        ))}
      <DeleteLanguageSkillDialog
        open={Boolean(selected)}
        languageSkill={selected}
        deleting={deleting}
        error={deleteError}
        onClose={() => {
          setSelected(null);
          setDeleteError(null);
        }}
        onConfirm={() => void handleDelete()}
      />
    </Stack>
  );
}
