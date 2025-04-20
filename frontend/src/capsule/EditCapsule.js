import React, { useEffect, useState, useContext } from 'react';
import AppHeader from '../HomePageComponents/AppHeader';
import { Box, Button } from '@mui/material';
import LetterCard from './LetterCard.js';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import UserContext from '../UserContext.js';
import PhotoCard from './PhotoCard.js';
import PDFOverlay from '../PDFOverlay.js';
import AddIcon from '@mui/icons-material/Add';
import ReactPlayer from "react-player/youtube";

export default function EditCapsule() {
    const navigate = useNavigate()
    const location = useLocation();
    const capsuleId = location.state?.capsuleId;
    const { user } = useContext(UserContext);
    const [images, setImages] = useState([]);
    const [activePdf, setActivePdf] = useState(null);
    const [videoLink, setVideoLink] = useState(null);
    const [showInput, setShowInput] = useState(false);


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
                    setVideoLink(data.videoLink);

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

    const updateVideoLink = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`http://localhost:5001/api/update-video-link`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ capsuleId: capsuleId, videoLink: videoLink }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Video link updated!");
                setVideoLink(videoLink); // update local state
                setShowInput(false); // hide input
            } else {
                alert(data.message || "Failed to update video");
            }
        } catch (error) {
            console.error("Failed to update video link", error);
            alert("Error updating video");
        }
    }

    useEffect(() => {
        if (!capsuleId) return;
        fetch(`.../get_capsule/${capsuleId}`)
            .then(r => r.json())
            .then(data => {
                setCapsule(data);
                setVideoLink(data.videoLink);
               // setGradientColor(data.gradientColor || '#702b9d');
            });
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
            <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#702b9d', color: 'white', minHeight: '100vh' }}>

                <AppHeader user={user} />

                <Box sx={{ gap: 3, m: 4 }}>


                    {/* Capsule Name and Seal Capsule Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {capsule.title || "Capsule Name"}
                        </Typography>
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
                            width: '20%'
                        }}>
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

                        <Box
                            sx={{
                                // border: "1px solid black",
                                width: '100%',
                                mt: 15,
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant="body2" sx={{ color: 'white', mb: 3 }}>
                                Add a youtube link to a song for this capsule
                            </Typography>
                            {videoLink && (
                                <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                                    <ReactPlayer url={videoLink} controls width="100%" height="250px" />
                                </Box>
                            )}
                            {!showInput && (
                                <AddIcon
                                    sx={{
                                        p: 1,
                                        border: "1px solid white",
                                        borderRadius: "10px",
                                    }}
                                    onClick={() => setShowInput(true)}

                                />
                            )}
                            {showInput && (
                                <input
                                    type="text"
                                    placeholder="Paste YouTube link here"
                                    value={videoLink || ""}
                                    onChange={(e) => setVideoLink(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            setShowInput(false);
                                            updateVideoLink()
                                        }
                                    }}
                                    onBlur={() => {
                                        setShowInput(false);
                                        updateVideoLink();
                                    }}
                                    style={{
                                        padding: "8px",
                                        width: "80%",
                                        maxWidth: "300px",
                                        borderRadius: "8px",
                                        border: "1px solid white",
                                        marginBottom: "16px"
                                    }}
                                />
                            )}

                        </Box>
                    </Box>


                    {/* Letters Section */}
                    <Box
                        component="section"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            // backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                            p: 2,
                            borderRadius: 3,
                            width: '40%',
                        }}>
                        {pdfs.length === 0 ? (
                            <Typography
                                variant="body2"
                                sx={{ textAlign: 'center', mt: 4, fontStyle: 'italic', color: 'gray' }}
                            >
                                No letters found. Start by uploading a PDF.
                            </Typography>
                        ) : (
                            pdfs.map((pdf) => (
                                <LetterCard
                                    key={pdf._id}
                                    pdfUser={pdf.metadata.userName}
                                    pdfId={pdf._id}
                                    pdfTitle={pdf.metadata.title}
                                    onDelete={() => handleDeletePdf(pdf._id)}
                                    onOpenFullPdf={(url) => setActivePdf(url)}
                                />
                            ))
                        )}

                        <Link to={`/letter/${capsuleId}`} style={{ textDecoration: 'none' }}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#fbf2ff',
                                    color: '#702b9d',
                                    mt: 2,
                                    paddingX: 2.5,
                                    paddingY: 1,
                                    borderRadius: '20px',
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
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            p: 3,
                            borderRadius: 3,
                            // backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            width: '40%',
                        }}>
                        {images.length > 0 ? (
                            images.map((img) => (
                                <PhotoCard
                                    key={img._id}
                                    photoId={img._id}
                                    photoTitle={img.title}
                                    filename={img.filename}
                                    onDelete={() => handleDeleteImage(img._id)}
                                />
                            ))
                        ) : (
                            <Typography variant="body2" sx={{ color: 'gray' }}>
                                No images uploaded.
                            </Typography>
                        )}

                        <Link to="/upload-photo" state={{ capsuleId }} style={{ textDecoration: 'none' }}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#fbf2ff',
                                    color: '#702b9d',
                                    mt: 2,
                                    paddingX: 2.5,
                                    paddingY: 1,
                                    borderRadius: '20px',
                                    boxShadow: 2,
                                    textTransform: 'none',
                                    fontSize: 18,
                                }}
                            >
                                Upload a Photo
                            </Button>
                        </Link>
                    </Box>
                </Box>
            </Box>
            {activePdf && (
                <PDFOverlay
                    pdfUrl={activePdf}
                    onClose={() => setActivePdf(null)}
                />
            )}
        </Box >
        </>
    );
}