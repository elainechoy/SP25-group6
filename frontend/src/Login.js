// import React from "react";
// import { Button, Container, Typography, Box } from "@mui/material";
// import GoogleIcon from "@mui/icons-material/Google";

// const Login = () => {
//   const handleLogin = () => {
//     window.location.href = "http://localhost:3001/auth/google"; 
//   };

//   return (
//     <Container maxWidth="sm">
//       <Box textAlign="center" mt={5}>
//         <Typography variant="h4" gutterBottom>
//           Sign in to Your App
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<GoogleIcon />}
//           onClick={handleLogin}
//           sx={{
//             backgroundColor: "#af25f5", // Custom color
//             color: "#fff", // Ensure text is visible
//             "&:hover": {
//               backgroundColor: "#9c1fe0", // Slightly darker on hover
//             },
//           }}
//         >
//           Sign in with Google
//         </Button>
//       </Box>
//     </Container>
//   );
// };

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import loginPic from './Login_pic.png'; // Adjust path accordingly
import { AUTH_URL } from './config.js'

const Login = () => {
  const handleLogin = () => {
    console.log(`${AUTH_URL}`)
    window.location.href = `${AUTH_URL}/google`;
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #7c3aed, rgb(183, 124, 239), #7c3aed)",
        color: "white",
      }}
    >
      {/* Left section: Text and button */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          pl: { xs: 4, sm: 8, md: 12 },
          pr: 2,
        }}
      >

        <Typography
          variant="h4"
          noWrap
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 'bold',
            fontSize: '2.6rem',
            letterSpacing: '.2rem',
            color: '#3b0764',
            textDecoration: 'none',
            cursor: 'pointer',
            paddingBottom: '1rem',
          }}
        >
          TIMESNAP
        </Typography>

        <Typography variant="h2" fontWeight="bold" gutterBottom>
          Save your memories <br /> in a Snap
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: "500px", mb: 4 }}>
          Create a Digital Time Capsule with your friends to capture thoughts, photos, and moments together.
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleLogin}
            sx={{
              backgroundColor: "white",
              color: "#3b0764",
              fontSize: "1rem",
              fontWeight: "bold",
              px: 4,
              py: 1.5,
              borderRadius: "12px",
            }}
          >
            Sign in with Google
          </Button>
        </Box>
      </Box>

      {/* Right section: Image placeholder */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Box
          sx={{
            width: "90%",
            height: "80%",
            backgroundImage: `url(${loginPic})`, // Replace with actual image path
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        
      </Box>
    </Box>
  );
};

export default Login;
