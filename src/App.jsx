import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/login/Login';
import Target from './pages/Targeter/Targeter';
import Info from './pages/Adder/Adder';
import Status from './pages/Status/Status';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/target" element={<Target />} />
        <Route path="/adder" element={<Info />} />
        <Route path="/status/:id" element={<Status />} />
      </Routes>
    </Router>
  );
};

export default App;

