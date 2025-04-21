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
            setProfileImage(`http://localhost:5001/api/profile-image/${user.profileImageId}`);
          }
        };
    
        fetchImage();
      }, [user.profileImageId]);

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
                        pt: 5,
                        background: 'linear-gradient(to bottom right, #702b9d, #b991db, #702b9d)',
                        height: '100vh'
                    }}
                    >
                    <Typography variant="h4" sx={{ color: "#702b9d" }} gutterBottom>
                        Welcome, {user.name}!
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: "#702b9d" }} gutterBottom>
                        {user.email}
                    </Typography>

                    <Stack direction="column" spacing={2} alignItems="center" mt={3}>
                        <Avatar
                        src={profileImage}
                        alt={user.name}
                        sx={{ width: 120, height: 120 }}
                        />
                        <Button
                          component="label"
                          sx={{
                            backgroundColor: "#702b9d",
                            color: "white",
                            fontSize: "1rem",
                            fontWeight: "normal",
                            textTransform: "none", // prevents automatic capitalization
                            px: 2,                 // reduced horizontal padding
                            py: 1,                 // reduced vertical padding
                            borderRadius: "20px",
                            paddingTop: "20"
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
        )
    }
    
}

export default Profile;
