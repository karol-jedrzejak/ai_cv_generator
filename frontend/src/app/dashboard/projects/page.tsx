'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import ProjectList from '@/components/projects/ProjectList';

export default function ProjectsPage() {
  const router = useRouter();

  return (
    <Stack spacing={4}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{ fontWeight: 800 }}
            variant="h4"
            component="h1"
            gutterBottom
          >
            Moje projekty
          </Typography>
          <Typography color="text.secondary">
            Zarządzaj projektami, ich osiągnięciami, linkami i technologiami.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/dashboard/projects/new')}
        >
          Dodaj projekt
        </Button>
      </Box>
      <ProjectList />
    </Stack>
  );
}
