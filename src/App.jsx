import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
// Ensure this points to the file that ACTUALLY contains the ChatProvider component
import { ChatProvider } from './context/ChatProvider';
import Home from './view/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Import Dashboard component

function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            {/* Added Dashboard route */}
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;