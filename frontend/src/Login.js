import React from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const Login = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:3001/auth/google"; 
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" gutterBottom>
          Sign in to Your App
        </Typography>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={handleLogin}
          sx={{
            backgroundColor: "#af25f5", // Custom color
            color: "#fff", // Ensure text is visible
            "&:hover": {
              backgroundColor: "#9c1fe0", // Slightly darker on hover
            },
          }}
        >
          Sign in with Google
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
