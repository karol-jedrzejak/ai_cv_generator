'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Alert,
  Box,
  Breadcrumbs,
  CircularProgress,
  Link,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import CourseForm from '@/components/courses/CourseForm';
import { coursesApi } from '@/lib/api/courses';
import type { Course } from '@/types/course';

export default function EditCoursePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadCourse() {
      try {
        setLoading(true);
        setError(null);
        const data = await coursesApi.getOne(id);
        if (active) setCourse(data);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : 'Nie udało się pobrać kursu.',
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadCourse();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={NextLink} href="/dashboard" underline="hover" color="inherit">
          Dashboard
        </Link>
        <Link component={NextLink} href="/dashboard/courses" underline="hover" color="inherit">
          Moje kursy
        </Link>
        <Typography color="text.primary">Edytuj kurs</Typography>
      </Breadcrumbs>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert
          severity="error"
          action={
            <Link component={NextLink} href="/dashboard/courses" color="inherit">
              Wróć do listy
            </Link>
          }
        >
          {error}
        </Alert>
      ) : course ? (
        <CourseForm initialData={course} />
      ) : (
        <Alert severity="warning">Nie znaleziono kursu.</Alert>
      )}
    </Box>
  );
}
