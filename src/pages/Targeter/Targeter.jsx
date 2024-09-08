import React, { useState, useEffect } from 'react';
import './Targeter.css';
import { useNavigate } from 'react-router-dom';
import { fetchOrders } from '../../utils/help';

// Function to get the status color class
function getStatusColor(status) {
  switch (status) {
    case 'confirmed':
      return 'status-confirmed';
    case 'no response':
      return 'status-no-response';
    case 'reject':
      return 'status-reject';
    case 'try again':
      return 'status-try-again';
    default:
      return 'status-default';
  }
}

// Function to calculate status quantities
function calculateStatusQuantities() {
  const savedData = JSON.parse(localStorage.getItem('adderEntries') || '{}');
  const orders = savedData.orders || [];
  
  const statusCounts = {
    confirmed: 0,
    'no response': 0,
    reject: 0,
    'try again': 0
  };

  orders.forEach(order => {
    if (statusCounts.hasOwnProperty(order.status)) {
      statusCounts[order.status]++;
    }
  });

  return statusCounts;
}

export default function Targeter() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [hasAccess, setHasAccess] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const [stats, setStats] = useState({
    add: 0,
    delete: 0,
    edit: 0,
    tryAgain: 0,
  });
  const [calls, setCalls] = useState(0);

  useEffect(() => {
    const loadCalls = () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      setCalls(userInfo.call || 0);
    };

    const loadEntries = async () => {
      try {
        const data = await fetchOrders();
        localStorage.setItem('adderEntries', JSON.stringify(data));
        if (data && Array.isArray(data.orders)) {
          const formattedEntries = data.orders.map(order => ({
            id: order.id,
            phoneNumber: order.phone,
            mapLink: order.location,
            status: order.status || 'No Response',
            updatedAt: new Date().toISOString()
          }));
          setEntries(formattedEntries);
        } else {
          console.error('Unexpected data format:', data);
          setEntries([]);
        }
      } catch (error) {
        console.error('Error loading entries:', error);
        setEntries([]);
      }
    };

    loadCalls();
    loadEntries();
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');

    if (userInfo.role !== 'call') {
      setHasAccess(false);
    }

    const statusQuantities = calculateStatusQuantities();
    setStats({
      add: statusQuantities.confirmed,
      delete: statusQuantities['no response'],
      edit: statusQuantities.reject,
      tryAgain: statusQuantities['try again']
    });
  }, [darkMode, userInfo.role]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const handleWhatsAppCall = (phoneNumber) => {
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  const handleNormalCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const handleStatusClick = (entryId) => {
    navigate(`/status/${entryId}`);
  };

  if (!hasAccess) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have access to this page. Please contact an administrator if you believe this is an error.</p>
      </div>
    );
  }

  return (
    <div className="targeter-container">
      <nav className="user-nav">
        <div className="user-profile">
          <div className="user-details">
            <h3>User: </h3>
            <span>{userInfo.email || 'email@example.com'}</span>
          </div>
        </div>
        <div className="user-stats">
          <div className="stat-item">
            <span className="stat-value">{calls}</span>
            <span className="stat-label">Calls  :</span>
          </div>
        </div>
        <div className="nav-actions">
          <button className="logout-btn" onClick={handleLogout}>Log out</button>
          <button className="theme-toggle" onClick={toggleDarkMode}>{darkMode ? '🌙' : '☀️'}</button>
        </div>
      </nav>
      <header className="targeter-header">
        <h1>Targeter Dashboard</h1>
      </header>
      <div className="table-container">
        <table className="targeter-table">
          <thead>
            <tr>
              <th>Phone Number</th>
              <th>Google Maps Link</th>
              <th>Status Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => (
              <tr key={entry.id}>
                <td>{entry.phoneNumber}</td>
                <td>
                  <a href={entry.mapLink} target="_blank" rel="noopener noreferrer" className="map-link">
                    View on Map
                  </a>
                </td>
                <td>
                  <button 
                    onClick={() => handleStatusClick(entry.id)}
                    className={`status-btn2 ${getStatusColor(entry.status)}`}
                  >
                    {entry.status || 'No Status'}
                  </button>
                </td>
                <td className="action-buttons">
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
