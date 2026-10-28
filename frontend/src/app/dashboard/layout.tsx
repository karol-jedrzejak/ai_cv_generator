'use client';

import Link from 'next/link';
import LinkIcon from '@mui/icons-material/Link';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import LanguageIcon from '@mui/icons-material/Language';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

import { AppLogo } from '@/components/layout/AppLogo';

import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  CircularProgress,
  IconButton,
  Stack,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';

const navigationItems = [
  {
    href: '/dashboard/social-links',
    label: 'Linki',
    icon: <LinkIcon />,
  },
  {
    href: '/dashboard/user-technologies',
    label: 'Technologie',
    icon: <ChecklistRtlIcon />,
  },
  {
    href: '/dashboard/language-skills',
    label: 'Języki',
    icon: <LanguageIcon />,
  },
  {
    href: '/dashboard/work-experience',
    label: 'Doświadczenie',
    icon: <WorkHistoryIcon />,
  },
  {
    href: '/dashboard/projects',
    label: 'Projekty',
    icon: <FolderSpecialIcon />,
  },
  {
    href: '/dashboard/education',
    label: 'Edukacja',
    icon: <SchoolOutlinedIcon />,
  },
  {
    href: '/dashboard/courses',
    label: 'Kursy',
    icon: <MenuBookOutlinedIcon />,
  },
  {
    href: '/dashboard/certifications',
    label: 'Certyfikaty',
    icon: <WorkspacePremiumOutlinedIcon />,
  },
  {
    href: '/dashboard/job-offers',
    label: 'Oferty pracy',
    icon: <WorkOutlineIcon />,
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      await fetch('http://localhost:3001/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      // Ignorujemy błędy sieciowe przy wylogowaniu
    } finally {
      localStorage.removeItem('accessToken');
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="sticky"
        sx={{ zIndex: (theme) => theme.zIndex.appBar + 1 }}
      >
        <Toolbar sx={{ gap: { xs: 1, md: 0.5, lg: 1 } }}>
          <AppLogo />
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {navigationItems.map((item) => (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                color="inherit"
                aria-label={item.label}
                title={item.label}
                startIcon={item.icon}
                sx={{
                  minWidth: { md: 42, xl: 'auto' },
                  px: { md: 1, xl: 1.5 },
                  '& .MuiButton-startIcon': {
                    mr: { md: 0, xl: 1 },
                  },
                }}
              >
                <Box component="span" sx={{ display: { md: 'none', xl: 'inline' } }}>
                  {item.label}
                </Box>
              </Button>
            ))}
            <Button
              color="inherit"
              onClick={handleLogout}
              aria-label="Wyloguj"
              title="Wyloguj"
              startIcon={<LogoutIcon />}
              sx={{
                minWidth: { md: 42, xl: 'auto' },
                px: { md: 1, xl: 1.5 },
                '& .MuiButton-startIcon': {
                  mr: { md: 0, xl: 1 },
                },
              }}
            >
              <Box component="span" sx={{ display: { md: 'none', xl: 'inline' } }}>
                Wyloguj
              </Box>
            </Button>
          </Box>
          <IconButton
            color="inherit"
            aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'}
            aria-expanded={menuOpen}
            aria-controls="dashboard-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        id="dashboard-mobile-menu"
        aria-label="Menu główne"
        aria-hidden={!menuOpen}
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'fixed',
          top: { xs: '56px', sm: '64px' },
          left: 0,
          right: 0,
          height: {
            xs: 'calc(100dvh - 56px)',
            sm: 'calc(100dvh - 64px)',
          },
          overflowY: 'auto',
          bgcolor: 'primary.main',
          color: 'common.white',
          zIndex: (theme) => theme.zIndex.appBar,
          transform: menuOpen ? 'translateY(0)' : 'translateY(-8px)',
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden',
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: (theme) =>
            theme.transitions.create(
              ['transform', 'opacity', 'visibility'],
              {
                duration: theme.transitions.duration.short,
              },
            ),
        }}
      >
        <Stack spacing={1} sx={{ p: 3 }}>
          {navigationItems.map((item) => (
            <Button
              key={item.href}
              component={Link}
              href={item.href}
              color="inherit"
              startIcon={item.icon}
              onClick={closeMenu}
              sx={{
                justifyContent: 'flex-start',
                px: 2,
                py: 1.5,
                fontSize: '1.1rem',
              }}
            >
              {item.label}
            </Button>
          ))}
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={() => {
              closeMenu();
              void handleLogout();
            }}
            sx={{
              justifyContent: 'flex-start',
              px: 2,
              py: 1.5,
              fontSize: '1.1rem',
            }}
          >
            Wyloguj
          </Button>
        </Stack>
      </Box>
      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
}