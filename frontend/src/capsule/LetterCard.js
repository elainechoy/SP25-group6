import React from "react";
import { Box, Typography, IconButton, ButtonBase } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from 'prop-types';

function LetterCard( {pdfUser, pdfId, pdfTitle} ) {
    const handleDownload = async () => {
        try {
            // Fetch the PDF from backend
            const response = await fetch(`http://localhost:5001/api/download-pdf/${pdfId}`);
            
            if (!response.ok) {
                throw new Error("Failed to download PDF");
            }

            // Convert response to a Blob
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Create a temporary download link
            const a = document.createElement("a");
            a.href = url;
            console.log("pdf title: " + pdfTitle);
            a.download = `${pdfTitle || "document"}.pdf`;
            document.body.appendChild(a);
            a.click();

            // Clean up
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading PDF:", error);
        }
    };
    return(
        <>
            <ButtonBase onClick={handleDownload} sx={{ width: "100%" }}>
                <Box
                sx={{
                    width: "80%",
                    height: 180,
                    position: "relative",
                    backgroundColor: "#FFDCDC", // Light pink base
                    borderRadius: "10px",
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    mt: 2,
                    mb: 2
                }}
                >
                {/* Top Triangle (Envelope Flap) */}
                <Box
                    sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "50%",
                    backgroundColor: "#FFB6C1", // Darker pink flap
                    clipPath: "polygon(0 0, 100% 0, 50% 90%)", // Creates the triangular flap
                    }}
                />

                {/* Sender Text */}
                <Typography
                    variant="h6"
                    sx={{ fontFamily: "Handwriting, cursive", position: "relative", zIndex: 2 }}
                >
                    by <span style={{ color: "red" }}>❤️ { pdfUser || "Loading..." }</span>
                </Typography>

                {/* Envelope Lines */}
                <Box
                    sx={{
                    position: "absolute",
                    bottom: 20,
                    width: "60%",
                    height: "3px",
                    backgroundColor: "white",
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                    }}
                />
                <Box
                    sx={{
                    position: "absolute",
                    bottom: 30,
                    width: "50%",
                    height: "3px",
                    backgroundColor: "white",
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                    }}
                />

                {/* Close Button (Optional) */}
                <IconButton
                    sx={{
                    position: "absolute",
                    bottom: 5,
                    right: 5,
                    color: "black",
                    backgroundColor: "rgba(255,255,255,0.7)",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
                </Box>
            </ButtonBase>
        </>
    )
}

LetterCard.propTypes = {
    pdfUser: PropTypes.string, // pdfUser should be a string
    pdfId: PropTypes.string.isRequired,
    pdfTitle: PropTypes.string
};

export default LetterCard;
