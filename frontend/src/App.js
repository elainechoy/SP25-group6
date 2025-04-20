// import logo from './logo.svg';
import React from 'react';
import './App.css';
import Home from './Home.js';
import Friends from './Friends.js';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import CreateCapsule from './capsule/CreateCapsule.js';
import Capsule from './capsule/Capsule.js'
import EditCapsule from './capsule/EditCapsule.js'
import Letter from "./Letter.js";
import LetterList from './LetterList.js';
import Profile from './Profile.js';
import PhotoUploadForm from './media_upload/PhotoUpload.js';
import MapViewer from './MapsComponents/MapViewer.js'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/friends" element={<Friends />} />

        <Route path="/create-capsule" element={<CreateCapsule />} />
        <Route path="/capsule" element={<Capsule />} />
        <Route path="/edit-capsule" element={<EditCapsule />} />

        <Route path="/letter/:capsuleId" element={<Letter />} />
        <Route path="/letter-list" element={<LetterList />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/upload-photo" element={<PhotoUploadForm />} />
        <Route path="/map" element={<MapViewer />} />
      </Routes>
    </Router>
  );
};

export default App;