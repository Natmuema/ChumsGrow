import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { Home, RiskProfiler, LearningHub, MarketInsights, AuthPage, Opportunities } from './pages';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-white">
          <Routes>
            {/* Public route for authentication */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Navbar />
                <Navigate to="/home" replace />
              </ProtectedRoute>
            } />
            <Route path="/home" element={
              <ProtectedRoute>
                <Navbar />
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/risk-profiler" element={
              <ProtectedRoute>
                <Navbar />
                <RiskProfiler />
              </ProtectedRoute>
            } />
            <Route path="/learning-hub" element={
              <ProtectedRoute>
                <Navbar />
                <LearningHub />
              </ProtectedRoute>
            } />
            <Route path="/insights" element={
              <ProtectedRoute>
                <Navbar />
                <MarketInsights />
              </ProtectedRoute>
            } />
            <Route path="/opportunities" element={
              <ProtectedRoute>
                <Navbar />
                <Opportunities />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;