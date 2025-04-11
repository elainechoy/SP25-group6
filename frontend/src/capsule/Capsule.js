import React, { useEffect, useState, useContext } from 'react';
import AppHeader from '../HomePageComponents/AppHeader';
import { Box } from '@mui/material';
import LetterCard from './LetterCard.js';
import { useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import UserContext from '../UserContext.js';
import PhotoCard from './PhotoCard.js';

const Capsule = () => {
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
                          justifyContent: 'flex-start', 
                          p: 3, 
                          borderRadius: 3, 
                          backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                          backdropFilter: 'blur(20px)', // Strong blur for a glassy effect
                          boxShadow: '0 0 50px 40px rgba(255, 255, 255, 0.05)', // Large spread shadow to fade edges
                          width: '40%',
                          // border: 'none',
                          // '&::before': {
                          //     content: '""',
                          //     position: 'absolute',
                          //     top: 0,
                          //     left: 0,
                          //     right: 0,
                          //     bottom: 0,
                          //     borderRadius: 3,
                          //     background: 'inherit',
                          //     filter: 'blur(10px)', // Blurs only the edges
                          //     zIndex: -1, // Puts it behind the main box
                          // }
                      }}
                  >

                  {pdfs.length === 0 ? (
                  <Typography
                      variant="body2"
                      sx={{ textAlign: 'center', mt: 4, fontStyle: 'italic', color: 'gray' }}
                  >
                      You wrote no letters in your capsule :((((((((((
                  </Typography>
                  ) : (
                  pdfs.map((pdf) => (
                      <LetterCard
                      key={pdf._id}
                      pdfUser={pdf.metadata.userName}
                      pdfId={pdf._id}
                      pdfTitle={pdf.metadata.title}
                  />
                  ))
                  )}
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
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            width: '40%',
                          }}
                      >
                          {images.length > 0 ? (
                              images.map((img) => (
                                  <PhotoCard
                                      key={img._id}
                                      photoId={img._id}
                                      photoTitle={img.title}
                                      filename={img.filename}
                                  />
                              ))
                          ) : (
                              <Typography variant="body2" sx={{ color: 'gray' }}>
                                  No images uploaded.
                              </Typography>
                          )}
                      </Box>
                  </Box>
              </Box>
          </Box>






      </>
  );
};

export default Capsule;