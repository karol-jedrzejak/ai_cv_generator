'use client';

import {
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  LinearProgress,
} from '@mui/material';

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';

import type { UserTechnology } from '@/types/user-technology';

interface Props {
  technology: UserTechnology;
  onEdit: (technology: UserTechnology) => void;
  onDelete: (technology: UserTechnology) => void;
}

const PROFICIENCY_LABELS: Record<number, string> = {
  1: 'Początkujący',
  2: 'Podstawowy',
  3: 'Podstawowy',
  4: 'Średniozaawansowany',
  5: 'Średniozaawansowany',
  6: 'Średniozaawansowany',
  7: 'Zaawansowany',
  8: 'Zaawansowany',
  9: 'Bardzo zaawansowany',
  10: 'Ekspert',
};

function formatCategory(category: string) {
  return category
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function UserTechnologyCard({
  technology,
  onEdit,
  onDelete,
}: Props) {
  const { name, category } = technology.technology;
  const proficiency = technology.proficiency;

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
        sx={{ mb: 1, alignItems: 'center', flexWrap: 'wrap' }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              mb: 1.5,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {name}
            </Typography>

            <Chip
              size="small"
              variant="outlined"
              label={formatCategory(category)}
            />
          </Stack>

          <Stack
            direction="row"
            sx={{ mb: 1, spacing: 2, alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Typography variant="body2" color="text.secondary">
              {PROFICIENCY_LABELS[proficiency] ?? 'Poziom'}
            </Typography>

            <Typography
              variant="body2"
              sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}
            >
              {proficiency}/10
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={proficiency * 10}
            aria-label={`Poziom znajomości ${name}: ${proficiency} na 10`}
            sx={{
              height: 7,
              borderRadius: 10,
              bgcolor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                borderRadius: 10,
              },
            }}
          />
        </Box>

        <Stack
          direction="row"
          sx={{ alignSelf: { xs: 'flex-start', sm: 'center' }, spacing: 1 }}
        >
          <Tooltip title="Edytuj poziom">
            <IconButton
              color="primary"
              aria-label={`Edytuj poziom ${name}`}
              onClick={() => onEdit(technology)}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Usuń technologię">
            <IconButton
              color="error"
              aria-label={`Usuń technologię ${name}`}
              onClick={() => onDelete(technology)}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
}
