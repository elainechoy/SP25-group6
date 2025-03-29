import React, { useEffect, useState } from 'react';
import AppHeader from '../HomePageComponents/AppHeader';
import { Box, Button } from '@mui/material';
import LetterCard from './LetterCard.js';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';

export default function EditCapsule() {
    const navigate = useNavigate()
    const location = useLocation();
    const capsuleId = location.state?.capsuleId;

    // get capsule info
    const [capsule, setCapsule] = useState("");

    useEffect(() => {
        if (capsuleId) {
            const getCapsule = async () => {
                try {
                    const response = await fetch(`http://localhost:5001/api/get_capsule/${capsuleId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    });
            
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setCapsule(data);
            
                } catch (error) {
                    console.error("Error fetching capsules:", error);
                }
            };  
            getCapsule();
        }
    }, [capsuleId]);


    // get PDFs in the capsule
    const [pdfs, setPdfs] = useState([]);

    useEffect(() => {
        if (capsuleId) {
            const fetchUserPDFs = async () => {
                const token = localStorage.getItem("authToken");
    
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
        }
    }, [capsuleId]);
    
  
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
        <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#702b9d', color: 'white' , minHeight: '100vh' }}>

            <AppHeader />
    
            <Box sx={{ gap: 3, m: 4 }}>

                {/* Capsule Name and Seal Capsule Button */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {capsule.title || "Capsule Name"}
                    </Typography>
                    <Button 
                        sx={{
                            backgroundColor: '#fbf2ff',
                            color: '#702b9d',
                            paddingX: 3,
                            paddingY: 1.5,
                            borderRadius: 5,
                            boxShadow: 2,
                            textTransform: 'none',
                            fontSize: 18,
                        }}
                        onClick={sealCapsule}
                    >
                        Seal Capsule
                    </Button>
                </Box>

                {/* Main Content Area */}
                <Box sx={{ display: 'flex', gap: 3 }}>
                    {/* Capsule Details */}
                    <Box 
                        component="section" 
                        sx={{ 
                            p: 3, 
                            borderRadius: 3, 
                            backgroundColor: '#702b9d', 
                            color: 'white', 
                            width: '20%' 
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Description
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {capsule.description || "No description available."}
                        </Typography>

                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Shared With:
                        </Typography>
                        {capsule.members && capsule.members.length > 0 ? (
                            <Box component="ul" sx={{ pl: 2 }}>
                                {capsule.members.map((member, index) => (
                                    <Typography component="li" key={index} sx={{ fontSize: '14px' }}>
                                        {member}
                                    </Typography>
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body2" sx={{ color: 'gray' }}>
                                No members listed.
                            </Typography>
                        )}
                    </Box>

                    {/* Letters Section */}
                    <Box 
                        component="section" 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            p: 3, 
                            borderRadius: 3, 
                            backgroundColor: '#702b9d', 
                            color: 'white', 
                            width: '40%' 
                        }}
                    >
                        {pdfs.map((pdf) => (
                            <LetterCard key={pdf._id} pdfUser={ pdf.metadata.userName } pdfId={pdf._id.toString()} pdfTitle={pdf.metadata.title} />
                        ))}

                        <Link to={`/letter/${capsuleId}`} style={{ textDecoration: 'none' }}>
                            <Button 
                                variant="contained"
                                sx={{
                                    backgroundColor: '#fbf2ff',
                                    color: '#702b9d',
                                    paddingX: 3,
                                    paddingY: 1.5,
                                    borderRadius: 5,
                                    boxShadow: 2,
                                    textTransform: 'none',
                                    fontSize: 18,
                                }}
                            >
                                Write a Letter
                            </Button>
                        </Link>
                    </Box>

                    {/* Images Section */}
                    <Box 
                        component="section" 
                        sx={{ 
                            p: 3, 
                            borderRadius: 3, 
                            backgroundColor: '#702b9d', 
                            color: 'white', 
                            width: '40%' 
                        }}
                    >
                        <Typography variant="body2" sx={{ color: 'gray' }}>
                            This box is for displaying images
                        </Typography>
                    </Box>
                </Box>
            </Box>

        </Box>            
    </>
  );
}