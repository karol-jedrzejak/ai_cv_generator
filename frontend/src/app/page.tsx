'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp?: number;
}

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      router.replace('/login');
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      // Brak exp lub token po terminie = token nieważny
      if (!decoded.exp || decoded.exp * 1000 <= Date.now()) {
        localStorage.removeItem('accessToken');
        router.replace('/login');
        return;
      }

      router.replace('/dashboard');
    } catch {
      // Nieprawidłowy format tokenu
      localStorage.removeItem('accessToken');
      router.replace('/login');
    }
  }, [router]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress />
    </Box>
  );
}