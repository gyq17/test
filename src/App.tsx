import React, { useState, useEffect } from 'react';
import './App.css';
import { ApiService, ExampleData } from './services/api';

function App() {
  const [data, setData] = useState<ExampleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ title: '', description: '' });

  // Example of fetching data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getData();
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Example of sending data to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await ApiService.createData(newItem);
      setData(prev => [...prev, response.data]);
      setNewItem({ title: '', description: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Backend Integration Example</h1>
        
        {/* Error display */}
        {error && <div className="error-message">{error}</div>}

        {/* Loading state */}
        {loading && <div className="loading">Loading...</div>}

        {/* Form for creating new items */}
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            placeholder="Title"
            value={newItem.title}
            onChange={e => setNewItem(prev => ({ ...prev, title: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Description"
            value={newItem.description}
            onChange={e => setNewItem(prev => ({ ...prev, description: e.target.value }))}
          />
          <button type="submit">Add Item</button>
        </form>

        {/* Display data from backend */}
        <div className="data-display">
          {data.map(item => (
            <div key={item.id} className="data-item">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
