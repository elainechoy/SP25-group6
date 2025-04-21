import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { API_URL } from '../config.js'

function PhotoCard({ photoId, photoTitle, filename, onDelete }) {
  // Delete logic
  const handleDelete = async (event) => {
    // Prevent the parent box click if you have a click event there
    event.stopPropagation();

    const confirmDelete = window.confirm("Are you sure you want to delete this photo?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/api/delete-photo/${photoId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      console.log("Photo deleted successfully!");
      // Call the parent callback to remove this photo from UI
      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      console.error("Delete error:", err.message);
      alert("Failed to delete photo.");
    }
  };

  return (
    <Box
      sx={{
        alignItems: "center",
        justifyContent: 'flex-start',
        width: "80%",
        position: "relative",
        mt: 1,
        // mb: 1,
        // p: 1
      }}
    >

      {/* Full Image */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
        <img
          src={`${API_URL}/api/photo/${filename}`}
          alt={photoTitle || "Photo"}
          style={{
            maxWidth: "100%",
            borderRadius: "5px",
            boxShadow: "0px 0px 50px 20px rgb(255, 255, 255, 0.2)", // Adjust blur intensity
          }}
        />
      </Box>

      {/* Delete Icon */}
      <IconButton
        onClick={handleDelete}
        sx={{
          position: "absolute",
          top: 5,
          right: 5,
          color: "black",
          backgroundColor: "rgba(255,255,255,0.7)",
          borderRadius: "50%",
          width: "24px",
          height: "24px",
          zIndex: 3,
          "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" }
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {/* Photo Title */}
      <Typography
        sx={{
          textAlign: "center",
          mb: 2,
          color: "white",
          fontSize: "1.2rem",
          // pt: 2,
          pb: 1, 
        }}
      >
        {photoTitle || "Untitled Photo"}
      </Typography>

    </Box>
  );
}

PhotoCard.propTypes = {
  photoId: PropTypes.string.isRequired,  // e.g., the MongoDB _id
  photoTitle: PropTypes.string,          // optional user-provided title
  filename: PropTypes.string.isRequired, // the filename stored on the server
  onDelete: PropTypes.func               // callback to remove from parent UI
};

export default PhotoCard;
