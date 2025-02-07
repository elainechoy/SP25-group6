import React from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const Login = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:3001/auth/google";  // ✅ Correct - calls backend
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" gutterBottom>
          Sign in to Your App
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<GoogleIcon />}
          onClick={handleLogin}
        >
          Sign in with Google
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
