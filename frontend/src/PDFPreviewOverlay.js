import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

const PDFPreviewOverlay = ({ pdfTitle, previewText, onClose }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "10%", // Starts just under the envelope flap
        left: "10%",
        width: "80%",
        height: "120px", // Only show a small top portion
        backgroundColor: "#fdfaf6",
        borderRadius: "6px",
        boxShadow: 2,
        overflow: "hidden",
        zIndex: 2,
        transform: "translateY(-10px)",
        transition: "all 0.3s ease-in-out",
      }}
    >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography
            variant="body1"
            sx={{
                fontFamily: "serif",
                textAlign: "center",
                display: "-webkit-box",
                WebkitLineClamp: 2, // 👈 Limit to 2 lines
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                mt: 1,
                px: 2
            }}
            >
            <b>{pdfTitle}</b>
        </Typography>
        <Typography
            variant="body2"
            sx={{
                fontFamily: "serif",
                whiteSpace: "pre-wrap",
                textAlign: "center",
                mt: 1.5
            }}
            >
            {previewText}
        </Typography>
    </Box>
  );
};

PDFPreviewOverlay.propTypes = {
    pdfTitle: PropTypes.string,
  previewText: PropTypes.string,
  onClose: PropTypes.func
};

export default PDFPreviewOverlay;
