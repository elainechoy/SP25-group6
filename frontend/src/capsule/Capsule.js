import React, { useEffect, useState, useContext, useMemo } from 'react';
import AppHeader from '../HomePageComponents/AppHeader';
import { Box, Typography, ToggleButtonGroup, ToggleButton, Card, Avatar } from '@mui/material';
import LetterCardFinish from './LetterCardFinish';
import { useLocation } from 'react-router-dom';
import UserContext from '../UserContext';
import PhotoCardFinish from './PhotoCardFinish';
import PDFOverlay from '../PDFOverlay';
import paperRip from './assets/paper-rip.mp3';
import './CarouselOverrides.css';
import { API_URL } from '../config.js'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { lighten } from 'polished';
import ReactPlayer from "react-player/youtube";
import {
    GoogleMap,
    MarkerF,
    useLoadScript
  } from '@react-google-maps/api';

const Capsule = () => {
  const location = useLocation();
  const capsuleId = location.state?.capsuleId;
  const { user } = useContext(UserContext);

  // State
  const [capsule, setCapsule] = useState({});
  const [pdfs, setPdfs] = useState([]);
  const [images, setImages] = useState([]);
  const [activePdf, setActivePdf] = useState(null);
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' | 'scroll' | 'grid'
  const [videoLink, setVideoLink] = useState(null);
  const [capsuleLocation, setCapsuleLocation] = useState(null);
  const clickSound = useMemo(() => new Audio(paperRip), []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
  });

  // get capsule info
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

            if(data.location) {
                // unpack the GeoJSON coords into {lat,lng}
                const coords = data.location?.coordinates;
                const locationName = data.location?.name;
                if (Array.isArray(coords) && coords.length === 2) {
                    const [lat, lng] = coords;
                    setCapsuleLocation({ name: locationName, lat, lng });
                }
            }

          } catch (error) {
              console.error("Error fetching capsules:", error);
          }
        };
        getCapsule();
      }
  }, [capsuleId]);

  // // Fetch capsule info
  // useEffect(() => {
  //   if (!capsuleId) return;
  //   fetch(`${API_URL}/api/get_capsule/${capsuleId}`, {
  //     headers: { 'Content-Type': 'application/json' },
  //   })
  //     .then(res => {
  //       if (!res.ok) throw new Error(res.statusText);
  //       return res.json();
  //     })
  //     .then(setCapsule)
  //     .catch(console.error);
  // }, [capsuleId]);

  // Fetch PDFs
  useEffect(() => {
    if (!capsuleId) return;
    const token = localStorage.getItem('authToken');
    fetch(`${API_URL}/api/get-pdfs-by-capsule/${capsuleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(setPdfs)
      .catch(console.error);
  }, [capsuleId]);

  // Fetch images
  useEffect(() => {
    if (!capsuleId) return;
    fetch(`${API_URL}/api/get-photos-by-capsule/${capsuleId}`)
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(setImages)
      .catch(console.error);
  }, [capsuleId]);

  const carouselBreakpoints = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,          // only one image per “page”
      partialVisibilityGutter: 0
    },
    tablet: {
      breakpoint: { max: 1024, min: 640 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 640, min: 0 },
      items: 1,
    },
  };

  const contentWrapper = {
    width: '100%',
    maxWidth: 800,    // pick whatever max makes sense
    mx: 'auto',       // center horizontally
  };

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

  // set background color
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

  // fetch capsule location
//   useEffect(() => {
//     const fetchLocation = async () => {
//       try {
//         const res = await fetch(`${API_URL}/api/get-location`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ capsuleId })
//         });

//         const data = await res.json();

//         if (!res.ok) {
//           return;
//         }

//         // unpack the GeoJSON coords into {lat,lng}
//         const coords = data.coordinates;
//         const locationName = data.name;
//         if (Array.isArray(coords) && coords.length === 2) {
//             const [lat, lng] = coords;
//             setCapsuleLocation({ name: locationName, lat, lng });
//         }
//       } catch (err) {
//         console.error('Fetch error:', err);
//       }
//     };

//       fetchLocation();
//     }, [capsuleId]);

if (loadError) return <Typography>Error loading map</Typography>;
if (!isLoaded) return null;

    
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', background: `linear-gradient(140deg, ${bgColor} 0%, ${dark} 30%, ${light} 70%, ${dark} 100%, ${bgColor} 100%)`, color: 'white', minHeight: '100vh' }}>
      
      <AppHeader user={user} />

      <Box sx={{ gap: 3, m: 4 }}>

        {/* Capsule Name */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {capsule.title || "Capsule Name"} 
            </Typography>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ display: 'flex', gap: 3 }}>

          {/* Capsule Details */}
          <Box
          component="section"
          sx={{
              p: 3,
              borderRadius: 3,
              width: '20%'
          }}>
            {/* Description */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Description
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {capsule.description || 'No description available.'}
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
              {videoLink && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, pb: 0.5 }}>
                    Your vibe is set:
                  </Typography>

                  <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                    <ReactPlayer url={videoLink} controls width="100%" height="250px" />
                  </Box>
                </>
              )}
            </Box>

            {/* Location stuff */}
            <Box
              sx={{
                  width: '100%',
                  mt: 5,
                  textAlign: 'center',
              }}
            >
              {capsuleLocation && (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, pb: 0.5 }}>
                        Location: {capsuleLocation.name}
                    </Typography>
                    <GoogleMap
                    mapContainerStyle={{width: '200px', height: '150px', marginTop: '8px'}}
                    center={{
                        lat: capsuleLocation.lat,
                        lng: capsuleLocation.lng
                    }}
                    zoom={12}
                    options={{ disableDefaultUI: true, gestureHandling: 'none' }}
                    >
                        <MarkerF position={{
                            lat: capsuleLocation.lat,
                            lng: capsuleLocation.lng
                        }} />
                    </GoogleMap>
                </div>
                )}
              
                {/* <Typography variant="body2" sx={{ color: 'white', mb: 3 }}>
                    Add location
                </Typography> */}

                {/* {!showMapUI && !mapLoc && (
                    <AddIcon 
                    sx={{
                        p: 1,
                        border: "1px solid white",
                        borderRadius: "10px",
                    }}
                    onClick={() => setShowMapUI(true)}
                    />
                )} */}

                {/* {showMapUI && (
                    <LocationPicker onSelect={handleLocationSelect} toggleUI={() => setShowMapUI(false)} />
                )} */}

                {/* {!showMapUI && mapLoc && (
                  <Button 
                  sx={{
                      p: 1,
                      border: "1px solid white",
                      borderRadius: "10px",
                      color: 'white'
                  }}
                  onClick={() => setShowMapUI(true)}>
                      {location}
                  </Button>
                )} */}
            </Box>
          </Box>

          {/* Letters */}
          <Box component="section" sx={{
            p: 3,
            borderRadius: 3,
            width: '35%',
            maxHeight: '60vh',  
            overflowY: 'auto',     
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}>
            {pdfs.length === 0 ? (
              <Typography variant="body2" sx={{ textAlign: 'center', mt: 4, color: 'white' }}>
                You wrote no letters in your capsule :(
              </Typography>
            ) : (
              pdfs.map(pdf => (
                <LetterCardFinish
                  key={pdf._id}
                  pdfUser={pdf.metadata.userName}
                  pdfId={pdf._id}
                  pdfTitle={pdf.metadata.title}
                  envelopeColor={pdf.metadata.envelopeColor || '#FFDCDC'}
                  flapColor={pdf.metadata.flapColor || '#E393AE'}
                  clickSound={clickSound}
                  onOpenFullPdf={(url) => setActivePdf(url)}
                />
              ))
            )}
          </Box>

          {/* Images */}
          <Box
            component="section"
            sx={{
              p: 3,
              borderRadius: 3,
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {images.length > 0 ? (
              <>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                    View Mode:
                  </Typography>
                  <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(_, val) => val && setViewMode(val)}
                    size="small"
                  >
                    <ToggleButton
                      value="carousel"
                      sx={{ fontSize: '20px', px: 2, py: 1 }}
                    >
                      ⬅️🎠➡️
                    </ToggleButton>
                    <ToggleButton
                      value="scroll"
                      sx={{ fontSize: '20px', px: 2, py: 1 }}
                    >
                      ⬆️🛗⬇️
                    </ToggleButton>
                    <ToggleButton
                      value="grid"
                      sx={{ fontSize: '20px', px: 2, py: 1 }}
                    >
                      ⏹️⏹️⏹️
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {viewMode === 'carousel' && (
                  <Box sx={{
                    ...contentWrapper,
                    height: '60vh',
                    display: 'flex',
                    flexDirection: 'column',
                    '& .react-multi-carousel-list, & .react-multi-carousel-track': {
                      height: '100% !important',
                      alignItems: 'center',
                    },
                  }
                  }>

                    <Carousel
                      responsive={carouselBreakpoints}
                      arrows           
                      //showDots         
                      infinite={images.length > 1}
                      keyBoardControl
                      showDots={false}
                      containerClass="carousel-container"     
                      dotListClass="carousel-dots"
                      itemClass="carousel-item" 
                    >
                      {images.map(img => (
                        <Box key={img._id} sx={{ width: '100%', px: 1, display: 'flex', justifyContent: 'center' }}>
                          <PhotoCardFinish key={img._id} photoTitle={img.title} filename={img.filename} mode="scroll" />
                        </Box>
                      ))}
                    </Carousel>
                  </Box>
                )}

                {viewMode === 'scroll' && (
                  <Box
                    sx={{
                      ...contentWrapper,
                      maxHeight: 400,
                      overflowY: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    {images.map(img => (
                      <PhotoCardFinish
                        key={img._id}
                        photoTitle={img.title}
                        filename={img.filename}
                        mode="scroll"
                      />
                    ))}
                  </Box>
                )}

                {viewMode === 'grid' && (
                  <Box
                    sx={{
                      ...contentWrapper,
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 2,
                      alignItems: 'center',
                    }}
                  >
                    {images.map(img => (
                      <PhotoCardFinish
                        key={img._id}
                        photoTitle={img.title}
                        filename={img.filename}
                        mode="grid"
                      />
                    ))}
                  </Box>
                )}
              </>
            ) : (
              <Typography variant="body2" sx={{ color: 'white' }}>
                You have no images in your capsule :(
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {activePdf && <PDFOverlay pdfUrl={activePdf} onClose={() => setActivePdf(null)} />}
    </Box>
  );
};

export default Capsule;
