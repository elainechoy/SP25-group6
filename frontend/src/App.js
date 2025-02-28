// import logo from './logo.svg';
import React from 'react';
import './App.css';
import Home from './Home.js';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import CreateCapsule from './capsule/CreateCapsule.js';
import Capsule from './capsule/Capsule.js'
import EditCapsule from './capsule/EditCapsule.js'
import Letter from "./Letter.js";
import LetterList from './LetterList.js';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />

        <Route path="/create-capsule" element={<CreateCapsule />} />
        <Route path="/capsule" element={<Capsule />} />
        <Route path="/edit-capsule" element={<EditCapsule />} />

        <Route path="/letter" element={<Letter />} />
        <Route path="/letter-list" element={<LetterList />} />
      </Routes>
    </Router>
  );
};

export default App;