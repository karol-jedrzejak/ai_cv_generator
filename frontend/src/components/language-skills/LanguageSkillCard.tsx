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
import type { LanguageLevel, LanguageSkill } from '@/types/language-skill';

interface Props {
  languageSkill: LanguageSkill;
  onEdit: (languageSkill: LanguageSkill) => void;
  onDelete: (languageSkill: LanguageSkill) => void;
}

const LEVEL_LABELS: Record<LanguageLevel, string> = {
  A1: 'Początkujący',
  A2: 'Podstawowy',
  B1: 'Średniozaawansowany',
  B2: 'Wyższy średniozaawansowany',
  C1: 'Zaawansowany',
  C2: 'Biegły',
  NATIVE: 'Ojczysty',
};

export default function LanguageSkillCard({
  languageSkill,
  onEdit,
  onDelete,
}: Props) {
  const name = languageSkill.language.name ?? 'Nieznany język';

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
        sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', flexWrap: 'wrap', mb: 1 }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {name}
            </Typography>
            <Chip
              size="small"
              variant="outlined"
              label={languageSkill.level}
            />
            <Chip
              size="small"
              label={LEVEL_LABELS[languageSkill.level]}
              sx={{ bgcolor: 'action.hover' }}
            />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Kolejność wyświetlania: {languageSkill.sortOrder}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Tooltip title="Edytuj znajomość języka">
            <IconButton
              color="primary"
              aria-label={`Edytuj znajomość języka ${name}`}
              onClick={() => onEdit(languageSkill)}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Usuń znajomość języka">
            <IconButton
              color="error"
              aria-label={`Usuń znajomość języka ${name}`}
              onClick={() => onDelete(languageSkill)}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
}
