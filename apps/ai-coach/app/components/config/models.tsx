import React, { useEffect, useState } from 'react';
import config from '../../config.json';

export interface Model {
  id: string;
  name: string;
  description?: string;
}

export interface ModelsProps {
  models: Model[];
  onSelect?: (model: Model) => void;
}

const fetchModels = async (): Promise<Model[]> => {
  try {
    const apiUrl = config.apiUrl || 'http://localhost:3001/api';
    const fullUrl = `${apiUrl}/models`;

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(
        `Failed to fetch models: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
};

export const Models: React.FC<ModelsProps> = ({ models, onSelect }) => {
  const [localModels, setLocalModels] = useState<Model[]>(models || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      if (models && models.length > 0) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const fetchedModels = await fetchModels();
        setLocalModels(fetchedModels);
      } catch (err) {
        setError(
          'Failed to load models. Please check if the API server is running.'
        );
        console.error('Error loading models:', err);
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, [models]);

  if (loading) {
    return <div>Loading models...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Available Models</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {localModels.map((bot) =>
          onSelect ? (
            <li
              key={bot.id}
              style={{ listStyle: 'none', padding: 0, margin: 0 }}
            ></li>
          ) : (
            <li
              key={bot.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem',
                cursor: 'default',
              }}
            >
              <div>
                <div style={{ fontWeight: 'bold' }}>{bot.name}</div>
                {bot.description && (
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    {bot.description}
                  </div>
                )}
              </div>
            </li>
          )
        )}
      </ul>
      <button onClick={() => (window.location.href = '/config')}>Return</button>
    </div>
  );
};

export default Models;
