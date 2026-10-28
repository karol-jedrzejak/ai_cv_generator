'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import JobOfferList from '@/components/job-offers/JobOfferList';

export default function JobOffersPage() {
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
            Oferty pracy
          </Typography>
          <Typography color="text.secondary">
            Zapisuj i zarządzaj ofertami, do których przygotowujesz aplikacje.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/dashboard/job-offers/new')}
        >
          Dodaj ofertę
        </Button>
      </Box>
      <JobOfferList />
    </Stack>
  );
}
