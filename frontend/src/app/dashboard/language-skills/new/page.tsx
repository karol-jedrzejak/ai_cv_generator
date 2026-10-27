'use client';

import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import LanguageSkillForm from '@/components/language-skills/LanguageSkillForm';

export default function NewLanguageSkillPage() {
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
          href="/dashboard/language-skills"
          underline="hover"
          color="inherit"
        >
          Moje języki
        </Link>
        <Typography color="text.primary">Dodaj język</Typography>
      </Breadcrumbs>
      <LanguageSkillForm />
    </Box>
  );
}
