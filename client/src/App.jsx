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

  useEffect(() => {
    loadGraphData();
  }, []);

  const loadGraphData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/graph`);
      setGraphData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading graph data:', error);
      setLoading(false);
    }
  };

  const handleAddPerson = async (person) => {
    try {
      await axios.post(`${API_BASE}/people`, person);
      await loadGraphData();
    } catch (error) {
      console.error('Error adding person:', error);
    }
  };

  const handleAddEvent = async (event) => {
    try {
      await axios.post(`${API_BASE}/events`, event);
      await loadGraphData();
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleAddConnection = async (connection) => {
    try {
      await axios.post(`${API_BASE}/connections`, connection);
      await loadGraphData();
    } catch (error) {
      console.error('Error adding connection:', error);
    }
  };

  const handleDeletePerson = async (id) => {
    try {
      await axios.delete(`${API_BASE}/people/${id}`);
      await loadGraphData();
    } catch (error) {
      console.error('Error deleting person:', error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`${API_BASE}/events/${id}`);
      await loadGraphData();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleDeleteConnection = async (id) => {
    try {
      await axios.delete(`${API_BASE}/connections/${id}`);
      await loadGraphData();
    } catch (error) {
      console.error('Error deleting connection:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
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
          <PersonForm onSubmit={handleAddPerson} people={graphData.people} />
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
