import React, { useState, useEffect } from 'react';
import './Adder.css';

export default function Adder() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mapLink, setMapLink] = useState('');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^(06|07|05)\d{8}$/.test(phoneNumber)) {
      alert('Phone number must start with 06, 07, or 05 and be exactly 10 digits long.');
      return;
    }
    const newEntry = { 
      id: Date.now(), 
      phoneNumber, 
      mapLink, 
      updatedAt: new Date().toISOString()
    };
    const updatedEntries = [...entries, newEntry].sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    setEntries(updatedEntries);
    localStorage.setItem('adderEntries', JSON.stringify(updatedEntries));
    setPhoneNumber('');
    setMapLink('');
  };

  const handleEdit = (id) => {
    const entryToEdit = entries.find(entry => entry.id === id);
    setPhoneNumber(entryToEdit.phoneNumber);
    setMapLink(entryToEdit.mapLink);
    handleDelete(id);
  };

  const handleDelete = (id) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem('adderEntries', JSON.stringify(updatedEntries));
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Sort entries before rendering
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  return (
    <div className="adder-container">
      <header className="adder-header">
        <h1>Adder Dashboard</h1>
        <button className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>
      <form onSubmit={handleSubmit} className="adder-form">
        <div className="input-container">
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number (06, 07, or 05)"
            pattern="^(06|07|05)\d{8}$"
            minLength="10"
            maxLength="10"
            required
          />
         
        </div>
        <span className="input-length">{phoneNumber.length}/10</span>
        <input
          type="url"
          value={mapLink}
          onChange={(e) => setMapLink(e.target.value)}
          placeholder="Google Maps Link"
          required
        />
        <button type="submit">Add Entry</button>
      </form>
      <div className="table-container">
        <table className="adder-table">
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
                <td>{entry.updatedAt}</td>
                <td className='btn-container'>
                  <button onClick={() => handleEdit(entry.id)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(entry.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}