import { useState, useEffect } from 'react';
import axios from 'axios';
import GraphView from './components/GraphView';
import PersonForm from './components/PersonForm';
import EventForm from './components/EventForm';
import ConnectionForm from './components/ConnectionForm';
import './App.css';

const API_BASE = 'http://localhost:3001/api';

function App() {
  const [graphData, setGraphData] = useState({ people: [], events: [], connections: [] });
  const [activeTab, setActiveTab] = useState('graph');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGraphData();
  }, []);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadGraphData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/graph`);
      setGraphData(response.data);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error loading graph data:', err);
      setError('Failed to load graph data. Please refresh the page.');
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const handleAddPerson = async (person) => {
    try {
      await axios.post(`${API_BASE}/people`, person);
      await loadGraphData();
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to add person';
      setError(message);
      throw new Error(message);
    }
  };

  const handleAddEvent = async (event) => {
    try {
      await axios.post(`${API_BASE}/events`, event);
      await loadGraphData();
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to add event';
      setError(message);
      throw new Error(message);
    }
  };

  const handleAddConnection = async (connection) => {
    try {
      await axios.post(`${API_BASE}/connections`, connection);
      await loadGraphData();
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to add connection';
      setError(message);
      throw new Error(message);
    }
  };

  const handleDeletePerson = async (id) => {
    try {
      await axios.delete(`${API_BASE}/people/${id}`);
      await loadGraphData();
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to delete person';
      setError(message);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`${API_BASE}/events/${id}`);
      await loadGraphData();
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to delete event';
      setError(message);
    }
  };

  const handleDeleteConnection = async (id) => {
    try {
      await axios.delete(`${API_BASE}/connections/${id}`);
      await loadGraphData();
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to delete connection';
      setError(message);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={clearError} className="error-close">&times;</button>
        </div>
      )}
      <header className="app-header">
        <h1>What's Next - Knowledge Graph</h1>
        <p>Track people and events with connections</p>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === 'graph' ? 'active' : ''}
          onClick={() => setActiveTab('graph')}
        >
          Graph View
        </button>
        <button
          className={activeTab === 'people' ? 'active' : ''}
          onClick={() => setActiveTab('people')}
        >
          Add Person
        </button>
        <button
          className={activeTab === 'events' ? 'active' : ''}
          onClick={() => setActiveTab('events')}
        >
          Add Event
        </button>
        <button
          className={activeTab === 'connections' ? 'active' : ''}
          onClick={() => setActiveTab('connections')}
        >
          Add Connection
        </button>
      </nav>

      <main className="content">
        {activeTab === 'graph' && (
          <GraphView
            data={graphData}
            onDeletePerson={handleDeletePerson}
            onDeleteEvent={handleDeleteEvent}
            onDeleteConnection={handleDeleteConnection}
          />
        )}
        {activeTab === 'people' && (
          <PersonForm onSubmit={handleAddPerson} people={graphData.people} events={graphData.events} />
        )}
        {activeTab === 'events' && (
          <EventForm onSubmit={handleAddEvent} events={graphData.events} />
        )}
        {activeTab === 'connections' && (
          <ConnectionForm
            onSubmit={handleAddConnection}
            people={graphData.people}
            events={graphData.events}
          />
        )}
      </main>
    </div>
  );
}

export default App;
