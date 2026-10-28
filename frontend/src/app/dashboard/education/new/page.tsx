'use client';

import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import EducationForm from '@/components/education/EducationForm';

export default function NewEducationPage() {
  return (
    <Box>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component={NextLink}
          href="/dashboard"
          underline="hover"
          color="inherit"
        >
          Dashboard
        </Link>
        <Link
          component={NextLink}
          href="/dashboard/education"
          underline="hover"
          color="inherit"
        >
          Moje wykształcenie
        </Link>
        <Typography color="text.primary">Dodaj wykształcenie</Typography>
      </Breadcrumbs>
      <EducationForm />
    </Box>
  );
}
