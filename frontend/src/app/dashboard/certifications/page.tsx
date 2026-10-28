'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import CertificationList from '@/components/certifications/CertificationList';

export default function CertificationsPage() {
  const router = useRouter();

  return (
    <Stack spacing={4}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{ fontWeight: 800 }}
            variant="h4"
            component="h1"
            gutterBottom
          >
            Moje certyfikaty
          </Typography>
          <Typography color="text.secondary">
            Zarządzaj certyfikatami, poświadczeniami i powiązanymi technologiami.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/dashboard/certifications/new')}
        >
          Dodaj certyfikat
        </Button>
      </Box>
      <CertificationList />
    </Stack>
  );
}
