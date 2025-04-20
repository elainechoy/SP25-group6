// import React, { useState, useEffect } from 'react';
import React from 'react';
import {
  GoogleMap,
  Marker,
  useLoadScript
} from '@react-google-maps/api';
import PropTypes from 'prop-types'

const containerStyle = { width: '100%', height: '400px' };
const defaultCenter = { lat: 0, lng: 0 };

export default function MapViewer({ capsules = [] }) {
  // 1. Load the script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading map…</div>;

  // 2. Optionally compute a center if you have capsules
//   const center = capsules.length
//     ? {
//         lat: capsules[0].location.coordinates[1],
//         lng: capsules[0].location.coordinates[0],
//       }
//     : defaultCenter;
  const center = defaultCenter;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={capsules.length ? 5 : 2}
    >
      {capsules.map((cap) => (
        <Marker
          key={cap._id}
          position={{
            lat: 0,
            lng: 1,
          }}
        />
      ))}
    </GoogleMap>
  );
}

MapViewer.propTypes = {
    capsules: PropTypes.array
};
