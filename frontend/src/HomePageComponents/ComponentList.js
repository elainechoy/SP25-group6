import React from 'react';
import CapsuleCard from './CapsuleCard.js'
import { Container, Box, Button } from "@mui/material";
import { Link } from 'react-router-dom';

function ComponentList() {
    return(
        <Container maxWidth="lg" sx={{ padding: 4, minHeight: "80vh", position: "relative", mt: 3 }}>
            {/* Top-right button */}
            <Box 
                sx={{ 
                    position: "absolute", 
                    top: 16, 
                    right: 16, 
                    display: "flex", 
                    gap: 2 
                }}
            >
                <Link to="/create-capsule" style={{ textDecoration: 'none' }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#fbf2ff',
                            color: '#702b9d',
                            paddingX: 3,
                            paddingY: 1.5,
                            borderRadius: '20px',
                            boxShadow: 2,
                            textTransform: 'none',
                            fontSize: 18,
                        }}
                    >
                        Create a Capsule
                    </Button>
                </Link>
                
            </Box>
            {/* Grid Layout for Capsules */}
            <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr));", // 3 columns
                gap: 4, // spacing between boxes
                justifyContent: "center",
                alignItems: "center",
                marginTop: 6,
            }}
            >
            {/* Individual Capsule Boxes */}
            <CapsuleCard />

            </Box>
        </Container>
    )
}

export default ComponentList;