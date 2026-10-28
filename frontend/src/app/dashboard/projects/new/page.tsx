'use client';

import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import ProjectForm from '@/components/projects/ProjectForm';

export default function NewProjectPage() {
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
          href="/dashboard/projects"
          underline="hover"
          color="inherit"
        >
          Moje projekty
        </Link>
        <Typography color="text.primary">Dodaj projekt</Typography>
      </Breadcrumbs>
      <ProjectForm />
    </Box>
  );
}
