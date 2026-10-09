'use client';

import Stack from '@mui/material/Stack';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import type { SocialLink } from '@/types/social-link';

interface Props {
  link: SocialLink;
  onEdit: (link: SocialLink) => void;
  onDelete: (link: SocialLink) => void;
}

export default function SocialLinkCard({
  link,
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
        sx={{
            alignItems: {
                xs: 'stretch',
                sm: 'center',
            },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            sx={{ mb: 1, alignItems: 'center', direction: 'row' , spacing: 1, flexWrap: 'wrap' }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {link.label?.trim() || link.type.replaceAll('_', ' ')}
            </Typography>

            <Chip
              size="small"
              variant="outlined"
              label={link.type}
            />

            <Chip
              size="small"
              label={`Kolejność: ${link.sortOrder}`}
              sx={{ bgcolor: 'action.hover' }}
            />
          </Stack>

          <Typography
            component="a"
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              maxWidth: '100%',
              overflowWrap: 'anywhere',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {link.url}
            <OpenInNewIcon sx={{ fontSize: 16, flexShrink: 0 }} />
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center'}}>
          <Tooltip title="Edytuj link">
            <IconButton
              color="primary"
              aria-label="Edytuj link"
              onClick={() => onEdit(link)}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Usuń link">
            <IconButton
              color="error"
              aria-label="Usuń link"
              onClick={() => onDelete(link)}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>

          <Button
            size="small"
            variant="text"
            component="a"
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: { xs: 'none', md: 'inline-flex' } }}
          >
            Otwórz
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}