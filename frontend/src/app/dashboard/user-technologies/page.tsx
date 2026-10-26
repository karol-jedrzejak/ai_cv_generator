'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

import UserTechnologyList from '@/components/user-technologies/UserTechnologyList';

export default function UserTechnologiesPage() {
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
            Moje technologie
          </Typography>

          <Typography color="text.secondary">
            Zarządzaj technologiami, które znasz i chcesz udostępniać w swoim CV.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/dashboard/user-technologies/new')}
        >
          Dodaj technologie
        </Button>
      </Box>

      <UserTechnologyList />
    </Stack>
  );
}