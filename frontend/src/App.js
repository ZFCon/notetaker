import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';  // Import the Header component
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AuthenticatedRoute from './routes/AuthenticatedRoute';
import LoggedoutRoute from './routes/LoggedoutRoute';

function App() {
  return (
    <Router>
      {/* Header will appear on all pages */}
      <Header />

      {/* Define the routes */}
      <Routes>
        <Route path="/login" element={
          <LoggedoutRoute>
            <Login />
          </LoggedoutRoute>
        } />
        <Route path="/register" element={
          <LoggedoutRoute>
            <Register />
          </LoggedoutRoute>
        } />
        <Route
          path="/dashboard"
          element={
            <AuthenticatedRoute>
              <Dashboard />
            </AuthenticatedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
