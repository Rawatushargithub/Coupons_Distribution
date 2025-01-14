import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import EventDashboard from './components/Event.dashboard';
import LoginPage from './auth/login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear the token from storage
    setIsAuthenticated(false); // Update authentication state
    alert('Logged out successfully!');
  };

  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        <nav className="p-4 bg-gray-800 text-white flex justify-between">
          <h1 className="text-lg font-bold">Event Manager</h1>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </nav>

        {/* Routes */}
        <Routes>
          {/* Protected Route for Event Dashboard */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <EventDashboard /> : <Navigate to="/login" replace />
            }
          />

          {/* Login Route */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />
            }
          />

          {/* Default Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
