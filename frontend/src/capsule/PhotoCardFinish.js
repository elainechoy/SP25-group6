import React from "react";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

function PhotoCardFinish({ photoTitle, filename }) {
  return (
    <Box
      sx={{
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
        mt: 1,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
        <img
          src={`http://localhost:5001/api/photo/${filename}`}
          alt={photoTitle || "Photo"}
          style={{
            maxWidth: "100%",
            objectFit: 'contain',
            borderRadius: "5px",
            boxShadow: "0px 0px 50px 20px rgb(255, 255, 255, 0.2)",
          }}
        />
      </Box>

      <Typography
        sx={{
          textAlign: "center",
          mb: 2,
          color: "white",
          fontSize: "1.2rem",
          pb: 1,
        }}
      >
        {photoTitle || "Untitled Photo"}
      </Typography>
    </Box>
  );
}

PhotoCardFinish.propTypes = {
//  photoId: PropTypes.string.isRequired,  // If you still need the ID for other logic
  photoTitle: PropTypes.string,
  filename: PropTypes.string.isRequired,
};

export default PhotoCardFinish;
