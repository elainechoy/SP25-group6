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
  const [inputValue, setInputValue]       = useState('');
  const [suggestions, setSuggestions]     = useState([]);
  const autocompleteService = useRef(null);
  const placesService       = useRef(null);

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
    placesService.current.getDetails(
      { placeId, fields: ['name','formatted_address','geometry'] },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const loc = place.geometry.location;
          onSelect({
            name:    place.name,
            address: place.formatted_address,
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
        onBlur={() => toggleUI()}
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

// const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
//     libraries: ['places'],
//   });
//   const containerRef = useRef(null);

//   useEffect(() => {
//     if (!isLoaded || !containerRef.current) return;
  
//     window.google.maps
//       .importLibrary('places')
//       .then(places => {
//         const widget = new places.PlaceAutocompleteElement({
//           fields: ['name','formatted_address','geometry']
//         });

//         widget.style.display     = 'block';
//         widget.style.width       = '100%';        // fill its container
//         widget.style.height      = '40px';        // a tappable height
//         widget.style.padding     = '8px';         // some inset
//         widget.style.fontSize    = '16px';
//         widget.style.border      = '1px solid #ccc';
//         widget.style.borderRadius= '4px';
//         widget.style.boxSizing   = 'border-box';
  
//         // clear out an old widget if you re‑open
//         containerRef.current.innerHTML = '';
//         containerRef.current.appendChild(widget);
  
//         widget.addListener('gmp-select', () => {
//           const place = widget.getPlace();
//           if (!place.geometry) return;
//           const loc = place.geometry.location.toJSON();
//           onSelect({
//             name:    place.name,
//             address: place.formatted_address,
//             lat:     loc.lat,
//             lng:     loc.lng
//           });
//           toggleUI();
//         });
//       })
//       .catch(err => console.error('Places import failed', err));
//   }, [isLoaded, onSelect, toggleUI]);
  

//   if (loadError) return <p>Error loading map</p>;
//   if (!isLoaded) return <p>Loading map…</p>;

//   // this <div> is where the new widget will insert its own <input>
//   return (
//     <div
//       ref={containerRef}
//       style={{
//         width:       200,           // ← give it some width
//         padding:     8,
//         background:  'white',
//         boxShadow:   '0 2px 6px rgba(0,0,0,0.3)',
//         borderRadius:'8px',
//         overflow:    'hidden',
//       }}
//     />
//   );
