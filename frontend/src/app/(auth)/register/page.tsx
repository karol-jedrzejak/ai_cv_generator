"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link as MuiLink,
  Alert,
  Container,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    mobilePhone: "",
    hometown: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Błąd rejestracji");
      }

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }

      // Po udanej rejestracji od razu kierujemy na informację o weryfikacji maila
      router.push("/verify-email");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd rejestracji");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card sx={{ width: "100%", p: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography
              variant="h5"
              component="h1"
              gutterBottom
              align="center"
              sx={{ fontWeight: "bold" }}
            >
              Utwórz konto
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Imię"
                fullWidth
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                slotProps={{ htmlInput: { maxLength: 100 } }}
              />
              <TextField
                label="Nazwisko"
                fullWidth
                required
                value={formData.surname}
                onChange={(e) =>
                  setFormData({ ...formData, surname: e.target.value })
                }
                slotProps={{ htmlInput: { maxLength: 100 } }}
              />
              <TextField
                label="Telefon komórkowy"
                type="tel"
                fullWidth
                required
                value={formData.mobilePhone}
                onChange={(e) =>
                  setFormData({ ...formData, mobilePhone: e.target.value })
                }
                slotProps={{ htmlInput: { maxLength: 30 } }}
              />
              <TextField
                label="Miasto"
                fullWidth
                required
                value={formData.hometown}
                onChange={(e) =>
                  setFormData({ ...formData, hometown: e.target.value })
                }
                slotProps={{ htmlInput: { maxLength: 100 } }}
              />
              <TextField
                label="Nazwa użytkownika"
                variant="outlined"
                fullWidth
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
              <TextField
                label="Adres e-mail"
                type="email"
                variant="outlined"
                fullWidth
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <TextField
                label="Hasło"
                type="password"
                variant="outlined"
                fullWidth
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
              >
                {loading ? "Rejestrowanie..." : "Zarejestruj się"}
              </Button>
            </Box>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2">
                Masz już konto?{" "}
                <MuiLink
                  component={Link}
                  href="/login"
                  underline="hover"
                  sx={{ fontWeight: "bold" }}
                >
                  Zaloguj się
                </MuiLink>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
