import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import Navbar from './components/Navbar';
import { Container, CssBaseline } from '@mui/material';

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <Navbar />
      <Container component="main">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/userlist" element={<UserList />} />
          <Route path="*" element={<Navigate to="/userlist" />} /> {/* Default redirect */}
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
