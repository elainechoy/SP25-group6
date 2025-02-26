import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function LetterCard() {
    return(
        <>
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
                by <span style={{ color: "red" }}>❤️ USER</span>
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
        </>
    )
}

export default LetterCard;

/* <ButtonBase 
                sx={{ width: "100%", display: "block", textAlign: "center", borderRadius: 3, mt: 2, mb: 2 }}
            >
                <Card 
                    sx={{ 
                        minWidth: 300, 
                        borderRadius: 3, 
                        boxShadow: 3, 
                        padding: 2, 
                        backgroundColor: "#c95eff",
                        transition: "0.3s",
                        "&:hover": { boxShadow: 6, backgroundColor: "#f5f5f5" }
                    }}
                >
                    <CardContent sx={{ textAlign: "center" }}>
                        <Typography sx={{ color: "white", fontSize: 14, fontWeight: "bold"}}>
                            by USER
                        </Typography>
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
                    </CardContent>
                </Card>
            </ButtonBase> */