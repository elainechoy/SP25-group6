import React, { useState } from 'react';
import {
  Modal,
  Box,
  IconButton,
  Typography,
//   useTheme
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function HelpMenu() {
//   const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);

  const pages = [
    // page 1
    <Box key="1" sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Home Page</Typography>
      <Typography
      sx={{ mb: 3 }}
      >
        Click the{' '}
        <Typography
            component="span"
            variant="inherit"
            sx={{ color: '#702b9d' }}
        >
            Create a Capsule
        </Typography>{' '}
        button to create your own capsule! 
      </Typography>
      <Typography sx={{mb: 3}}>Set the unlock date to a time in the future!</Typography>
      <Typography>
        - See your available capsules on the left 🕰️
      </Typography>
      <Typography sx={{my: 1}}>
        - Your sealed capsules are in the middle. Come back later to see them 🔒
      </Typography>
      <Typography>
        - Continue editing your capsules on the right 📝
      </Typography>
    </Box>,

    // page 2
    <Box key="2" sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Friends</Typography>
      <Typography>Invite friends to your capsules using their email to add them as your friend!</Typography>
    </Box>,

    // page 3
    <Box key="3" sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Editing a capsule</Typography>
      <Typography sx={{mb: 3}}>Change the color of your capsule using the color clicker near the capsule title</Typography>
      <Typography
      sx={{ mb: 3 }}
      >
        Click {' '}
        <Typography
            component="span"
            variant="inherit"
            sx={{ color: '#702b9d' }}
        >
            Add a song
        </Typography>{' '}
        to add music to the capsule or click{' '}
        <Typography
            component="span"
            variant="inherit"
            sx={{ color: '#702b9d' }}
        >
            Add a location
        </Typography> {' '}
        to see your capsule on the map
      </Typography>
      <Typography>
        Add letters and images to your capsule to send to your future self!
      </Typography>
    </Box>,

    // page 4
    <Box key="4" sx={{p: 2}}>
        <Typography variant="h5" gutterBottom>Viewing your capsule</Typography>
        <Typography sx={{mb: 3}}>View your letters and images from the past!</Typography>
        <Typography>Click on the letter to see a preview</Typography>
        <Typography sx={{mb: 3}}>Click Read More to expand the letter</Typography>
        <Typography>⬅️🎠➡️: Scroll through your images in gallery mode</Typography>
        <Typography>⬆️🛗⬇️: Use your mouse to scroll vertically through your photos</Typography>
        <Typography>⏹️⏹️⏹️: View your photos in a grid layout</Typography>
    </Box>,

    // page 5
    <Box key="5" sx={{p:2}}>
        <Typography variant="h5" gutterBottom>View your capsule on the map</Typography>
        <Typography sx={{mb: 3}}>View your capsule on the map based on the location you set!</Typography>
        <Typography sx={{ color: '#b700ff' }}>
            PURPLE {' '}
            <Typography sx={{ color: 'black'}} component="span" variant="inherit">
                represents your currently sealed capsules. Come back later 
            </Typography>
        </Typography>
        <Typography sx={{ color: '#e08aff' }}>
            LIGHT PURPLE {' '}
            <Typography sx={{ color: 'black'}} component="span" variant="inherit">
                represents the capsules you have not sealed yet. Go seal them right now or else
            </Typography>
        </Typography>
        <Typography sx={{ color: '#00ff3c' }}>
            GREEN {' '}
            <Typography sx={{ color: 'black'}} component="span" variant="inherit">
                represents openable capsules. Open your capsule to see your memories
            </Typography>
        </Typography>
    </Box>
  ];

  return (
    <>
      {/* trigger button */}
      <IconButton 
        onClick={() => setOpen(true)}
        disableRipple
        disableFocusRipple
        sx={{
        padding: 0,
        marginX: 3,
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: 'transparent !important',
            boxShadow: 'none',
        },
        '&:focus': {
            backgroundColor: 'transparent !important',
            boxShadow: 'none',
        },
        }}
      >
        <HelpOutlineIcon />
      </IconButton>

      {/* overlay modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropProps={{
          sx: { backgroundColor: 'rgba(0,0,0,0.6)' }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            width: { xs: '90%', sm: 500 },
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          {/* Close button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={() => setOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Page content */}
          {pages[page]}

          {/* Navigation controls */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2, pb: 2,
            }}
          >
            <IconButton
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
            >
              <ArrowBackIosIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2">
              Page {page + 1} of {pages.length}
            </Typography>
            <IconButton
              onClick={() => setPage((p) => Math.min(p + 1, pages.length - 1))}
              disabled={page === pages.length - 1}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
