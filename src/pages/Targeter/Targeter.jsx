import React, { useState, useEffect } from 'react';
import './Targeter.css';

export default function Targeter() {
  const [entries, setEntries] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem('adderEntries') || '[]');
    setEntries(savedEntries);
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const handleWhatsAppCall = (phoneNumber) => {
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  const handleNormalCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // Sort entries by updatedAt in descending order
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  return (
    <div className="targeter-container">
      <header className="targeter-header">
        <h1>Targeter Dashboard</h1>
        <button className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>
      <div className="table-container">
        <table className="targeter-table">
          <thead>
            <tr>
              <th>Phone Number</th>
              <th>Google Maps Link</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedEntries.map(entry => (
              <tr key={entry.id}>
                <td>{entry.phoneNumber}</td>
                <td>
                  <a href={entry.mapLink} target="_blank" rel="noopener noreferrer">
                    View on Map
                  </a>
                </td>
                <td>{new Date(entry.updatedAt).toLocaleString()}</td>
                <td className='btn-container'>
                  <button onClick={() => handleWhatsAppCall(entry.phoneNumber)} className="whatsapp-btn">WhatsApp</button>
                  <button onClick={() => handleNormalCall(entry.phoneNumber)} className="call-btn">Call</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
