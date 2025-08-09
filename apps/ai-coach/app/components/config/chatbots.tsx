import React, { useEffect, useState } from 'react';
import config from '../../config.json';

export interface Chatbot {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
}

export interface ChatbotsProps {
  chatbots: Chatbot[];
  onSelect?: (chatbot: Chatbot) => void;
}

const fetchChatbots = async (): Promise<Chatbot[]> => {
  try {
    const apiUrl = config.apiUrl || 'http://localhost:3001/api';
    const fullUrl = `${apiUrl}/chatbots`;

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
        `Failed to fetch chatbots: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching chatbots:', error);
    return [];
  }
};

export const Chatbots: React.FC<ChatbotsProps> = ({ chatbots, onSelect }) => {
  const [localChatbots, setLocalChatbots] = useState<Chatbot[]>(chatbots || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChatbots = async () => {
      if (chatbots && chatbots.length > 0) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const fetchedChatbots = await fetchChatbots();
        setLocalChatbots(fetchedChatbots);
      } catch (err) {
        setError(
          'Failed to load chatbots. Please check if the API server is running.'
        );
        console.error('Error loading chatbots:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChatbots();
  }, [chatbots]);

  if (loading) {
    return <div>Loading chatbots...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Available Chatbots</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {localChatbots.map((bot) =>
          onSelect ? (
            <li
              key={bot.id}
              style={{ listStyle: 'none', padding: 0, margin: 0 }}
            >
              <button
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  width: '100%',
                  textAlign: 'left',
                }}
                onClick={() => onSelect(bot)}
                tabIndex={0}
                aria-label={`Select chatbot ${bot.name}`}
              >
                {bot.avatarUrl && (
                  <img
                    src={bot.avatarUrl}
                    alt={bot.name}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      marginRight: 16,
                    }}
                  />
                )}
                <div>
                  <div style={{ fontWeight: 'bold' }}>{bot.name}</div>
                  {bot.description && (
                    <div style={{ fontSize: '0.9em', color: '#666' }}>
                      {bot.description}
                    </div>
                  )}
                </div>
              </button>
            </li>
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
              {bot.avatarUrl && (
                <img
                  src={bot.avatarUrl}
                  alt={bot.name}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    marginRight: 16,
                  }}
                />
              )}
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

export default Chatbots;
