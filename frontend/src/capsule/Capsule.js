import React, { useEffect, useState, useContext, useMemo } from 'react';
import AppHeader from '../HomePageComponents/AppHeader';
import { Box, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
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

  const clickSound = useMemo(() => new Audio(paperRip), []);

  // Fetch capsule info
  useEffect(() => {
    if (!capsuleId) return;
    fetch(`${API_URL}/api/get_capsule/${capsuleId}`, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(setCapsule)
      .catch(console.error);
  }, [capsuleId]);

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

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(to bottom right, #702b9d, #b991db, #702b9d)',
      color: 'white',
      minHeight: '100vh'
    }}>
      <AppHeader user={user} />

      <Box sx={{ gap: 3, m: 4 }}>
        {/* Title */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {capsule.title || 'Capsule Name'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Details */}
          <Box component="section" sx={{ p: 3, borderRadius: 3, backgroundColor: '#702b9d', width: '20%' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Description
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {capsule.description || 'No description available.'}
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Shared With:
            </Typography>
            {capsule.members?.length ? (
              <Box component="ul" sx={{ pl: 2 }}>
                {capsule.members.map((m, i) => (
                  <Typography component="li" key={i} sx={{ fontSize: '14px' }}>
                    {m}
                  </Typography>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: 'gray' }}>
                No members listed.
              </Typography>
            )}
          </Box>

          {/* Letters */}
          <Box component="section" sx={{ p: 3, borderRadius: 3, width: '35%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {pdfs.length === 0 ? (
              <Typography variant="body2" sx={{ textAlign: 'center', mt: 4, fontStyle: 'italic', color: 'gray' }}>
                You wrote no letters in your capsule :(
              </Typography>
            ) : (
              pdfs.map(pdf => (
                <LetterCardFinish
                  key={pdf._id}
                  pdfUser={pdf.metadata.userName}
                  pdfId={pdf._id}
                  pdfTitle={pdf.metadata.title}
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
                      arrows           // show left / right chevrons
                      showDots         // bottom dots
                      infinite={images.length > 1}
                      keyBoardControl
                      containerClass="carousel-container"     // for optional custom CSS
                      //itemClass="carousel-item-padding-40-px" // default gutter
                      dotListClass="carousel-dots"
                    //renderDotsOutside
                    >
                      {images.map(img => (
                        <Box key={img._id} sx={{ width: '100%', px: 1, display: 'flex', justifyContent: 'center' }}>
                          <PhotoCardFinish key = {img._id} photoTitle={img.title} filename={img.filename} mode = "scroll" />
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
                      key = {img._id}
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
                        key = {img._id}
                        photoTitle={img.title}
                        filename={img.filename}
                        mode = "grid"
                      />
                    ))}
                  </Box>
                )}
              </>
            ) : (
              <Typography variant="body2" sx={{ color: 'gray' }}>
                No images uploaded.
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
