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
import type { WorkExperience } from '@/types/work-experience';

interface Props {
  open: boolean;
  experience: WorkExperience | null;
  deleting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteWorkExperienceDialog({
  open,
  experience,
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
      <DialogTitle>Usunąć doświadczenie?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Czy na pewno chcesz usunąć stanowisko{' '}
          <strong>
            {experience?.position} w {experience?.companyName}
          </strong>
          ? Tej operacji nie można cofnąć.
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
          {deleting ? 'Usuwanie...' : 'Usuń doświadczenie'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
