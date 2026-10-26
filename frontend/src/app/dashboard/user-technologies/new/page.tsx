'use client';

import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import NextLink from 'next/link';

import UserTechnologyForm from '@/components/user-technologies/UserTechnologyForm';

export default function NewUserTechnologyPage() {
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
          href="/dashboard/user-technologies"
          underline="hover"
          color="inherit"
        >
          Moje technologie
        </Link>

        <Typography color="text.primary">Dodaj technologię</Typography>
      </Breadcrumbs>

      <UserTechnologyForm />
    </Box>
  );
}