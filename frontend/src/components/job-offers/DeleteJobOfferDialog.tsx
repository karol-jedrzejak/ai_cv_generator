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
import type { JobOffer } from '@/types/job-offer';

interface Props {
  open: boolean;
  jobOffer: JobOffer | null;
  deleting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteJobOfferDialog({
  open,
  jobOffer,
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
      <DialogTitle>Usunąć ofertę pracy?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Czy na pewno chcesz usunąć ofertę{' '}
          <strong>{jobOffer?.title}</strong>? Powiązane CV i listy motywacyjne
          również zostaną usunięte. Tej operacji nie można cofnąć.
        </DialogContentText>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions sx={{ p: 2.5, pt: 1 }}>
        <Button onClick={onClose} disabled={deleting}>Anuluj</Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={deleting}
        >
          {deleting ? 'Usuwanie...' : 'Usuń ofertę'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
