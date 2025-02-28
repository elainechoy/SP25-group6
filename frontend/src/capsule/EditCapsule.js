import React, { useEffect, useState } from 'react';
import AppHeader from '../HomePageComponents/AppHeader';
import { Box, Button } from '@mui/material';
import LetterCard from './LetterCard.js';
import { useNavigate, useLocation, Link } from 'react-router-dom';


export default function EditCapsule() {
    const navigate = useNavigate()
    const location = useLocation();
    const capsuleId = location.state?.capsuleId;
    
    const [pdfs, setPdfs] = useState([]);

    useEffect(() => {
        const fetchUserPDFs = async () => {
            const token = localStorage.getItem("authToken"); // Retrieve JWT token

            try {
                const response = await fetch(`http://localhost:5001/api/get-pdfs-by-capsule/${capsuleId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setPdfs(data); // Store PDFs in state
                } else {
                    console.error("Error fetching PDFs:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching PDFs:", error);
            }
        };

        fetchUserPDFs();
    }, []); // Runs only on first render

    const sealCapsule = async () => {
        const capsuleData = {capsuleId};

        try {
            const response = await fetch("http://localhost:5001/api/seal_capsule", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(capsuleData),
            });
      
            if (response.ok) {
              alert("Capsule sealed!");
              navigate("/home");
            } else {
              alert("Failed to seal capsule.");
            }
      
          } catch (error) {
            console.error("Error sealing capsule:", error);
            alert("An error occurred. Please try again.");
          }
    };

    return (
    <>
        <AppHeader />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, m: 4 }}>
            {/* Capsule Name and Seal Capsule Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* <TextField 
                    label="Capsule Name" 
                    variant="outlined" 
                    sx={{ width: '30%' }}
                /> */}
                capsule name
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick = {sealCapsule}
                >
                    Seal Capsule
                </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'row'}}>
                <Box component="section" sx={{ p: 2, border: '1px solid black', width: '30%' }}>
                    This box is for friends
                </Box>

                <Box component="section" sx={{ display: 'flex', flexDirection: 'column', p: 2, width: '30%', border: "1px solid black", alignItems: "center", justifyContent: 'center' }}>
                    {pdfs.map((pdf) => (
                        <LetterCard key={pdf._id} pdfUser={ pdf.metadata.userName } pdfId={pdf._id.toString()} pdfTitle={pdf.metadata.title} />
                    ))}

                <Link to={`/letter/${capsuleId}`} style={{ textDecoration: 'none' }}>
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
                </Box>

                <Box component="section" sx={{ p: 2, border: '1px solid black', width: '30%' }}>
                    This box is for displaying images
                </Box>
            </Box>

        </Box>
    </>
  );
}