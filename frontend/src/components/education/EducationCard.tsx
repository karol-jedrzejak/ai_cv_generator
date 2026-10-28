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
import type { Education } from '@/types/education';

interface Props {
  education: Education;
  onEdit: (education: Education) => void;
  onDelete: (education: Education) => void;
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
  if (!year) return null;
  return month ? `${MONTHS[month - 1]} ${year}` : String(year);
}

export default function EducationCard({
  education,
  onEdit,
  onDelete,
}: Props) {
  const start = formatDate(education.startYear, education.startMonth);
  const end = formatDate(education.endYear, education.endMonth);

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
            {education.institutionName}
          </Typography>
          {education.fieldOfStudy && (
            <Typography variant="subtitle1">{education.fieldOfStudy}</Typography>
          )}
          {(start || end) && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {start ?? '—'} — {end ?? '—'}
            </Typography>
          )}
          {education.description && (
            <Typography sx={{ mt: 1.5, whiteSpace: 'pre-wrap' }}>
              {education.description}
            </Typography>
          )}
          {education.achievements && (
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Osiągnięcia
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                {education.achievements}
              </Typography>
            </Box>
          )}
          {education.educationalTechnologies.length > 0 && (
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{ mt: 1.5, flexWrap: 'wrap' }}
            >
              {education.educationalTechnologies.map(({ technology }) => (
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
          <Tooltip title="Edytuj wykształcenie">
            <IconButton
              color="primary"
              aria-label={`Edytuj wykształcenie: ${education.institutionName}`}
              onClick={() => onEdit(education)}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Usuń wykształcenie">
            <IconButton
              color="error"
              aria-label={`Usuń wykształcenie: ${education.institutionName}`}
              onClick={() => onDelete(education)}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
}
