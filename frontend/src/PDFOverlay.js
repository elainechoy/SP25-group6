import React from "react";
// import { Document, Page } from "react-pdf";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from 'prop-types';
// import { pdfjs } from "react-pdf";
// import workerSrc from "pdfjs-dist/build/pdf.worker.entry";

// pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

// Configure worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


const PDFOverlay = ({ pdfUrl, onClose }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "80%",
          height: "90%",
          backgroundColor: "#fdf6e3", // Light paper-like color
          boxShadow: 10,
          borderRadius: "8px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
        >
          <CloseIcon />
        </IconButton>

        <iframe
          src={pdfUrl}
          width="100%"
          height="100%"
          title="Letter PDF"
          style={{ border: "none" }}
        />
      </Box>
    </Box>
  );
};
PDFOverlay.propTypes = {
  pdfUrl: PropTypes.string,
  onClose: PropTypes.func
};

export default PDFOverlay;
