'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

import SocialLinkList from '@/components/social-links/SocialLinkList';

export default function SocialLinksPage() {
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
            Moje linki
          </Typography>

          <Typography color="text.secondary">
            Zarządzaj linkami, które chcesz udostępniać w swoim CV.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/dashboard/social-links/new')}
        >
          Dodaj link
        </Button>
      </Box>

      <SocialLinkList />
    </Stack>
  );
}