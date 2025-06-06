import React, { useContext } from 'react';
import {
  GoogleMap,
  MarkerF,
  OverlayView,
  useLoadScript
} from '@react-google-maps/api';
import PropTypes from 'prop-types'
import UserContext from '../UserContext.js'
import AppHeader from '../HomePageComponents/AppHeader'
import MarkerOverlay from './MarkerOverlay'
import { useNavigate } from "react-router-dom";
import { API_URL } from '../config.js'

const containerStyle = { width: '100%', height: '100vh' };
const defaultCenter = { lat: 38, lng: -90 };

export default function MapViewer() {
  const { user } = useContext(UserContext);
  const [capsules, setCapsules] = React.useState([]);
  const [hoveredCap, setHoveredCap] = React.useState(null);
  const navigate = useNavigate();

  // 1. Load the script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY
  });

  React.useEffect(() => {
    const fetchCapsules = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("User not authenticated");
            return;
        }
        try {
            const response = await fetch(`${API_URL}/api/get_all_capsules`, {
                method: "GET",
                headers: {
                 'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`, // Send token for authentication
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Network response was not ok');
            }
            const data = await response.json();
            //i want to filter all of the capsules that have the location parameter here
            const withLocation = data.filter(cap => {
              const loc = cap.location;
              return (
                loc &&
                Array.isArray(loc.coordinates) &&
                loc.coordinates.length === 2 &&
                typeof loc.coordinates[0] === 'number' &&
                typeof loc.coordinates[1] === 'number'
              );
            });
            setCapsules(withLocation);

        } catch (error) {
            console.error("Error fetching capsules:", error);
        }
    };

    fetchCapsules();
}, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading map…</div>;

  if (!user) {
      return <p>Loading user data...</p>;
  }

  const passToday = (unlockDate) => {
    const today = new Date();
    const targetDate = new Date(unlockDate);
    return targetDate < today;
  };

  function navigateToPage(capsule) {
    if (passToday(capsule.unlockDate)) {
      navigate("/capsule", { state: { capsuleId: capsule._id } })
  } else {
      if (!capsule.isSealed) {
          navigate("/edit-capsule", { state: { capsuleId: capsule._id } })
      } else {
          alert("Capsule is sealed")
      }
  }
  }

  return (
    <>
        <AppHeader user={user} />

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={capsules.length ? 5 : 2}
        >
          {capsules
            .map(cap => (
              <MarkerF
                key={cap._id}
                position={{
                  lat: cap.location.coordinates[0],
                  lng: cap.location.coordinates[1],
                }}
                onMouseOver={() => setHoveredCap(cap)}
                onMouseOut={() => setHoveredCap(null)}
                onClick={() => navigateToPage(cap)}
              />
            ))
          }
          {hoveredCap && (() => {
          const [lat, lng] = hoveredCap.location.coordinates;
          return (
            <OverlayView
              position={{ lat, lng }}
              // draw in the mouse‐target pane so it’s above markers
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              // center horizontally, sit just above the marker
              getPixelPositionOffset={(w, h) => ({
                x: -(w / 2),
                y: -h - 80
              })}
            >
              <MarkerOverlay capsule={hoveredCap} />
            </OverlayView>
          )
        })()}
        </GoogleMap>
    </>
  );
}

MapViewer.propTypes = {
    capsules: PropTypes.array
};
