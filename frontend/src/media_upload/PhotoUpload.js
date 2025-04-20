import React, { useState, useContext } from 'react';
import { Box, Button, TextField, Typography, Input, Paper, CircularProgress, IconButton } from '@mui/material';
import AppHeader from '../HomePageComponents/AppHeader.js';
import UserContext from '../UserContext.js';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const PhotoUploadForm = () => {
  const location = useLocation();
  const capsuleId = location.state?.capsuleId;
  const { user } = useContext(UserContext);

  const [title, setTitle] = useState('');
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    if (!title || !photo) {
      setMessage('Please provide both title and photo.');
      return;
    }

    if (!photo.type.includes('jpeg') && !photo.type.includes('jpg') && !photo.type.includes('png')) {
      setMessage('Only JPG and PNG files are allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('photo', photo);
    formData.append('capsuleId', capsuleId);

    try {
      const response = await fetch("http://localhost:5001/api/upload-photo", {
        method: "POST",
        body: formData
      });

      setUploading(false);

      if (!response.ok) {
        const errorText = await response.text();
        setMessage(errorText || 'Upload failed. Please try again.');
        return;
      }

      alert('Photo uploaded successfully!');
      setTitle('');
      setPhoto(null);

    } catch (err) {
      console.error("Upload error:", err);
      setMessage('Error uploading photo. Please try again.');
      setUploading(false);
    }
  };

  return (
    <>
      <AppHeader user={user} />
      <Box sx={{ minHeight: '100vh', background: "linear-gradient(to bottom right, #7c3aed, rgb(183, 124, 239), #7c3aed)", pt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Back Arrow Button */}
        <IconButton 
          onClick={() => navigate('/edit-capsule', { state: { capsuleId } })}
          sx={{
            position: 'absolute',
            top: '110px', // push it 80px down from top
            left: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.7)' },
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%', mt: 6, borderRadius: '15px' }}>
          <Typography variant="h5" gutterBottom align="center" color="#702b9d">
            Upload a JPG or PNG Photo
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              fullWidth
              label="Photo Title"
              variant="outlined"
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Input
              type="file"
              inputProps={{ accept: '.jpg,.jpeg,.png' }}
              onChange={handleFileChange}
              required
              sx={{ my: 2 }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#702b9d',
                borderRadius: '30px',
                height: '45px',
                mt: 2,
              }}
              type="submit"
              disabled={uploading}
              fullWidth
            >
              {uploading ? <CircularProgress size={24} color="#702b9d" /> : 'Upload Photo'}
            </Button>
          </Box>

          {message && (
            <Typography sx={{ mt: 2, textAlign: 'center' }} color="secondary">
              {message}
            </Typography>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default PhotoUploadForm;
