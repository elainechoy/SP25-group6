import React from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

export default function MarkerOverlay({ capsule }) {
    return (
        <Box
        sx={{
            width:  'max-content',      // shrink to contents
            minWidth: 120,              // but at least 120px
            height:  'auto',            // auto‑height
            padding: 1,                 // theme spacing(1) = 8px
            background: '#CBC3E3',
            borderRadius: 1,
            textAlign: 'center'
        }}
        >
            {capsule.title}
        </Box>
    )
}

MarkerOverlay.propTypes = {
    capsule: PropTypes.object
}