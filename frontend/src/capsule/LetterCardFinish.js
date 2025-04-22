import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import PropTypes from "prop-types";
import { API_URL } from "../config";

function LetterCardFinish({ pdfUser, pdfId, pdfTitle, envelopeColor, flapColor, onOpenFullPdf }) {
    const [showPreview, setShowPreview] = useState(false);
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

    return (
        <Box
            onClick={() => setShowPreview((prev) => !prev)}
            sx={{
                width: "80%",
                height: showPreview ? "auto" : 210,
                position: "relative",
                backgroundColor: envelopeColor,
                borderRadius: "10px",
                boxShadow: "0px 0px 50px 20px rgba(255,255,255,0.18)",
                transition: "height 0.5s ease, transform 0.3s ease",
                overflow: "hidden",
                mt: 2,
                mb: 3,
                mx: 'auto', 
                cursor: "pointer",
                "&:hover": !showPreview && {
                    transform: "scale(1.02)",
                    boxShadow: "0px 0px 60px 25px rgba(255,255,255,0.2)",
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
                    backgroundColor: flapColor,
                    clipPath: showPreview
                        ? "polygon(0 0, 100% 0, 100% 0, 0% 0)"
                        : "polygon(0 0, 100% 0, 50% 90%)",
                    transition: "clip-path 0.5s ease",
                    zIndex: 0,
                }}
            />

            {showPreview ? (
                <Box sx={{ position: "relative", zIndex: 1, p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "black" }}>
                        {pdfTitle || "Letter Title"}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, color: "black" }}>
                        {previewText}
                    </Typography>
                    <Button
                        onClick={() => onOpenFullPdf(pdfUrl)}
                        sx={{
                            backgroundColor: envelopeColor,
                            color: "#fff",
                            fontWeight: "bold",
                            textTransform: "none",
                            borderRadius: "20px",
                            py: 1,
                            px: 3,
                            "&:hover": {
                                backgroundColor: "#FF8C94",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
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
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 20,
                            width: "60%",
                            height: "3px",
                            backgroundColor: "white",
                            zIndex: 0,
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 30,
                            width: "50%",
                            height: "3px",
                            backgroundColor: "white",
                            zIndex: 0,
                        }}
                    />
                </>
            )}
        </Box>
    );
}

LetterCardFinish.propTypes = {
    pdfUser: PropTypes.string,
    pdfId: PropTypes.string.isRequired,
    pdfTitle: PropTypes.string,
    envelopeColor: PropTypes.string,
    flapColor: PropTypes.string,
    onOpenFullPdf: PropTypes.func.isRequired,
};

export default LetterCardFinish;
