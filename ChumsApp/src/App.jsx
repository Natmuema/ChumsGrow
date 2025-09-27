import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Home, RiskProfiler, LearningHub, MarketInsights, AuthPage, Opportunities, BlogPost } from './pages';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-white">
          <Routes>
            {/* Public route for authentication */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={
              <ProtectedRoute>
                <Navbar />
                <Home />
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/risk-profiler" element={
              <ProtectedRoute>
                <Navbar />
                <RiskProfiler />
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/learning-hub" element={
              <ProtectedRoute>
                <Navbar />
                <LearningHub />
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/insights" element={
              <ProtectedRoute>
                <Navbar />
                <MarketInsights />
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/opportunities" element={
              <ProtectedRoute>
                <Navbar />
                <Opportunities />
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/blog/:id" element={
              <ProtectedRoute>
                <Navbar />
                <BlogPost />
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