'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import LanguageSkillList from '@/components/language-skills/LanguageSkillList';

export default function LanguageSkillsPage() {
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
            Moje języki
          </Typography>
          <Typography color="text.secondary">
            Zarządzaj językami i poziomem ich znajomości w swoim CV.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/dashboard/language-skills/new')}
        >
          Dodaj język
        </Button>
      </Box>
      <LanguageSkillList />
    </Stack>
  );
}
