import React from 'react';
import CapsuleCard from './CapsuleCard.js'
import { Container, Box, Button } from "@mui/material";

function ComponentList() {
    return(
        <Container maxWidth="lg" sx={{ border: "2px solid gray", padding: 4, minHeight: "80vh", position: "relative", backgroundColor: "#eabfff", mt: 4 }}>
            {/* Top-right button */}
            <Button sx={{ position: "absolute", top: 16, right: 16, color: 'white', width: 'auto', backgroundColor: '#c95eff', padding: 2 }}>
            Create Capsule
            </Button>
    
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
            <CapsuleCard />
            <CapsuleCard />
            <CapsuleCard />

            </Box>
        </Container>
    )
}

export default ComponentList;