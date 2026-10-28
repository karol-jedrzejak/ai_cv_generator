'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import { coursesApi } from '@/lib/api/courses';
import type { Course } from '@/types/course';
import CourseCard from './CourseCard';
import DeleteCourseDialog from './DeleteCourseDialog';

export default function CourseList() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCourses(await coursesApi.getAll());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Nie udało się pobrać kursów.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCourses();
  }, [loadCourses]);

  const handleDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await coursesApi.remove(selected.id);
      setCourses((items) => items.filter((item) => item.id !== selected.id));
      setSelected(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Nie udało się usunąć kursu.',
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  }

  return (
    <Stack spacing={3}>
      {error && (
        <Alert
          severity="error"
          action={<Button color="inherit" size="small" onClick={() => void loadCourses()}>Spróbuj ponownie</Button>}
        >
          {error}
        </Alert>
      )}
      {!error &&
        (courses.length === 0 ? (
          <Paper variant="outlined" sx={{ py: { xs: 5, sm: 8 }, px: 3, textAlign: 'center', borderRadius: 3 }}>
            <MenuBookOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
              Nie masz jeszcze dodanych kursów
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Dodaj ukończone kursy, zdobyte umiejętności i technologie.
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => router.push('/dashboard/courses/new')}>
              Dodaj pierwszy kurs
            </Button>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={(item) => router.push(`/dashboard/courses/${item.id}/edit`)}
                onDelete={(item) => {
                  setDeleteError(null);
                  setSelected(item);
                }}
              />
            ))}
          </Stack>
        ))}
      <DeleteCourseDialog
        open={Boolean(selected)}
        course={selected}
        deleting={deleting}
        error={deleteError}
        onClose={() => {
          setSelected(null);
          setDeleteError(null);
        }}
        onConfirm={() => void handleDelete()}
      />
    </Stack>
  );
}
