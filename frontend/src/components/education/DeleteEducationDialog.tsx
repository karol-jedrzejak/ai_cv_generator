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
import type { Education } from '@/types/education';

interface Props {
  open: boolean;
  education: Education | null;
  deleting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteEducationDialog({
  open,
  education,
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
      <DialogTitle>Usunąć wykształcenie?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Czy na pewno chcesz usunąć wpis{' '}
          <strong>{education?.institutionName}</strong>? Tej operacji nie
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
