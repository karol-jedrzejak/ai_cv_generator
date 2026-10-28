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
import type { Project } from '@/types/project';

interface Props {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
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

export default function ProjectCard({ project, onEdit, onDelete }: Props) {
  const start = formatDate(project.startYear, project.startMonth);
  const end = formatDate(project.endYear, project.endMonth);

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
            {project.name}
          </Typography>
          {(start || end) && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {start ?? '—'} — {end ?? '—'}
            </Typography>
          )}
          {project.description && (
            <Typography sx={{ mt: 1.5, whiteSpace: 'pre-wrap' }}>
              {project.description}
            </Typography>
          )}
          {project.responsibilities && (
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Obowiązki
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                {project.responsibilities}
              </Typography>
            </Box>
          )}
          {project.achievements && (
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Osiągnięcia
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                {project.achievements}
              </Typography>
            </Box>
          )}
          {(project.projectUrl || project.repositoryUrl) && (
            <Stack direction="row" spacing={2} sx={{ mt: 1.5, flexWrap: 'wrap' }}>
              {project.projectUrl && (
                <Link
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                >
                  Projekt <OpenInNewIcon sx={{ fontSize: 16 }} />
                </Link>
              )}
              {project.repositoryUrl && (
                <Link
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                >
                  Repozytorium <OpenInNewIcon sx={{ fontSize: 16 }} />
                </Link>
              )}
            </Stack>
          )}
          {project.technologies.length > 0 && (
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{ mt: 1.5, flexWrap: 'wrap' }}
            >
              {project.technologies.map(({ technology }) => (
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
          <Tooltip title="Edytuj projekt">
            <IconButton
              color="primary"
              aria-label={`Edytuj projekt ${project.name}`}
              onClick={() => onEdit(project)}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Usuń projekt">
            <IconButton
              color="error"
              aria-label={`Usuń projekt ${project.name}`}
              onClick={() => onDelete(project)}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
}
