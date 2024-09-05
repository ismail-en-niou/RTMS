import React, { useState, useEffect } from 'react';
import './Login.css'; // We'll create this file for styling

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Initialize darkMode state from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    // Apply the theme when component mounts and when darkMode changes
    document.body.classList.toggle('dark-mode', darkMode);
    // Save the current theme preference to localStorage
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://team-api.robixe.online/log-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          pass: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);
      
      if (data.token && data.role) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRole', data.role);
        console.log('Token and role stored in local storage');
        
        // Redirect based on role
        if (data.role === 'targeter') {
          window.location.href = '/targeter';
        } else if (data.role === 'adder') {
          window.location.href = '/adder';
        } else {
          window.location.href = '/';
        }
      } else {
        throw new Error('Invalid response data');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    const message = encodeURIComponent("I forgot my password");
    const whatsappUrl = `https://wa.me/212688267253?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-art">
          <div className="circle circle1"></div>
          <div className="circle circle2"></div>
          <div className="circle circle3"></div>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Welcome again</h2>
          <p>Sign in to continue your journey</p>
          
          <div className="form-group">
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">Sign In</button>
          <div className="additional-options">
            <a href="#" onClick={handleForgotPassword}>Forgot password?</a>
          </div>
        </form>
      </div>
      <button className="theme-toggle" onClick={toggleDarkMode}>
        {darkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
