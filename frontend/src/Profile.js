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

function Profile() {
    const { user } = useContext(UserContext);
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
        console.log("handle upload reached");
        if (!file) {
            console.log("no selected file :((((((((((((((((((((((((((((((((((((((((((((((((((((((((((ABABBABHAHAHAHH");
            return;
        }
    
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('profileImage', file); 
    
        try {
          const response = await fetch('http://localhost:5001/api/upload-profile-image', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });
    
          if (response.ok) {
            // const data = await response.json();
            alert('Upload successful!');
            // optionally trigger a refresh or fetch the file from GridFS
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
            setProfileImage(`http://localhost:5001/api/profile-image/${user.profileImageId}`);
          }
        };
    
        fetchImage();
      }, [user]);

    if (!user) {
        return <div>No user data available</div>;
    } else {
        return (
            <>
                <AppHeader user={user} />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mt: 5,
                    }}
                    >
                    <Typography variant="h4" gutterBottom>
                        Welcome, {user.name}!
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Email: {user.email}
                    </Typography>

                    <Stack direction="column" spacing={2} alignItems="center" mt={3}>
                        <Avatar
                        src={profileImage}
                        alt={user.name}
                        sx={{ width: 120, height: 120 }}
                        />
                        <Button
                        variant="contained"
                        component="label"
                        sx={{ textTransform: 'none' }}
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
        )
    }
    
}

export default Profile;
