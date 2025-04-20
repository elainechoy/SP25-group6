import React, { useState, useRef } from 'react';
import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  Autocomplete
} from '@react-google-maps/api';
import PropTypes from 'prop-types'

const libraries = ['places'];
const mapStyle = { width: '200px', height: '150px', marginTop: '8px' };

export default function LocationPicker({ onSelect, showMap }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    libraries
  });
  const autoRef = useRef(null);
  const [position, setPosition] = useState(null);

  const handlePlaceChanged = () => {
    const place = autoRef.current.getPlace();
    if (!place.geometry) return;
    const loc = place.geometry.location.toJSON();
    setPosition(loc);
    onSelect({ 
      address: place.formatted_address, 
      lat: loc.lat, 
      lng: loc.lng 
    });
  };

  if (loadError) return <p>Error loading map</p>;
  if (!isLoaded)   return <p>Loading map…</p>;

  return (
    <div style={{ 
        display: 'inline-block',
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: 8,
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        overflow: 'hidden'
    }}>
      <Autocomplete
        onLoad={ref => (autoRef.current = ref)}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          placeholder="Search a place…"
          style={{
            width: 200,
            padding: '8px',
            fontSize: 14,
            border: 'none',
            outline: 'none'
          }}
        />
      </Autocomplete>

      {position && showMap && (
        <GoogleMap
          mapContainerStyle={mapStyle}
          center={position}
          zoom={12}
          options={{ disableDefaultUI: true, gestureHandling: 'none' }}
        >
          <MarkerF position={position} />
        </GoogleMap>
      )}
    </div>
  );
}

LocationPicker.propTypes = {
    onSelect: PropTypes.func,
    showMap: PropTypes.bool
}
