// import logo from './logo.svg';
import React from 'react';
import './App.css';
import Home from './Home.js';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import CreateCapsule from './capsule/CreateCapsule.js';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-capsule" element={<CreateCapsule />} />
      </Routes>
    </Router>
  );
};

export default App;