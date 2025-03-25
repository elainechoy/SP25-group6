import React, { useState, useContext } from 'react';
import { Box, Button, TextField, Typography, Input, Paper, CircularProgress } from '@mui/material';
import AppHeader from '../HomePageComponents/AppHeader.js';
//import { useParams } from 'react-router-dom';
import UserContext from '../UserContext.js';
import { useLocation } from 'react-router-dom';

const PhotoUploadForm = () => {
  const location = useLocation();
  const capsuleId = location.state?.capsuleId;
  //const { capsuleId } = useParams();
  const { user } = useContext(UserContext);

  const [title, setTitle] = useState('');
  const [photo, setPhoto] = useState(null);
 const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    if (!title || !photo) {
      setMessage('Please provide both title and JPG photo.');
      return;
    }

    if (!photo.type.includes('jpeg') && !photo.type.includes('jpg')) {
      setMessage('Only JPG files are allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('photo', photo);
    formData.append('capsuleId', capsuleId);
    console.log('title:', title);
    console.log('capsuleId:', capsuleId);
    console.log('photo:', photo);

    await fetch("http://localhost:5001/api/upload-photo", {
      method: "POST",
      body: formData
    });
    setUploading(false);
  };

  return (
    <>
      <AppHeader user={user} />
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Upload a JPG Photo
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Photo Title"
            variant="outlined"
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            type="file"
            inputProps={{ accept: '.jpg,.jpeg' }}
            onChange={handleFileChange}
            required
            sx={{ my: 2 }}
          />

          <Button
            variant="contained"
            sx={{ backgroundColor: '#c95eff', '&:hover': { backgroundColor: '#d98eff' } }}
            type="submit"
            disabled={uploading}
            fullWidth
          >
            {uploading ? <CircularProgress size={24} /> : 'Upload Photo'}
          </Button>
        </Box>

        {message && (
          <Typography sx={{ mt: 2 }} color="secondary">
            {message}
          </Typography>
        )}
      </Paper>
    </>
  );
};

export default PhotoUploadForm;