'use client';

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import type { LanguageSkill } from '@/types/language-skill';

interface Props {
  open: boolean;
  languageSkill: LanguageSkill | null;
  deleting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteLanguageSkillDialog({
  open,
  languageSkill,
  deleting,
  error,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={deleting ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Usunąć znajomość języka?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Czy na pewno chcesz usunąć język{' '}
          <strong>{languageSkill?.language.name}</strong>? Tej operacji nie
          można cofnąć.
        </DialogContentText>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2.5, pt: 1 }}>
        <Button onClick={onClose} disabled={deleting}>
          Anuluj
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={deleting}
        >
          {deleting ? 'Usuwanie...' : 'Usuń'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
