import React, { useEffect, useState } from "react";
import { Typography, Container, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract token from URL
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("authToken", token); // Store token
      fetchUserProfile(token);
    } else {
      navigate("/");
    }
  }, [location]);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("http://localhost:3001/profile", { 
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5}>
        {user ? (
          <>
            <Typography variant="h4">Welcome, {user.name}!</Typography>
            <Typography variant="body1">Email: {user.email}</Typography>
          </>
        ) : (
          <Typography variant="h5">Loading...</Typography>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
