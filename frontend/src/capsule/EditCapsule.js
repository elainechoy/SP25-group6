import React, { useEffect, useState, useContext } from 'react';
import AppHeader from '../HomePageComponents/AppHeader';
import { Box, Button } from '@mui/material';
import LetterCard from './LetterCard.js';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import UserContext from '../UserContext.js';
import PhotoCard from './PhotoCard.js';
// import PDFOverlay from '../PDFOverlay.js'; // import this at the top


export default function EditCapsule() {
    const navigate = useNavigate()
    const location = useLocation();
    const capsuleId = location.state?.capsuleId;
    const { user } = useContext(UserContext);
    const [images, setImages] = useState([]);

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

    // Get photos in the capsule
    useEffect(() => {
        if (capsuleId) {
            const fetchPhotos = async () => {
                try {
                    const response = await fetch(`http://localhost:5001/api/get-photos-by-capsule/${capsuleId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setImages(data);
                    } else {
                        console.error("Error fetching images:", response.statusText);
                    }
                } catch (error) {
                    console.error("Error fetching images:", error);
                }
            };
            fetchPhotos();
        }
    }, [capsuleId]);



    const sealCapsule = async () => {
        const capsuleData = { capsuleId };

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
    const handleDeletePdf = (pdfIdToDelete) => {
        setPdfs(prev => prev.filter(pdf => pdf._id !== pdfIdToDelete));
    };

    const handleDeleteImage = (imageIdToDelete) => {
        // Simply remove the deleted image from the local state
        setImages(prevImages => prevImages.filter((img) => img._id !== imageIdToDelete));
      };



    return (
        <>
            <AppHeader user={user} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, m: 4 }}>

                {/* Capsule Name and Seal Capsule Button */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {capsule.title || "Capsule Name"}
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#c95eff',
                            color: 'white',
                            borderRadius: '20px',
                            boxShadow: 2,
                            '&:hover': {
                                backgroundColor: '#b14ce3'
                            }
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
                            boxShadow: 3,
                            backgroundColor: '#ffffff',
                            width: '30%'
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
                            boxShadow: 3,
                            backgroundColor: '#ffffff',
                            width: '30%'
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                            Letters
                        </Typography>
                        {pdfs.map((pdf) => (
                            <LetterCard
                                key={pdf._id}
                                pdfUser={pdf.metadata.userName}
                                pdfId={pdf._id}
                                pdfTitle={pdf.metadata.title}
                                onDelete={() => handleDeletePdf(pdf._id)}
                            />
                        ))}

                        <Link to={`/letter/${capsuleId}`} style={{ textDecoration: 'none' }}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#c95eff',
                                    color: 'white',
                                    mt: 2,
                                    borderRadius: '20px',
                                    boxShadow: 2,
                                    '&:hover': {
                                        backgroundColor: '#b14ce3'
                                    }
                                }}
                            >
                                Write a Letter
                            </Button>
                        </Link>
                    </Box>

                    {/* Images Section */}
                    <Box component="section" sx={{ p: 3, borderRadius: 3, boxShadow: 3, backgroundColor: '#ffffff', width: '30%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Images</Typography>

                        {images.length > 0 ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {images.map((img) => (
                                    <PhotoCard
                                        key={img._id}
                                        photoId={img._id}
                                        photoTitle={img.title}
                                        filename={img.filename}
                                        // Here’s the callback for removing it from the UI
                                        onDelete={() => handleDeleteImage(img._id)}
                                    />
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body2" sx={{ color: 'gray' }}>No images uploaded.</Typography>
                        )}

                        {/* Button to upload a photo */}
                        <Link to="/upload-photo" state={{ capsuleId }} style={{ textDecoration: 'none' }}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#c95eff',
                                    color: 'white',
                                    mt: 2,
                                    borderRadius: '20px',
                                    boxShadow: 2,
                                    '&:hover': { backgroundColor: '#b14ce3' }
                                }}
                            >
                                Upload a Photo
                            </Button>
                        </Link>
                    </Box>
                </Box>
            </Box>






        </>
    );
}