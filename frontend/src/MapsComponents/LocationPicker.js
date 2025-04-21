import React, { useRef, useEffect, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import PropTypes from 'prop-types';

export default function LocationPicker({ onSelect, toggleUI }) {
    // 1️⃣ Load the Maps JS + Places libraries
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    libraries: ['places'],
  });

  // 2️⃣ Local state
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);

  // 3️⃣ Once maps is ready, create the services
  useEffect(() => {
    if (!isLoaded) return;
    /* AutocompleteService just returns place predictions */
    autocompleteService.current = new window.google.maps.places.AutocompleteService();
    /* PlacesService is used to fetch full place details */
    placesService.current = new window.google.maps.places.PlacesService(
      document.createElement('div')  // off‑screen div
    );
  }, [isLoaded]);

  // 4️⃣ When the user types, debounce & fetch predictions
  useEffect(() => {
    if (!autocompleteService.current) return;

    if (!inputValue) {
      setSuggestions([]);
      return;
    }

    const handler = setTimeout(() => {
      autocompleteService.current.getPlacePredictions(
        { input: inputValue },
        (preds, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setSuggestions(preds);
          } else {
            setSuggestions([]);
          }
        }
      );
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [inputValue]);

  // 5️⃣ When the user picks one, fetch its details
  const handleSelect = (placeId, description) => {
    console.log("handle select yayyayyyy")
    placesService.current.getDetails(
      { placeId, fields: ['name','formatted_address','geometry'] },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const loc = place.geometry.location;
          console.log("calling onSelect");
          onSelect({
            name:    place.name,
            lat:     loc.lat(),
            lng:     loc.lng()
          });
          setInputValue(description);
          setSuggestions([]);
          toggleUI();
        }
      }
    );
  };

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading map…</div>;

  return (
    <div style={{ position: 'relative', width: 200 }}>
      <input
        type="text"
        placeholder="Search a place…"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onBlur={() => {
            setTimeout(toggleUI, 100);
        }}
        style={{
          width: '100%',
          padding: 8,
          fontSize: 14,
          boxSizing: 'border-box',
          alignItems: 'center'
        }}
      />

      {suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            margin: 0,
            padding: 0,
            listStyle: 'none',
            background: 'white',
            border: '1px solid #ccc',
            maxHeight: 200,
            overflowY: 'auto',
            zIndex: 1000,
            color: 'black'
          }}
        >
          {suggestions.map(pred => (
            <li
              key={pred.place_id}
              onClick={() => handleSelect(pred.place_id, pred.description)}
              style={{
                padding: '8px',
                cursor: 'pointer'
              }}
            >
              {pred.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

LocationPicker.propTypes = {
  onSelect:  PropTypes.func.isRequired,
  toggleUI:  PropTypes.func.isRequired,
};