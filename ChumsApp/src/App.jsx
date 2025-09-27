import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Home, RiskProfiler, LearningHub, MarketInsights, AuthPage, Opportunities } from './pages';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-white">
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={
              <>
                <Home />
                <Footer />
              </>
            } />
            
            {/* Protected routes */}
            <Route path="/risk-profiler" element={
              <ProtectedRoute>
                <RiskProfiler />
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/learning-hub" element={
              <ProtectedRoute>
                <LearningHub />
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/insights" element={
              <ProtectedRoute>
                <MarketInsights />
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/opportunities" element={
              <ProtectedRoute>
                <Opportunities />
                <Footer />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;