import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Callback from './components/Callback';
import Dashboard from './components/Dashboard';
import SelectedPlaylistPage from './components/SelectedPlaylistPage';
import Login from './components/Login';

const App = () => {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/selected-playlist/:id" element={<SelectedPlaylistPage />} />
      </Routes>
    </div>
  );
};

export default App;