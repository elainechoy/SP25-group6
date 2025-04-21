import React from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

export default function MarkerOverlay({ capsule }) {
    let bgColor;

    const passToday = (unlockDate) => {
        const today = new Date();
        const targetDate = new Date(unlockDate);
        return targetDate < today;
    };

    if (passToday(capsule.unlockDate)) {
        bgColor = '#00ff3c';
    } else {
        if (!capsule.isSealed) {
            bgColor = '#e08aff'
        } else {
            bgColor = '#b700ff'
        }
    }
    
    return (
        <Box
        sx={{
            width:  'max-content',      // shrink to contents
            minWidth: 120,              // but at least 120px
            height:  'auto',            // auto‑height
            padding: 1,                 // theme spacing(1) = 8px
            background: bgColor,
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