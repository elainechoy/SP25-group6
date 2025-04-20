import React, { useState, useContext, useRef } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Input,
  Paper,
  CircularProgress,
  IconButton
} from '@mui/material';
import AppHeader from './HomePageComponents/AppHeader';
import UserContext from './UserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Cropper from "react-cropper";
//import 'cropperjs/dist/cropper.css';

const PhotoUploadForm = () => {
  const location = useLocation();
  const capsuleId = location.state?.capsuleId;
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [photo, setPhoto] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const cropperRef = useRef(null);

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.match(/jpeg|jpg|png/)) {
      setMessage('Only JPG and PNG files are allowed.');
      return;
    }
    setPhoto(file);
    setMessage('');
    const url = URL.createObjectURL(file);
    setImageSrc(url);
   // setCropBoxWidth(0);
   // setCropBoxHeight(0);
  };



  const handleSubmit = async e => {
    e.preventDefault();
    if (!photo) {
      setMessage('Please select a photo.');
      return;
    }
    setUploading(true);
    try {
      // Get cropped blob
      let blob = null;
      const cropper = cropperRef.current;
      if (cropper) {
        blob = await new Promise(resolve =>
          cropper.getCroppedCanvas().toBlob(resolve, 'image/jpeg')
        );
      }
      const fileToUpload = blob
        ? new File([blob], photo.name, { type: blob.type })
        : photo;

      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('User not authenticated');
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('photo', fileToUpload);
      formData.append('capsuleId', capsuleId);

      const response = await fetch('http://localhost:5001/api/upload-photo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      setUploading(false);
      if (!response.ok) {
        const errorText = await response.text();
        setMessage(errorText || 'Upload failed.');
        return;
      }

      alert('Photo uploaded successfully!');
      navigate('/edit-capsule', { state: { capsuleId } });
    } catch (err) {
      console.error(err);
      setMessage('Error uploading photo.');
      setUploading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#702b9d', pt: 4 }}>
      <AppHeader user={user} />
      <IconButton
        onClick={() => navigate('/edit-capsule', { state: { capsuleId } })}
        sx={{ position: 'absolute', top: '110px', left: '16px', backgroundColor: 'rgba(255,255,255,0.5)' }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Upload and Crop a JPG or PNG Photo
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Photo Title"
            margin="normal"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />

          <Input
            type="file"
            inputProps={{ accept: '.jpg,.jpeg,.png' }}
            onChange={handleFileChange}
            sx={{ my: 2 }}
            required
          />

          {imageSrc && (
            <Cropper
              src={imageSrc}
              style={{ height: 400, width: '100%' }}
              guides={true}
              viewMode={1}
              background={false}
              responsive
              autoCropArea={0.8}
              checkOrientation={false}
              onInitialized={instance => {
                cropperRef.current = instance;
              }}
            />
          )}

          <Button
            variant="contained"
            sx={{
              backgroundColor: '#c95eff',
              '&:hover': { backgroundColor: '#d98eff' },
              borderRadius: '30px',
              mt: 2
            }}
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
  );
};

export default PhotoUploadForm;
