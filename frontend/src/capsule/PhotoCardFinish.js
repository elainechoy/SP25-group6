import React from "react";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { API_URL } from '../config.js'

function PhotoCardFinish({ photoTitle, filename, mode = 'carousel' }) {
  const isCarousel = mode === 'carousel';

  return (
    <Box
      sx={{
        height: isCarousel ? '100%' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: isCarousel ? 'center' : 'flex-start',
        textAlign: 'center',
        px: 2,
        pb: 2,
      }}
    >
      <Box sx={{ mb: 1 }}>
        <img
          src={`${API_URL}/api/photo/${filename}`}
          alt={photoTitle || "Photo"}
          style={{
            maxHeight: isCarousel ? '75%' : 'auto',
            maxWidth: '100%',
            height: isCarousel ? 'auto' : 'auto',
            width: 'auto',
            borderRadius: 5,
            boxShadow: '0px 0px 50px 20px rgba(255,255,255,0.2)',
            objectFit: 'contain',
          }}
        />
      </Box>
      <Typography
        sx={{
          color: 'white',
          fontSize: '1.2rem',
          whiteSpace: isCarousel ? 'normal' : 'nowrap',
          overflow: isCarousel ? 'visible' : 'hidden',
          textOverflow: isCarousel ? 'unset' : 'ellipsis',
        }}
      >
        {photoTitle}
      </Typography>
    </Box>
  );
}


PhotoCardFinish.propTypes = {
//  photoId: PropTypes.string.isRequired,  // If you still need the ID for other logic
  photoTitle: PropTypes.string,
  filename: PropTypes.string.isRequired,
  mode: PropTypes.string
};

export default PhotoCardFinish;
