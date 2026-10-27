import { Box, Typography } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export function AppLogo() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 , flexGrow: 1, fontWeight: 'bold' }}>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 42,
          height: 42,
          borderRadius: 2,
          color: "#fff",
        }}
      >
        <DescriptionIcon sx={{ fontSize: 27 }} />
        <AutoAwesomeIcon
          sx={{
            position: "absolute",
            top: -5,
            right: -5,
            fontSize: 20,
            color: "#a9d0ff",
            borderRadius: "50%",
          }}
        />
      </Box>

      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: "#ffffff"}}
      >
        AI CV Generator
      </Typography>
    </Box>
  );
}