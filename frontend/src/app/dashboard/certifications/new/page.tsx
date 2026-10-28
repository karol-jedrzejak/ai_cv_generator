'use client';

import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import CertificationForm from '@/components/certifications/CertificationForm';

export default function NewCertificationPage() {
  return (
    <Box>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={NextLink} href="/dashboard" underline="hover" color="inherit">
          Dashboard
        </Link>
        <Link component={NextLink} href="/dashboard/certifications" underline="hover" color="inherit">
          Moje certyfikaty
        </Link>
        <Typography color="text.primary">Dodaj certyfikat</Typography>
      </Breadcrumbs>
      <CertificationForm />
    </Box>
  );
}
