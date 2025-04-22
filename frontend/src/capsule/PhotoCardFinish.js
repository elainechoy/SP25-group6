import React from "react";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { API_URL } from '../config.js';

function PhotoCardFinish({ photoTitle, filename, mode = 'carousel' }) {
  const isCarousel = mode === 'carousel';

  return (
    <Box
      sx={{
        flex: 1,
        height: isCarousel ? '100%' : 'auto',    // fill carousel viewport
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        p: 2,
        boxSizing: 'border-box',
      }}
    >
      {/* 1) this wrapper grows/shrinks so title always shows */}
      <Box
        sx={{
          flex: isCarousel ? 1 : 'none',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          mb: 1,
          
        }}
      >
        <Box
          component="img"
          src={`${API_URL}/api/photo/${filename}`}
          alt={photoTitle || "Photo"}
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: 2,
            boxShadow: '0px 0px 50px 20px rgba(255,255,255,0.2)',
          }}
        />
      </Box>

      {/* 2) this title sits at the bottom */}
      <Typography
        variant="h6"
        sx={{
          color: 'white',
          flex: '0 0 auto',   // never shrink
          wordBreak: 'break-word',
        }}
      >
        {photoTitle}
      </Typography>
    </Box>
  );
}

PhotoCardFinish.propTypes = {
  photoTitle: PropTypes.string,
  filename: PropTypes.string.isRequired,
  mode: PropTypes.string,
};

export default PhotoCardFinish;
