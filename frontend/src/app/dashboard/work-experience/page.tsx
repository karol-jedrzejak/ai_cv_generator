'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import WorkExperienceList from '@/components/work-experience/WorkExperienceList';

export default function WorkExperiencePage() {
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
            Moje doświadczenie
          </Typography>
          <Typography color="text.secondary">
            Zarządzaj stanowiskami, obowiązkami, osiągnięciami i
            technologiami w swoim CV.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/dashboard/work-experience/new')}
        >
          Dodaj doświadczenie
        </Button>
      </Box>
      <WorkExperienceList />
    </Stack>
  );
}
