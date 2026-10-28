'use client';

import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import CourseForm from '@/components/courses/CourseForm';

export default function NewCoursePage() {
  return (
    <Box>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={NextLink} href="/dashboard" underline="hover" color="inherit">
          Dashboard
        </Link>
        <Link component={NextLink} href="/dashboard/courses" underline="hover" color="inherit">
          Moje kursy
        </Link>
        <Typography color="text.primary">Dodaj kurs</Typography>
      </Breadcrumbs>
      <CourseForm />
    </Box>
  );
}
