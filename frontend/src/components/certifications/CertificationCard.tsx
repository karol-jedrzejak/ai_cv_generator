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
import type { Certification } from '@/types/certification';

interface Props {
  certification: Certification;
  onEdit: (certification: Certification) => void;
  onDelete: (certification: Certification) => void;
}

const MONTHS = [
  'Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze',
  'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru',
];

function formatDate(year: number | null, month: number | null) {
  if (!year) return null;
  return month ? `${MONTHS[month - 1]} ${year}` : String(year);
}

export default function CertificationCard({
  certification,
  onEdit,
  onDelete,
}: Props) {
  const issued = formatDate(certification.issuedYear, certification.issuedMonth);
  const expiration = formatDate(
    certification.expirationYear,
    certification.expirationMonth,
  );

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
            {certification.name}
          </Typography>
          <Typography variant="subtitle1">{certification.organization}</Typography>
          {(issued || expiration) && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Uzyskano: {issued ?? '—'} · Ważny do: {expiration ?? 'bezterminowo'}
            </Typography>
          )}
          {certification.credentialId && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              ID poświadczenia: {certification.credentialId}
            </Typography>
          )}
          {certification.credentialUrl && (
            <Link
              href={certification.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 1 }}
            >
              Zobacz poświadczenie <OpenInNewIcon sx={{ fontSize: 16 }} />
            </Link>
          )}
          {certification.description && (
            <Typography sx={{ mt: 1.5, whiteSpace: 'pre-wrap' }}>
              {certification.description}
            </Typography>
          )}
          {certification.certificationTechnologies.length > 0 && (
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{ mt: 1.5, flexWrap: 'wrap' }}
            >
              {certification.certificationTechnologies.map(({ technology }) => (
                <Chip key={technology.id} size="small" variant="outlined" label={technology.name} />
              ))}
            </Stack>
          )}
        </Box>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Tooltip title="Edytuj certyfikat">
            <IconButton
              color="primary"
              aria-label={`Edytuj certyfikat ${certification.name}`}
              onClick={() => onEdit(certification)}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Usuń certyfikat">
            <IconButton
              color="error"
              aria-label={`Usuń certyfikat ${certification.name}`}
              onClick={() => onDelete(certification)}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
}
