import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

function LetterCard({ pdfUser, pdfId, pdfTitle, onDelete, onOpenFullPdf }) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewText, setPreviewText] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);

  // Fetch preview text when component mounts
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/pdf/${pdfId}/preview`);
        const data = await response.json();
        setPreviewText(data.previewText || "No preview available.");
      } catch (err) {
        console.error("Error fetching preview text:", err);
        setPreviewText("Failed to load preview.");
      }
    };

    fetchPreview();
    setPdfUrl(`http://localhost:5001/api/pdf/${pdfId}`);
  }, [pdfId]);

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this letter?");
    if (!confirm) return;
  
    try {
      const res = await fetch(`http://localhost:5001/api/delete-pdf/${pdfId}`, {
        method: 'DELETE',
      });
  
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
  
      console.log("Deleted successfully!");
      if (onDelete) onDelete(); // 👈 call parent callback to update state
  
    } catch (err) {
      console.error("Delete error:", err.message);
      alert("Failed to delete PDF.");
    }
  };

  return (
    <>
      <Box
        onClick={() => setShowPreview(!showPreview)}
        sx={{
          width: "80%",
          height: showPreview ? "auto" : 210,
          position: "relative",
          backgroundColor: "#FFDCDC",
          borderRadius: "10px",
          boxShadow: "0px 0px 50px 20px rgb(255, 255, 255, 0.18)",
          transition: "height 0.5s ease, transform 0.3s ease",
          overflow: "hidden",
          mt: 2,
          mb: 3,
          cursor: "pointer",
          "&:hover": !showPreview && {
            transform: "scale(1.02)",
            boxShadow: "0px 0px 60px 25px rgba(255, 255, 255, 0.2)",
          },
        }}
      >
        {/* Envelope Flap */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "50%",
            backgroundColor: "#FFB6C1",
            clipPath: showPreview
              ? "polygon(0 0, 100% 0, 100% 0, 0% 0)"
              : "polygon(0 0, 100% 0, 50% 90%)",
            transition: "clip-path 0.5s ease",
            zIndex: 0
          }}
        />
        
        {/* Delete button */}
        {onDelete && !showPreview && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
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
        )}
        
        {/* Show preview text when clicked */}
        {showPreview ? (
          <Box sx={{ position: "relative", zIndex: 1, padding: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "black" }}>
              {pdfTitle || "Letter Title"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: "black" }}>
              {previewText}
            </Typography>
            <Button
              onClick={() => onOpenFullPdf(pdfUrl)}
              sx={{
                backgroundColor: "#FFB6C1",
                color: "#fff",
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: "20px",
                padding: "8px 20px",
                "&:hover": {
                  backgroundColor: "#FF8C94",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              Read More
            </Button>
          </Box>
        ) : (
          <>
            {/* Sender text */}
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Handwriting, cursive",
                color: "red",
                position: "relative",
                zIndex: 1,
                mt: 11,
                textAlign: "center",
              }}
            >
              A letter by <span style={{ color: "red" }}> 💫 {pdfUser || "Loading..."} </span>
            </Typography>

            {/* Decoration lines */}
            <Box sx={{ position: "absolute", bottom: 20, width: "60%", height: "3px", backgroundColor: "white", zIndex: 0 }} />
            <Box sx={{ position: "absolute", bottom: 30, width: "50%", height: "3px", backgroundColor: "white", zIndex: 0 }} />
          </>
        )}
      </Box>
    </>
  );
}

LetterCard.propTypes = {
  pdfUser: PropTypes.string,
  pdfId: PropTypes.string.isRequired,
  pdfTitle: PropTypes.string,
  onDelete: PropTypes.func,
  onOpenFullPdf: PropTypes.func
};

export default LetterCard;