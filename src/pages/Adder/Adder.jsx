import React, { useState, useEffect } from 'react';
import './Adder.css';
import { fetchOrders } from '../../utils/help';
import { useNavigate } from 'react-router-dom';

// Add this function at the top of the file, outside of the Adder component
function Time() {
  const nowInCasablanca = new Date().toLocaleString("en-GB", { timeZone: "Africa/Casablanca" });
  const [datePart, timePart] = nowInCasablanca.split(", ");
  const [day, month, year] = datePart.split("/").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);
  return new Date(Date.UTC(year, month - 1, day, hours - 2, minutes, seconds));
}

export default function Adder() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [entries, setEntries] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [stats, setStats] = useState({
    add: 0,
    delete: 0,
    edit: 0
  });
  const [hasAccess, setHasAccess] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));;
  const [editingEntry, setEditingEntry] = useState(null);

  const calculateTimeLeft = (addTime) => {
    const now = Time(); // Use the Time() function instead of new Date()
    let addDateTime;

    // Check if addTime is in the format "HH:MM:SS DD/MM/YYYY"
    if (/^\d{2}:\d{2}:\d{2} \d{2}\/\d{2}\/\d{4}$/.test(addTime)) {
      const [time, date] = addTime.split(' ');
      const [hours, minutes, seconds] = time.split(':');
      const [day, month, year] = date.split('/');
      addDateTime = new Date(Date.UTC(year, month - 1, day, hours - 2, minutes, seconds));
    } else {
      // If not in the expected format, try parsing it directly
      addDateTime = new Date(addTime);
    }

    // Check if the date is valid
    if (isNaN(addDateTime.getTime())) {
      console.error('Invalid date format:', addTime);
      return 0;
    }

    const diffInMinutes = Math.floor((now - addDateTime) / (1000 * 60));
    return Math.max(60 - diffInMinutes, 0);
  };

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const data = await fetchOrders();
        if (data && Array.isArray(data.orders)) {
          const formattedEntries = data.orders.map(order => ({
            id: order.id,
            phoneNumber: order.phone,
            mapLink: order.location,
            status: order.status || 'No Response',
            addTime: order.add_time,
            timeLeft: calculateTimeLeft(order.add_time)
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

    loadEntries();
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');

    // Update stats from userInfo
    if (userInfo) {
      setStats({
        add: userInfo.add || 0,
        delete: userInfo.delete || 0,
        edit: userInfo.edit || 0
      });
    }

    // Check user role
    if (userInfo.role !== 'add') {
      setHasAccess(false);
    }
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^(06|07|05)\d{8}$/.test(phoneNumber)) {
      alert('Phone number must start with 06, 07, or 05 and be exactly 10 digits long.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const isEditing = !!editingEntry;
      const url = isEditing ? 'https://team-api.robixe.online/edit' : 'https://team-api.robixe.online/add';
      
      const bodyData = {
        token: token,
        phone: phoneNumber,
        location: mapLink
      };

      if (isEditing) {
        bodyData.id = editingEntry.id.toString();
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      if (response.status === 409 && !isEditing) {
        alert('This entry has already been added.');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'edit' : 'add'} entry. Status: ${response.status}`);
      }

      console.log(`Entry ${isEditing ? 'edited' : 'added'} successfully`);
      if (response.status === 201 || response.ok) {
        window.location.reload();
        return;
      }
      
      // Clear the form
      setPhoneNumber('');
      setMapLink('');
      setEditingEntry(null);

      // Update the stats
      setStats(prevStats => ({
        ...prevStats,
        [isEditing ? 'edit' : 'add']: prevStats[isEditing ? 'edit' : 'add'] + 1
      }));
    } catch (error) {
      console.warn(`Error ${editingEntry ? 'editing' : 'adding'} entry:`, error);
      alert(`Failed to ${editingEntry ? 'edit' : 'add'} entry. Please try again.`);
    }
  };

  const handleEdit = (id) => {
    const entryToEdit = entries.find(entry => entry.id === id);
    if (entryToEdit.timeLeft > 0) {
      setEditingEntry(entryToEdit);
      setPhoneNumber(entryToEdit.phoneNumber);
      setMapLink(entryToEdit.mapLink);
    } else {
      alert("You can't edit this entry anymore. The time limit has expired.");
    }
  };

  const handleConfirmEdit = async () => {
    if (!editingEntry) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://team-api.robixe.online/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          id: editingEntry.id.toString(),
          phone: phoneNumber,
          location: mapLink
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to edit entry. Status: ${response.status}`);
      }

      console.log('Entry edited successfully');
      // Refresh the entries list
      const updatedData = await fetchOrders();
      if (updatedData && Array.isArray(updatedData.orders)) {
        const formattedEntries = updatedData.orders.map(order => ({
          id: order.id,
          phoneNumber: order.phone,
          mapLink: order.location,
          status: order.status || 'No Response',
          addTime: order.add_time,
          timeLeft: calculateTimeLeft(order.add_time)
        }));
        setEntries(formattedEntries);
      }

      // Clear the form and reset editing state
      setPhoneNumber('');
      setMapLink('');
      setEditingEntry(null);

      // Update the stats
      setStats(prevStats => ({
        ...prevStats,
        edit: prevStats.edit + 1
      }));
    } catch (error) {
      console.error('Error editing entry:', error);
      alert('Failed to edit entry. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    const entryToDelete = entries.find(entry => entry.id === id);
    if (entryToDelete.timeLeft > 0) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('https://team-api.robixe.online/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: token,
            id: id.toString()
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to delete entry. Status: ${response.status}`);
        }

        console.log('Entry deleted successfully');
        // Refresh the entries list
        const updatedData = await fetchOrders();
        if (updatedData && Array.isArray(updatedData.orders)) {
          const formattedEntries = updatedData.orders.map(order => ({
            id: order.id,
            phoneNumber: order.phone,
            mapLink: order.location,
            status: order.status || 'No Response',
            addTime: order.add_time,
            timeLeft: calculateTimeLeft(order.add_time)
          }));
          setEntries(formattedEntries);
        }

        // Update the stats
        setStats(prevStats => ({
          ...prevStats,
          delete: prevStats.delete + 1
        }));
      } catch (error) {
        console.error('Error deleting entry:', error);
        alert('Failed to delete entry. Please try again.');
      }
    } else {
      alert("You can't delete this entry anymore. The time limit has expired.");
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  // Ensure entries is always an array before sorting
  const sortedEntries = Array.isArray(entries) ? [...entries].sort((a, b) => 
    new Date(b.updatedAt) - new Date(a.updatedAt)
  ) : [];

  if (!hasAccess) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have access to this page. Please contact an administrator if you believe this is an error.</p>
      </div>
    );
  }
  console.log(entries);
  return (
    <div className="adder-container">
      <nav className="user-nav">
        <div className="user-profile">
          <div className="user-details">
            <h3>{'User : '}</h3>
            <span>{userInfo.email || 'email@example.com'} </span> 
          </div>
        </div>
        <div className="user-stats">
          <div className="stat-item">
            <span className="stat-value">{stats.add}</span>
            <span className="stat-label">Added</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.delete}</span>
            <span className="stat-label">Deleted</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.edit}</span>
            <span className="stat-label">Edited</span>
          </div>
        </div>
        <div className="nav-actions">
          <button className="logout-btn" onClick={handleLogout}>log-out</button>
          <button className="theme-toggle" onClick={toggleDarkMode}>{darkMode ? '🌙' : '☀️'}</button>
        </div>
      </nav>
      <header className="adder-header">
        <h1>Adder Dashboard</h1>
        
      </header>
      <form onSubmit={handleSubmit} className="adder-form">
        <div className="input-group">
          <input
            type="tel"
            className='add-tel'
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
          className='add-url'
          value={mapLink}
          onChange={(e) => setMapLink(e.target.value)}
          placeholder="Google Maps Link"
          required
        />
        <button type="submit" className="submit-btn">{editingEntry ? 'Confirm Edit' : 'Add Entry'}</button>
        {editingEntry && (
          <button type="button" className="cancel-edit-btn" onClick={() => setEditingEntry(null)}>
            Cancel Edit
          </button>
        )}
      </form>
      <div className="table-container">
        <table className="adder-table">
          <thead>
            <tr>
              <th>Phone Number</th>
              <th>Google Maps Link</th>
              <th>Time Left</th>
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
                <td className={entry.timeLeft > 0 ? 'time-left' : 'expired'}>
                  {entry.timeLeft > 0 ? `${entry.timeLeft} min` : 'Expired'}
                </td>
                <td className="action-buttons">
                  {entry.timeLeft > 0 ? (
                    <>
                      <button 
                        onClick={() => handleEdit(entry.id)} 
                        className="edit-btn"
                        disabled={!!editingEntry}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(entry.id)} 
                        className="delete-btn"
                        disabled={!!editingEntry}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <span>No actions available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}