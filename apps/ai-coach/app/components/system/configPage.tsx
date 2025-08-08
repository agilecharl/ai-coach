import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

type Config = {
  apiEndpoint: string;
  enableNotifications: boolean;
  theme: 'light' | 'dark';
};

const defaultConfig: Config = {
  apiEndpoint: '',
  enableNotifications: false,
  theme: 'light',
};

const ConfigPage: React.FC = () => {
  const [config, setConfig] = useState<Config>(defaultConfig);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    let newValue: string | boolean = value;
    if (type === 'checkbox') {
      newValue = target.checked;
    } else if (name === 'theme') {
      newValue = value as 'light' | 'dark';
    }
    setConfig((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save config logic here
    alert('Configuration saved!');
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <NavLink to="/config/chatbots">Chatbots</NavLink>
      <NavLink to="/config/models" style={{ marginLeft: '1rem' }}>
        Models
      </NavLink>
      <h2>System Configuration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="apiEndpoint">API Endpoint:</label>
          <input
            type="text"
            name="apiEndpoint"
            value={config.apiEndpoint}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label htmlFor="enableNotifications">Enable Notifications:</label>
          <input
            type="checkbox"
            name="enableNotifications"
            checked={config.enableNotifications}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="theme">Theme:</label>
          <select
            name="theme"
            value={config.theme}
            onChange={handleChange}
            style={{ width: '100%' }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>
          Save
        </button>
      </form>
    </div>
  );
};

export default ConfigPage;
