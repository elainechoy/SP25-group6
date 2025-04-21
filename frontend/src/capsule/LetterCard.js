import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Fade } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import PDFPreviewOverlay from "../PDFPreviewOverlay";
import { API_URL } from '../config.js'

function LetterCard({ pdfUser, pdfId, pdfTitle, envelopeColor, flapColor, onDelete, onOpenFullPdf }) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [previewText, setPreviewText] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);

  // Fetch preview text when component mounts
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const response = await fetch(`${API_URL}/api/pdf/${pdfId}/preview`);
        const data = await response.json();
        setPreviewText(data.previewText || "No preview available.");
      } catch (err) {
        console.error("Error fetching preview text:", err);
        setPreviewText("Failed to load preview.");
      }
    };

    fetchPreview();
    setPdfUrl(`${API_URL}/api/pdf/${pdfId}`);
  }, [pdfId]);

  const handleShowFullPDF = () => {
    // then show your preview overlay
    setShowOverlay(true);
  };
  const handleCloseOverlay = () => setShowOverlay(false);

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this letter?");
    if (!confirm) return;

    try {
      const res = await fetch(`${API_URL}/api/delete-pdf/${pdfId}`, {
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
  }

  return (
    <>
      <Box
        onClick={!showOverlay ? handleShowFullPDF : undefined}
        sx={{
          width: "80%",
          height: 210,
          position: "relative",
          backgroundColor: envelopeColor,
          borderRadius: "10px",
          boxShadow: "0px 0px 50px 20px rgb(255, 255, 255, 0.18)",
          transition: "height 0.5s ease",
          overflow: "hidden",
          mt: 2,
          mb: 3,
          cursor: showOverlay ? "default" : "pointer",
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
            backgroundColor: flapColor,
            clipPath: showOverlay
              ? "polygon(0 0, 100% 0, 100% 0, 0% 0)"
              : "polygon(0 0, 100% 0, 50% 90%)",
            transition: "clip-path 0.5s ease",
            zIndex: 0
          }}
        />
        {/* Preview text shows only after open */}
        <Fade in={showOverlay} timeout={500} unmountOnExit>
          <Box> {/* This gives Fade a real DOM node to animate */}
            <PDFPreviewOverlay
              pdfTitle={pdfTitle}
              previewText={previewText}
              onClose={handleCloseOverlay}
              pdfUrl={pdfUrl}
              onOpenFullPdf={onOpenFullPdf}
            />
          </Box>
        </Fade>

        {/* Sender */}
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Handwriting, cursive",
            color: "red",
            position: "relative",
            zIndex: 1,
            mt: 11,
            textAlign: "center",
            display: showOverlay ? "none" : "block"
          }}
        >

          A letter by <span style={{ color: "red" }}> 💫 {pdfUser || "Loading..."} </span>

        </Typography>

        {/* Decoration lines */}
        <Box sx={{ position: "absolute", bottom: 20, width: "60%", height: "3px", backgroundColor: "white", zIndex: 0 }} />
        <Box sx={{ position: "absolute", bottom: 30, width: "50%", height: "3px", backgroundColor: "white", zIndex: 0 }} />

        {/* Close button (not for the overlay) */}
        {onDelete && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              // Optional: add a delete handler here
              handleDelete()
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
        {/* PDF Overlay */}
      </Box>
    </>
  );
}

LetterCard.propTypes = {
  pdfUser: PropTypes.string,
  pdfId: PropTypes.string.isRequired,
  pdfTitle: PropTypes.string,
  envelopeColor: PropTypes.string,
  flapColor: PropTypes.string,
  onDelete: PropTypes.func,
  onOpenFullPdf: PropTypes.func,
};

export default LetterCard;
