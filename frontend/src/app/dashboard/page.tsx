'use client';

import React, { useEffect, useState } from 'react';
import { Typography, Paper, Box, CircularProgress, Alert } from '@mui/material';

interface UserProfile {
  name?: string;
  surname?: string;
  username: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const res = await fetch('http://localhost:3001/users/protected', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Nie udało się pobrać danych użytkownika');
        }

        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const displayName = user?.name && user?.surname 
    ? `${user.name} ${user.surname}` 
    : user?.username;

  return (
    <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Witaj, {displayName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Witaj w generatorze CV i listów motywacyjnych AI. Wybierz opcję z menu, aby rozpocząć tworzenie dokumentów.
        </Typography>
      </Box>
    </Paper>
  );
}