'use client';

import {
  Box,
  IconButton,
  Link,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { JobOffer } from '@/types/job-offer';

interface Props {
  jobOffer: JobOffer;
  onEdit: (jobOffer: JobOffer) => void;
  onDelete: (jobOffer: JobOffer) => void;
}

export default function JobOfferCard({
  jobOffer,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 3,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        '&:hover': { borderColor: 'primary.main', boxShadow: 1 },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { xs: 'stretch', sm: 'flex-start' } }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {jobOffer.title}
          </Typography>
          {jobOffer.companyName && (
            <Typography variant="subtitle1">{jobOffer.companyName}</Typography>
          )}
          {jobOffer.url && (
            <Link
              href={jobOffer.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 0.5,
              }}
            >
              Otwórz ofertę <OpenInNewIcon sx={{ fontSize: 16 }} />
            </Link>
          )}
          <Typography sx={{ mt: 1.5, whiteSpace: 'pre-wrap' }}>
            {jobOffer.description}
          </Typography>
          {jobOffer.updatedAt && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Ostatnia aktualizacja:{' '}
              {new Intl.DateTimeFormat('pl-PL', {
                dateStyle: 'medium',
              }).format(new Date(jobOffer.updatedAt))}
            </Typography>
          )}
        </Box>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Tooltip title="Edytuj ofertę">
            <IconButton
              color="primary"
              aria-label={`Edytuj ofertę ${jobOffer.title}`}
              onClick={() => onEdit(jobOffer)}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Usuń ofertę">
            <IconButton
              color="error"
              aria-label={`Usuń ofertę ${jobOffer.title}`}
              onClick={() => onDelete(jobOffer)}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
}
