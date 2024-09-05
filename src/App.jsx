import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login';
import Target from './pages/Targeter/Targeter';
import Info from './pages/Adder/Adder';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/target" element={<Target />} />
      <Route path="/adder" element={<Info />} />
    </Routes>
  );
};

export default App;

