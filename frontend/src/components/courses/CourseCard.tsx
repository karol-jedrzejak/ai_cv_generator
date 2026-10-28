'use client';

import {
  Box,
  Chip,
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
import type { Course } from '@/types/course';

interface Props {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

const MONTHS = [
  'Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze',
  'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru',
];

function formatDate(year: number | null, month: number | null) {
  if (!year) return null;
  return month ? `${MONTHS[month - 1]} ${year}` : String(year);
}

export default function CourseCard({ course, onEdit, onDelete }: Props) {
  const start = formatDate(course.startYear, course.startMonth);
  const end = formatDate(course.endYear, course.endMonth);

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
            {course.name}
          </Typography>
          {course.organization && (
            <Typography variant="subtitle1">{course.organization}</Typography>
          )}
          {(start || end) && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {start ?? '—'} — {end ?? '—'}
            </Typography>
          )}
          {course.certificateUrl && (
            <Link
              href={course.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 1 }}
            >
              Certyfikat <OpenInNewIcon sx={{ fontSize: 16 }} />
            </Link>
          )}
          {course.description && (
            <Typography sx={{ mt: 1.5, whiteSpace: 'pre-wrap' }}>
              {course.description}
            </Typography>
          )}
          {course.learnedSkills && (
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Zdobyte umiejętności
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                {course.learnedSkills}
              </Typography>
            </Box>
          )}
          {course.technologies.length > 0 && (
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{ mt: 1.5, flexWrap: 'wrap' }}
            >
              {course.technologies.map(({ technology }) => (
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
          <Tooltip title="Edytuj kurs">
            <IconButton
              color="primary"
              aria-label={`Edytuj kurs ${course.name}`}
              onClick={() => onEdit(course)}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Usuń kurs">
            <IconButton
              color="error"
              aria-label={`Usuń kurs ${course.name}`}
              onClick={() => onDelete(course)}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
}
