import React, { useEffect, useState, useContext, useMemo } from 'react';
import AppHeader from '../HomePageComponents/AppHeader';
import { Box, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import LetterCard from './LetterCard';
import { useLocation } from 'react-router-dom';
import UserContext from '../UserContext';
import PhotoCardFinish from './PhotoCardFinish';
import PDFOverlay from '../PDFOverlay';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import paperRip from './assets/paper-rip.mp3';
import './CarouselOverrides.css';

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
    fetch(`http://localhost:5001/api/get_capsule/${capsuleId}`, {
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
    fetch(`http://localhost:5001/api/get-pdfs-by-capsule/${capsuleId}`, {
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
    fetch(`http://localhost:5001/api/get-photos-by-capsule/${capsuleId}`)
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(setImages)
      .catch(console.error);
  }, [capsuleId]);

  const sliderSettings = {
    dots: true,
    infinite: images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,         
    centerPadding: '0px',    
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
          <Box component="section" sx={{ p: 3, borderRadius: 3, width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {pdfs.length === 0 ? (
              <Typography variant="body2" sx={{ textAlign: 'center', mt: 4, fontStyle: 'italic', color: 'gray' }}>
                You wrote no letters in your capsule :(
              </Typography>
            ) : (
              pdfs.map(pdf => (
                <LetterCard
                  key={pdf._id}
                  pdfUser={pdf.metadata.userName}
                  pdfId={pdf._id}
                  pdfTitle={pdf.metadata.title}
                  clickSound={clickSound}
                  onOpenFullPdf={(url) => setActivePdf(url)}
                />
              ))
            )}
          </Box>

          {/* Images */}
          <Box component="section" sx={{ p: 3, borderRadius: 3, width: '40%', justifyContent: 'center' }}>
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
                    <ToggleButton value="carousel">Carousel</ToggleButton>
                    <ToggleButton value="scroll">Scroll</ToggleButton>
                    <ToggleButton value="grid">Grid</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {viewMode === 'carousel' && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ width: '80%' }}>
                      <Slider {...sliderSettings}>
                        {images.map(img => (
                          <Box
                            key={img._id}
                            sx={{ width: '60%', maxWidth: 500 }}
                          >
                            <PhotoCardFinish key={img._id} photoTitle={img.title} filename={img.filename} />
                          </Box>
                        ))}
                      </Slider>

                    </Box>
                  </Box>
                )}

                {viewMode === 'scroll' && (
                  <Box sx={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                    {images.map(img => (
                      <PhotoCardFinish key={img._id} photoTitle={img.title} filename={img.filename} />
                    ))}
                  </Box>
                )}

                {viewMode === 'grid' && (
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 2,
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    alignItems: 'center',

                  }}>
                    {images.map(img => (
                      <PhotoCardFinish key={img._id} photoTitle={img.title} filename={img.filename} />
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
