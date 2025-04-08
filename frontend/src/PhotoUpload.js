import React, { useState, useContext, useCallback } from 'react';
import { Box, Button, TextField, Typography, Input, Paper, CircularProgress, IconButton } from '@mui/material';
import AppHeader from './HomePageComponents/AppHeader.js';
import UserContext from './UserContext.js';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import Cropper from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';

const PhotoUploadForm = () => {
  const location = useLocation();
  const capsuleId = location.state?.capsuleId;
  const { user } = useContext(UserContext);

  const [title, setTitle] = useState('');
  const [photo, setPhoto] = useState(null);
  const [imageSrc, setImageSrc] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('file', file);
    if (!file.type.includes('jpeg') && !file.type.includes('jpg') && !file.type.includes('png')) {
      setMessage('Only JPG and PNG files are allowed.');
      return;
    }

    setPhoto(file);

    // Create a blob URL for preview
    const url = URL.createObjectURL(file);
    console.log('Image src:', url);
    setImageSrc(url);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = (imageSrc, pixelCrop) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');
  
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
  
        canvas.toBlob(blob => {
          if (!blob) {
            return reject(new Error('Canvas is empty'));
          }
          resolve(blob);
        }, 'image/jpeg');
      };
      image.onerror = error => {
        reject(error);
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('User not authenticated');
      return;
    }

    if (!title || !photo) {
      setMessage('Please provide both title and photo.');
      return;
    }

    setUploading(true);

    try {
      // Get the cropped image blob using our helper
      let fileToUpload = photo; // fallback: original file
      if (imageSrc && croppedAreaPixels) {
        const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
        fileToUpload = new File([croppedBlob], photo.name, { type: croppedBlob.type });
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('photo', fileToUpload);
      formData.append('capsuleId', capsuleId);

      const response = await fetch('http://localhost:5001/api/upload-photo', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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
      setImageSrc('');
    } catch (err) {
      console.error('Upload error:', err);
      setMessage('Error uploading photo. Please try again.');
      setUploading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#702b9d', pt: 4 }}>
      <AppHeader user={user} />
      <IconButton
        onClick={() => navigate('/edit-capsule', { state: { capsuleId } })}
        sx={{
          position: 'absolute',
          top: '110px',
          left: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
        }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Upload and Crop a JPG or PNG Photo
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

          {imageSrc && (
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: 300,
                background: '#333',
                mt: 2,
              }}
            >
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </Box>
          )}

          <Button
            variant="contained"
            sx={{
              backgroundColor: '#c95eff',
              '&:hover': { backgroundColor: '#d98eff' },
              borderRadius: '30px',
              mt: 2,
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