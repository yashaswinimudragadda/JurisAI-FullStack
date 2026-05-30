import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext.jsx'; 
import Home from './views/Home';
import Login from './views/Login';
import Signup from './views/Signup';
import Dashboard from './views/Dashboard';

export default function App() {
  // Controlled explicitly on login button submit click
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <ChatProvider>
      <Router>
        <Routes>
          
          {/* Base domain URL loads the new themed Home Page */}
          <Route path="/" element={<Home />} />

          {/* Login security gateway path */}
          <Route 
            path="/Login" 
            element={isAuthenticated ? <Navigate to="/Dashboard" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />} 
          />

          {/* Sign up registration path */}
          <Route 
            path="/Signup" 
            element={isAuthenticated ? <Navigate to="/Dashboard" replace /> : <Signup />} 
          />

          {/* Protected workspace area (Dashboard) */}
          <Route 
            path="/Dashboard" 
            element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/Home" replace />} 
          />

          {/* Catch-all broken paths redirect straight back home */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </Router>
    </ChatProvider>
  );
}