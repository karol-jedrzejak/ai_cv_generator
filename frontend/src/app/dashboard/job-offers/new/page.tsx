'use client';

import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import JobOfferForm from '@/components/job-offers/JobOfferForm';

export default function NewJobOfferPage() {
  return (
    <Box>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={NextLink} href="/dashboard" underline="hover" color="inherit">
          Dashboard
        </Link>
        <Link component={NextLink} href="/dashboard/job-offers" underline="hover" color="inherit">
          Oferty pracy
        </Link>
        <Typography color="text.primary">Dodaj ofertę</Typography>
      </Breadcrumbs>
      <JobOfferForm />
    </Box>
  );
}
