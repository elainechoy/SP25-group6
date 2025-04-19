import React, { useEffect, useState, useContext } from 'react';
import AppHeader from '../HomePageComponents/AppHeader';
import { Box, Button, Card, Avatar } from '@mui/material';
import LetterCard from './LetterCard.js';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import UserContext from '../UserContext.js';
import PhotoCard from './PhotoCard.js';
import PDFOverlay from '../PDFOverlay.js';
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

    // turn members (emails) to usernames to show in the capsule
    const [membersInfo, setMembersInfo] = useState([]);
    useEffect(() => {
      const fetchMemberInfo = async () => {
        if (!capsule || !capsule.members) return; // 👈 prevent error
        const memberInfoPromises = capsule.members.map(async (email) => {
          try {
            const response = await fetch(`http://localhost:5001/api/retrieve_user_by_email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email })
            });
  
            if (!response.ok) {
              throw new Error(`Failed to fetch data for ${email}`);
            }
  
            const user = await response.json();
            return { email, username: user.username, photo: `http://localhost:5001/api/profile-image/${user.profileImageId}` };
          } catch (error) {
            console.error('Error fetching member info:', error);
            return { email, username: email };  // Fallback to email if user is not found
          }
        });
  
        const members = await Promise.all(memberInfoPromises);
        setMembersInfo(members);
      };
  
      fetchMemberInfo();
    }, [capsule]);

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
            <Box sx={{ display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #702b9d 0%, #a874d6 40%, #b991db 60%, #702b9d 100%)', color: 'white', minHeight: '100vh' }}>

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
                            // backgroundColor: '#702b9d',
                            width: '20%'
                        }}>

                            {/* Description */}
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Description
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {capsule.description || "No description available."}
                            </Typography>

                            {/* Shared with */}
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Shared With:
                            </Typography>
                            {/* {capsule.members && capsule.members.length > 0 ? (
                                // <Box component="ul" sx={{ pl: 2 }}>
                                //     {capsule.members.map((member, index) => (
                                //         <Typography component="li" key={index} sx={{ fontSize: '14px' }}>
                                //             {member}
                                //         </Typography>
                                //     ))}
                                // </Box>
                                <Box component="ul" sx={{ pl: 2 }}>
                                    {membersInfo.map((member, index) => (
                                        <Typography component="li" key={index} sx={{ fontSize: '14px' }}>
                                        {member.username}
                                        </Typography>
                                    ))}
                                </Box>
                            ) : (
                                <Typography variant="body2" sx={{ color: 'gray' }}>
                                    No members listed.
                                </Typography>
                            )} */}
                            {capsule.members && capsule.members.length > 0 ? (
                            <Box display="flex" flexDirection="column" gap={2}>
                                {membersInfo.map((member, index) => (
                                <Card
                                    key={index}
                                    elevation={2}
                                    sx={{
                                    borderRadius: 3,
                                    padding: 2,
                                    backgroundColor: '#753b9c',
                                    color: 'white',
                                    }}
                                >
                                    <Box display="flex" alignItems="center" gap={1.5}>
                                    <Avatar
                                        alt={member.username}
                                        src={member.photo}
                                        sx={{
                                        width: 60,
                                        height: 60,
                                        fontSize: 24,
                                        bgcolor: 'white',
                                        color: '#702b9d',
                                        }}
                                    >
                                        {member.username ? member.username[0] : "?"}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: 15 }}>
                                        {member.username}
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontSize: 12, color: '#e0d6ec' }}>
                                        {member.email}
                                        </Typography>
                                    </Box>
                                    </Box>
                                </Card>
                                ))}
                            </Box>
                            ) : (
                            <Typography variant="body1" sx={{ color: 'gray' }}>
                                No members listed.
                            </Typography>
                            )}

                            {/* Youtube video or song section */}
                            <Box
                            sx={{
                                width: '100%',
                                mt: 3,
                            }}
                            >
                            {!videoLink ? (
                            <Typography variant="body1" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
                                Missing a vibe? <br/ > Add a song to set the mood 🎵
                            </Typography>
                            ) : (
                            <>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, pb: 0.5 }}>
                                Your vibe is set:
                                </Typography>
                                <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                                <ReactPlayer url={videoLink} controls width="100%" height="250px" />
                                </Box>
                            </>
                            )}

                            {!showInput && (
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Button
                                variant="outlined"
                                sx={{
                                    color: 'white',
                                    borderColor: 'white',
                                    borderRadius: '20px',
                                    px: 3,
                                    py: 1,
                                    fontSize: 18,
                                    fontWeight: 'bold', 
                                    textTransform: 'none',
                                    mb: 2,
                                    '&:hover': {
                                    borderColor: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    },
                                }}
                                onClick={() => setShowInput(true)}
                                >
                                {videoLink ? 'Change a song' : 'Add a song'}
                                </Button>
                                </Box>
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
                                    updateVideoLink();
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
                                    marginBottom: "16px",
                                    backgroundColor: 'transparent',
                                    color: 'white'
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
                                    variant="body1"
                                    sx={{ textAlign: 'center', mb: 3, color: 'white' }}
                                >
                                    Oops, it’s empty...
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
                                    variant="outlined"
                                    sx={{
                                        color: 'white',
                                        borderColor: 'white',
                                        borderRadius: '20px',
                                        px: 3,
                                        py: 1,
                                        fontSize: 18,
                                        fontWeight: 'bold', 
                                        textTransform: 'none',
                                        mb: 2,
                                        '&:hover': {
                                        borderColor: 'white',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        },
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
                                <Typography variant="body1" sx={{ color: 'white', mb: 3 }}>
                                    Add a picture to start filling the space!
                                </Typography>
                            )}

                            <Link to="/upload-photo" state={{ capsuleId }} style={{ textDecoration: 'none' }}>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        color: 'white',
                                        borderColor: 'white',
                                        borderRadius: '20px',
                                        px: 3,
                                        py: 1,
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        mb: 2,
                                        '&:hover': {
                                        borderColor: 'white',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        },
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
            </Box>
        </>
    );
}