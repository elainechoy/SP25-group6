import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const HiddenPicker = styled('input')({
  opacity: 0,
  width: '100%',
  height: '100%',
  cursor: 'pointer',
  position: 'absolute',
  top: 0,
  left: 0,
});

export default function ColorSwatch({ value, onChange }) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 24,               // slightly smaller
        height: 24,
        borderRadius: 2,         // nice rounded corners
        border: '2px solid white',
        backgroundColor: value,
        boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`,
      }}
    >
      <HiddenPicker
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </Box>
  );
}

ColorSwatch.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
