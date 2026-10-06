'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Container,
} from '@mui/material';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleResendEmail = async () => {
    setLoading(true);
    setResendStatus(null);

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:3001/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Nie udało się wysłać ponownego maila');
      }

      setResendStatus('Link weryfikacyjny został ponownie wysłany na Twój e-mail.');
    } catch (err: any) {
      setResendStatus('Wystąpił błąd podczas wysyłania maila.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card sx={{ width: '100%', p: 3, textAlign: 'center', boxShadow: 3 }}>
          <CardContent>
            <MarkEmailUnreadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Zweryfikuj swój adres e-mail
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Wysłaliśmy link aktywacyjny na Twój adres e-mail. Kliknij go, aby odblokować pełny dostęp do aplikacji.
            </Typography>

            {resendStatus && (
              <Alert severity="info" sx={{ mb: 2 }}>
                {resendStatus}
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleResendEmail}
                disabled={loading}
              >
                {loading ? 'Wysyłanie...' : 'Wyślij e-mail ponownie'}
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleLogout}>
                Wyloguj się
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}