import React from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
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
        height: "145px", // Only show a small top portion
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
          size="small"
          onClick={onClose}
          sx={{ position: "absolute", top: 4, right: 8, zIndex: 10 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography
            variant="body1"
            sx={{
                fontFamily: "serif",
                textAlign: "center",
                display: "-webkit-box",
                WebkitLineClamp: 1, // 👈 Limit to 2 lines
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                mt: 1,
                mx: 2,
                px: 2,
                // border: "1px solid black",
                color: "black"
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
                mx: 1,
                mb: 1,
                // border: "1px solid black",
                display: "-webkit-box",
                WebkitLineClamp: 3, // 👈 Limit to 3 lines
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                color: "black"
            }}
            >
            {previewText}
        </Typography>
        <Box sx={{ textAlign: "center", pb: 1 }}>
        <Button
          variant="contained"
          size="small"
          // onClick={onReadMore} open the pdf preview
          sx={{
            backgroundColor: "#333",
            color: "#fff",
            textTransform: "none",
            fontFamily: "serif",
            "&:hover": {
              backgroundColor: "#555",
            },
          }}
        >
          Read More
        </Button>
      </Box>
    </Box>
  );
};

PDFPreviewOverlay.propTypes = {
    pdfTitle: PropTypes.string,
  previewText: PropTypes.string,
  onClose: PropTypes.func
};

export default PDFPreviewOverlay;
