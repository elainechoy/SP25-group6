import React, { useContext, useState, useEffect } from 'react';
import UserContext from './UserContext.js';
import AppHeader from './HomePageComponents/AppHeader.js';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PersonIcon from '@mui/icons-material/Person';
import { API_URL } from './config.js'

function Profile() {
  const { user, setUser } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Preview the uploaded image
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      // TODO: Upload to server here using fetch or axios
      handleUpload(file);
    }
};
  const handleUpload = async (file) => {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const response = await fetch(`${API_URL}/api/upload-profile-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert('Upload successful!');
        setUser({ ...user, profileImageId: data.fileId });

      } else {
        alert('Upload failed.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading image.');
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      if (user?.profileImageId) {
        setProfileImage(`${API_URL}/api/profile-image/${user.profileImageId}`);
      }
    };
    fetchImage();
  }, [user.profileImageId]);

  if (!user) {
    return <Typography textAlign="center" mt={10}>No user data available</Typography>;
  }

  return (
    <>
      <AppHeader user={user} />
      <Box
        sx={{
          mt: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: 2,
        }}
      >
        <Avatar
          src={profileImage}
          alt={user.name}
          sx={{
            width: 120,
            height: 120,
            mb: 2,
            border: '3px solid #702b9d',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        >
          <PersonIcon sx={{ fontSize: 60 }} />
        </Avatar>

        <Typography variant="h4" sx={{ color: '#702b9d', fontWeight: 600 }} gutterBottom>
          Welcome, {user.name}!
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          {user.email}
        </Typography>

        <Stack direction="column" spacing={2} alignItems="center" mt={4}>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{
              backgroundColor: "#702b9d",
              color: "white",
              textTransform: "none",
              borderRadius: "20px",
              px: 3,
              py: 1,
              fontSize: "1rem",
              '&:hover': {
                backgroundColor: "#5a2180",
              }
            }}
          >
            Upload Profile Picture
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
        </Stack>
      </Box>
    </>
  );
}

export default Profile;

