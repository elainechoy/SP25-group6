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
import LocationPicker from '../MapsComponents/LocationPicker'
import { lighten } from 'polished';
import { API_URL } from '../config.js';
//import { styled } from '@mui/material/styles';
import ColorSwatch from '../ColorSwatch';
// import e from 'cors';

export default function EditCapsule() {
    const navigate = useNavigate()
    const location = useLocation();
    const capsuleId = location.state?.capsuleId;
    const { user } = useContext(UserContext);
    const [images, setImages] = useState([]);
    const [activePdf, setActivePdf] = useState(null);
    const [videoLink, setVideoLink] = useState(null);
    const [showInput, setShowInput] = useState(false);
    const [mapLoc, setMapLoc] = useState(null);
    const [showMapUI, setShowMapUI] = useState(false);

    // get capsule info
    const [capsule, setCapsule] = useState("");
    useEffect(() => {
        if (capsuleId) {
            const getCapsule = async () => {
                try {
                    const response = await fetch(`${API_URL}/api/get_capsule/${capsuleId}`, {
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

                    // unpack the GeoJSON coords into {lat,lng}
                    const coords = data.location?.coordinates;
                    const locationName = data.location?.name;
                    if (Array.isArray(coords) && coords.length === 2) {
                        const [lat, lng] = coords;
                        setMapLoc({ name: locationName, lat, lng });
                    }
                } catch (error) {
                    console.error("Error fetching capsules:", error);
                }
            };
            getCapsule();
        }
    }, [capsuleId, mapLoc]);

    // turn members (emails) to usernames to show in the capsule
    const [membersInfo, setMembersInfo] = useState([]);
    useEffect(() => {
        const fetchMemberInfo = async () => {
            if (!capsule || !capsule.members) return; // 👈 prevent error
            const memberInfoPromises = capsule.members.map(async (email) => {
                try {
                    const response = await fetch(`${API_URL}/api/retrieve_user_by_email`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to fetch data for ${email}`);
                    }

                    const user = await response.json();
                    return { email, username: user.username, photo: `${API_URL}/api/profile-image/${user.profileImageId}` };
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
                    const response = await fetch(`${API_URL}/api/get-pdfs-by-capsule/${capsuleId}`, {
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

    const handleDeletePdf = (pdfIdToDelete) => {
        setPdfs(prev => prev.filter(pdf => pdf._id !== pdfIdToDelete));
    };

    // Get photos in the capsule
    useEffect(() => {
        if (capsuleId) {
            const fetchPhotos = async () => {
                try {
                    const response = await fetch(`${API_URL}/api/get-photos-by-capsule/${capsuleId}`);
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

    const handleDeleteImage = (imageIdToDelete) => {
        // Simply remove the deleted image from the local state
        setImages(prevImages => prevImages.filter((img) => img._id !== imageIdToDelete));
    };

    // Upload video link
    const updateVideoLink = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${API_URL}/api/update-video-link`, {
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
            const response = await fetch(`${API_URL}/api/seal_capsule`, {
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


    // for customizing background color
    const [bgColor, setBgColor] = useState('#a134ea');
    const [light, setLight] = useState(lighten(0.25, '#702b9d'));
    const [dark, setDark] = useState(lighten(0.1, '#702b9d'));

    const generateGradientColors = (color) => {
        return {
            light: lighten(0.25, color),  // Much lighter shade of bgColor
            dark: lighten(0.1, color),    // Lighter shade of bgColor
        };
    };

    useEffect(() => {
        const fetchColor = async () => {
            try {
                const res = await fetch(`${API_URL}/api/get-color/${capsuleId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await res.json();
                if (res.ok && data.color) {
                    setBgColor(data.color);
                    const { light, dark } = generateGradientColors(data.color);
                    setLight(light);
                    setDark(dark);
                }
            } catch (error) {
                console.error('Failed to fetch capsule color:', error);
            }
        };

        fetchColor();
    }, [capsuleId]);

    const handleColorChange = async (c) => {
        // set current background color
        setBgColor(c)
        const { light, dark } = generateGradientColors(c);
        setLight(light);
        setDark(dark);

        // update color in the capsule
        try {
            await fetch(`${API_URL}/api/set-color/${capsuleId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ color: c }),
            });
        } catch (error) {
            console.error('Error setting capsule color:', error);
        }
    };
            // set location
            const handleLocationSelect = async (loc) => {
                console.log("handle location select reached");
                console.log(loc.lat + ' ' + loc.lng);
                setShowMapUI(false);
        
                // set location parameter to the capsule in the backend
                try {
                    const token = localStorage.getItem("authToken");
                    const response = await fetch(`${API_URL}/api/update-location`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            capsuleId: capsuleId,
                            name: loc.name,
                            latitude: loc.lat,
                            longitude: loc.lng,
                        }),
                    });
        
                    const data = await response.json();
        
                    if (response.ok) {
                        console.log("Location updated!");
                        // unpack the GeoJSON coords into {lat,lng}
                        const coords = data.coordinates;
                        const locationName = data.name;
                        if (Array.isArray(coords) && coords.length === 2) {
                            const [lat, lng] = coords;
                            setMapLoc({ name: locationName, lat, lng });
                        }
                        setShowInput(false); // hide input
                    } else {
                        alert(data.message || "Failed to update location");
                    }
                } catch (error) {
                    console.error("Failed to update location", error);
                    alert("Error updating location");
                }
            };
    
      


    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', background: `linear-gradient(140deg, ${bgColor} 0%, ${dark} 30%, ${light} 70%, ${dark} 100%, ${bgColor} 100%)`, color: 'white', minHeight: '100vh' }}>

                <AppHeader user={user} />

                <Box sx={{ gap: 3, m: 4 }}>

                    {/* Capsule Name and Seal Capsule Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {capsule.title || "Capsule Name"}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

                                <Typography variant="subtitle1" sx={{ color: 'white' }}>
                                    Change background color here:
                                </Typography>
                                <ColorSwatch value={bgColor} onChange={handleColorChange} />
                            </Box>
                        </Typography>

                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: 'white',
                                color: bgColor,
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
                                Description:
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {capsule.description || "No description available."}
                            </Typography>

                            {/* Shared with */}
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Shared With:
                            </Typography>
                            {capsule.members && capsule.members.length > 0 ? (
                                <Box display="flex" flexDirection="column" gap={2}>
                                    {membersInfo.map((member, index) => (
                                        <Card
                                            key={index}
                                            elevation={2}
                                            sx={{
                                                borderRadius: 3,
                                                padding: 2,
                                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                color: bgColor,
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
                                                    <Typography variant="caption" sx={{ fontSize: 12 }}>
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
                                        Missing a vibe? <br /> Add a song to set the mood 🎵
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

                            {/* Location */}
                            <Box
                                sx={{
                                    width: '100%',
                                    mt: 2,
                                }}
                            >
                                {/* Prompt + Add Button */}
                                {!mapLoc && !showMapUI && (
                                    <>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: 'white', mb: 3, textAlign: 'center' }}
                                        >
                                            Tag this capsule with a place!
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <Button
                                                variant="outlined"
                                                onClick={() => setShowMapUI(true)}
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
                                                Add a location
                                            </Button>
                                        </Box>
                                    </>
                                )}

                                {/* Always show Location label when UI is visible OR location is selected */}
                                {(showMapUI || mapLoc) && (
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Location:
                                    </Typography>
                                )}

                                {/* Location Picker UI */}
                                {showMapUI && (
                                    <LocationPicker
                                        onSelect={handleLocationSelect}
                                        toggleUI={() => setShowMapUI(false)}
                                    />
                                )}

                                {/* Display selected location */}
                                {!showMapUI && mapLoc && (
                                    <>
                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <Typography variant="body1" sx={{ mb: 2 }}>
                                                📍 {mapLoc.name}
                                            </Typography>
                                        </Box>
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
                                                onClick={() => setShowMapUI(true)}
                                            >
                                                Change location
                                            </Button>
                                        </Box>
                                    </>
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
                                        envelopeColor={pdf.metadata.envelopeColor || '#FFDCDC'}
                                        flapColor={pdf.metadata.flapColor || '#E393AE'}
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
            </Box >
        </>
    );
}