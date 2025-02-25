import React from 'react';
import CapsuleCard from './CapsuleCard.js'
import { Container, Box, Button } from "@mui/material";
import { Link } from 'react-router-dom';

function ComponentList() {
    return(
        <Container maxWidth="lg" sx={{ border: "2px solid gray", padding: 4, minHeight: "80vh", position: "relative", backgroundColor: "#eabfff", mt: 4 }}>
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
                        sx={{ 
                            color: 'white', 
                            width: 'auto', 
                            backgroundColor: '#c95eff', 
                            padding: 2 
                        }}
                    >
                        Create Capsule
                    </Button>
                </Link>
                <Link to="/letter" style={{ textDecoration: 'none' }}>
                    <Button 
                        sx={{ 
                            color: 'white', 
                            width: 'auto', 
                            backgroundColor: '#c95eff', 
                            padding: 2 
                        }}
                    >
                        Write a Letter
                    </Button>
                </Link>
                <Link to="/letter-list" style={{ textDecoration: 'none' }}>
                    <Button 
                        sx={{ 
                            color: 'white', 
                            width: 'auto', 
                            backgroundColor: '#c95eff', 
                            padding: 2 
                        }}
                    >
                        See all Letters
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
                marginTop: 8,
            }}
            >
            {/* Individual Capsule Boxes */}
            <CapsuleCard />

            </Box>
        </Container>
    )
}

export default ComponentList;