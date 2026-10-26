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

import type { UserTechnology } from '@/types/user-technology';

interface Props {
  open: boolean;
  technology: UserTechnology | null;
  deleting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteUserTechnologyDialog({
  open,
  technology,
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
      <DialogTitle>Usunąć link?</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Czy na pewno chcesz usunąć technologię{' '}
          <strong>
            {technology?.technology.name}
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
          {deleting ? 'Usuwanie...' : 'Usuń link'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}