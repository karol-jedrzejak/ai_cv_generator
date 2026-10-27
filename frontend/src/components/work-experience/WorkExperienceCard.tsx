'use client';

import {
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import type { WorkExperience } from '@/types/work-experience';

interface Props {
  experience: WorkExperience;
  onEdit: (experience: WorkExperience) => void;
  onDelete: (experience: WorkExperience) => void;
}

const MONTHS = [
  'Sty',
  'Lut',
  'Mar',
  'Kwi',
  'Maj',
  'Cze',
  'Lip',
  'Sie',
  'Wrz',
  'Paź',
  'Lis',
  'Gru',
];

function formatDate(year: number | null, month: number | null) {
  if (!year) return '—';
  return month ? `${MONTHS[month - 1]} ${year}` : String(year);
}

export default function WorkExperienceCard({
  experience,
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
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: 1,
        },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        
        sx={{ alignItems: { xs: 'stretch', sm: 'flex-start' } }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {experience.position}
          </Typography>
          <Typography variant="subtitle1">
            {experience.companyName}
            {experience.location ? ` · ${experience.location}` : ''}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {formatDate(experience.startYear, experience.startMonth)} —{' '}
            {experience.isCurrent
              ? 'Obecnie'
              : formatDate(experience.endYear, experience.endMonth)}
          </Typography>

          {experience.description && (
            <Typography sx={{ mt: 1.5, whiteSpace: 'pre-wrap' }}>
              {experience.description}
            </Typography>
          )}
          {experience.responsibilities && (
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Obowiązki
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                {experience.responsibilities}
              </Typography>
            </Box>
          )}
          {experience.achievements && (
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Osiągnięcia
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                {experience.achievements}
              </Typography>
            </Box>
          )}
          {experience.technologies.length > 0 && (
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{ mt: 1.5, alignItems: 'center' ,flexWrap: 'wrap'}}
            >
              {experience.technologies.map(({ technology }) => (
                <Chip
                  key={technology.id}
                  size="small"
                  variant="outlined"
                  label={technology.name}
                />
              ))}
            </Stack>
          )}
        </Box>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Tooltip title="Edytuj doświadczenie">
            <IconButton
              color="primary"
              aria-label={`Edytuj doświadczenie w ${experience.companyName}`}
              onClick={() => onEdit(experience)}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Usuń doświadczenie">
            <IconButton
              color="error"
              aria-label={`Usuń doświadczenie w ${experience.companyName}`}
              onClick={() => onDelete(experience)}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
}
