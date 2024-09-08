import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Status.css';

export default function Status() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [showTryAgainInput, setShowTryAgainInput] = useState(false);
  const [tryAgainTime, setTryAgainTime] = useState('');
  const [tryAgainDate, setTryAgainDate] = useState('');

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('adderEntries') || '{}');
    const savedEntries = savedData.orders || [];
    const selectedClient = savedEntries.find(entry => entry.id.toString() === id);
    if (selectedClient) {
      setClient(selectedClient);
    } else {
      navigate('/target');
    }
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [id, navigate, darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const handleStatusChange = async (newStatus) => {
    if (client) {
      try {
        const token = localStorage.getItem('authToken');
        let body = {
          token: token,
          id: client.id.toString(),
          status: newStatus
        };

        if (newStatus === 'try again' && tryAgainTime && tryAgainDate) {
          const formattedDateTime = `${tryAgainTime}:00 ${tryAgainDate}`;
          body.description = formattedDateTime;
        }

        const response = await fetch('https://team-api.robixe.online/status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error('Failed to update status');
        }

        const updatedClient = { ...client, status: newStatus };
        if (newStatus === 'try again') {
          updatedClient.try_again_time = body.time;
        }
        setClient(updatedClient);
        
        // Update local storage
        const savedData = JSON.parse(localStorage.getItem('adderEntries') || '{}');
        const savedEntries = savedData.orders || [];
        const updatedEntries = savedEntries.map(entry => 
          entry.id.toString() === id ? updatedClient : entry
        );
        localStorage.setItem('adderEntries', JSON.stringify({ ...savedData, orders: updatedEntries }));

        console.log('Status updated successfully');
        setShowTryAgainInput(false);
        setTryAgainTime('');
        setTryAgainDate('');
      } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update status. Please try again.');
      }
    }
  };

  if (!client) return <div>Loading...</div>;

  return (
    <div className="status-container">
      <header className="status-header">
        <h1>Client Status</h1>
        <button className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? '🌙' : '☀️'}
        </button>
      </header>
      <div className="client-info">
        <h2>Client Information</h2>
        <p><strong>Phone Number:</strong> {client.phone}</p>
        <p><strong>Add Time:</strong> {client.add_time}</p>
        <p>
          <strong>Location:</strong> 
          <a href={client.location} target="_blank" rel="noopener noreferrer">View on Map</a>
        </p>
        <p><strong>Current Status:</strong> {client.status || 'No Status'}</p>
        {client.try_again_time && <p><strong>Try Again Time:</strong> {client.try_again_time}</p>}
      </div>
      <div className="status-actions">
        <h3>Update Status</h3>
        <div className="status-buttons">
          <button 
            className={`status-btn confirmed ${client.status === 'confirmed' ? 'active' : ''}`}
            onClick={() => handleStatusChange('confirmed')}
          >
            Confirmed
          </button>
          <button 
            className={`status-btn no-response ${client.status === 'no response' ? 'active' : ''}`}
            onClick={() => handleStatusChange('no response')}
          >
            No Response
          </button>
          <button 
            className={`status-btn reject ${client.status === 'reject' ? 'active' : ''}`}
            onClick={() => handleStatusChange('reject')}
          >
            Reject
          </button>
          <button 
            className={`status-btn try-again ${client.status === 'try again' ? 'active' : ''}`}
            onClick={() => setShowTryAgainInput(true)}
          >
            Try Again
          </button>
        </div>
        {showTryAgainInput && (
          <div className="try-again-input">
            <input
              type="date"
              value={tryAgainDate}
              onChange={(e) => setTryAgainDate(e.target.value)}
              required
            />
            <input
              type="time"
              value={tryAgainTime}
              onChange={(e) => setTryAgainTime(e.target.value)}
              required
            />
            <button onClick={() => {
              if (tryAgainTime && tryAgainDate) {
                handleStatusChange('try again');
              } else {
                alert('Please set both date and time for Try Again');
              }
            }}>
              Confirm Try Again
            </button>
          </div>
        )}
      </div>
      <button className="back-btn" onClick={() => navigate('/target')}>Back to Dashboard</button>
    </div>
  );
}