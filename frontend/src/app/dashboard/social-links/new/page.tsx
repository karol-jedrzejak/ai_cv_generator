'use client';

import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import NextLink from 'next/link';

import SocialLinkForm from '@/components/social-links/SocialLinkForm';

export default function NewSocialLinkPage() {
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
          href="/dashboard/social-links"
          underline="hover"
          color="inherit"
        >
          Moje linki
        </Link>

        <Typography color="text.primary">Dodaj link</Typography>
      </Breadcrumbs>

      <SocialLinkForm />
    </Box>
  );
}