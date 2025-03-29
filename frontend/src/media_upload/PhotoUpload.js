import React, { useState, useContext } from 'react';
import { Box, Button, TextField, Typography, Input, Paper, CircularProgress, IconButton } from '@mui/material';
import AppHeader from '../HomePageComponents/AppHeader.js';
//import { useParams } from 'react-router-dom';
import UserContext from '../UserContext.js';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const PhotoUploadForm = () => {
  const location = useLocation();
  const capsuleId = location.state?.capsuleId;
  //const { capsuleId } = useParams();
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
    console.log('title:', title);
    console.log('capsuleId:', capsuleId);
    console.log('photo:', photo);

    // await fetch("http://localhost:5001/api/upload-photo", {
    //   method: "POST",
    //   body: formData
    // });
    // setUploading(false);
    try {
      // Send to backend
      const response = await fetch("http://localhost:5001/api/upload-photo", {
        method: "POST",
        body: formData
      });
  
      setUploading(false);
  
      if (!response.ok) {
        // If server responded with an error, parse message if available
        const errorText = await response.text();
        setMessage(errorText || 'Upload failed. Please try again.');
        return;
      }
  
      // If response is OK (status 200)
      // You could do a toast, alert, or just setMessage
      // For example, show a success alert:
      alert('Photo uploaded successfully!');
  
      // Or, set your success message:
      // setMessage('Photo uploaded successfully!');
  
      // Optionally, reset form
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
     
      <Box sx={{ minHeight: '100vh', backgroundColor: '#702b9d', pt: 4 }}>
      <AppHeader user={user} />
      {/* Back Arrow Button */}
      <IconButton 
        onClick={() => navigate('/edit-capsule', { state: { capsuleId } })}
        sx={{
          position: 'absolute',
          top: '110px',      // push it 80px down from top
          left: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
        }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Upload a JPG or PNG Photo
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
            inputProps={{ accept: '.jpg,.jpeg,.png' }}
            onChange={handleFileChange}
            required
            sx={{ my: 2 }}
          />

          <Button
            variant="contained"
            sx={{ backgroundColor: '#c95eff', '&:hover': { backgroundColor: '#d98eff' } , borderRadius: '30px',}}
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
      </Box>
    </>
    
  );
};

export default PhotoUploadForm;