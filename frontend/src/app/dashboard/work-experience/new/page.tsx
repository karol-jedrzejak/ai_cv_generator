'use client';

import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import WorkExperienceForm from '@/components/work-experience/WorkExperienceForm';

export default function NewWorkExperiencePage() {
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
          href="/dashboard/work-experience"
          underline="hover"
          color="inherit"
        >
          Moje doświadczenie
        </Link>
        <Typography color="text.primary">Dodaj doświadczenie</Typography>
      </Breadcrumbs>
      <WorkExperienceForm />
    </Box>
  );
}
