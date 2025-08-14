import { useEffect, useRef, useState } from 'react';
import { getRecordsOllamaResponse } from '../../../../libs/utils/src/lib/data/ai-helper';
import { initializeRestClient } from '../../../../libs/utils/src/lib/data/rest';
import config from '../config.json';

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

const AiClient: React.FC<ChatbotsProps> = ({ chatbots, onSelect }) => {
  const [messages, setMessages] = useState([
    { id: 'init', role: 'assistant', content: 'Hi! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [localChatbots, setLocalChatbots] = useState<Chatbot[]>(chatbots || []);
  const [currentChatbot, setCurrentChatbot] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getChatbotName = (id: number): string => {
    if (id === 0) {
      return 'Assistant';
    }

    const chatbot = localChatbots.find((cb) => Number(cb.id) === id);

    return chatbot ? chatbot.name : 'Unknown Chatbot';
  };

  const getResponse = async (chatbotId: number, message: string) => {
    if (!chatbotId || chatbotId === 0) {
      return 'Please select a chatbot to start chatting.';
    } else {
      const selectedChatbot = getChatbotName(chatbotId);

      if (!selectedChatbot) {
        return 'Selected chatbot not found.';
      } else {
        initializeRestClient({
          apiUrl: import.meta.env.VITE_REST_URL || 'http://localhost:3001',
        });

        await getRecordsOllamaResponse('ai/generate', {
          message: message,
          title: message,
        })
          .then((response) => {
            console.log('Response from AI:', response);
            return response;
          })
          .catch((error) => {
            console.error('Error generating field content:', error);
            return 'Error generating response. Please try again.';
          });

        return `Response from ${selectedChatbot}: ${message}`;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  // Helper to generate a unique id for each message
  const generateId = () =>
    `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: generateId(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    await getResponse(currentChatbot, input.trim()).then((response) => {
      const assistantMessage = {
        id: generateId(),
        role: getChatbotName(currentChatbot),
        content: response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      scrollToBottom();
    });
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: 'init',
        role: 'assistant',
        content: 'Hi! How can I help you today?',
      },
    ]);
    setInput('');
  };

  if (loading) {
    return <div>Loading chatbots...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={styles.container as React.CSSProperties}>
      <div
        style={styles.chatWindow as React.CSSProperties}
        ref={(el) => {
          if (el) {
            // Scroll to bottom on mount and after each render
            el.scrollTop = el.scrollHeight;
          }
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.message,
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              background: msg.role === 'user' ? '#daf1fc' : '#f1f1f1',
            }}
          >
            <div>
              <strong>{msg.role === 'user' ? 'You' : msg.role}:</strong>
              <div>{msg.content}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ margin: '0 0 10px 0', alignSelf: 'flex-end' }}>
        <label htmlFor="chatbot-select" style={{ marginRight: 8 }}>
          Chatbot:
        </label>
        <select
          id="chatbot-select"
          style={{ padding: 6, borderRadius: 6, border: '1px solid #ccc' }}
          value={currentChatbot}
          onChange={(e) => {
            setCurrentChatbot(Number(e.target.value));
          }}
        >
          <option value={0} />
          {localChatbots.map((chatbot) => (
            <option key={chatbot.id} value={chatbot.id}>
              {chatbot.name}
            </option>
          ))}
        </select>
      </div>
      <div style={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.button}>
          Send
        </button>
      </div>
      <button onClick={handleNewChat} style={styles.newChatButton}>
        ➕ New Chat
      </button>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'sans-serif',
    maxWidth: 600,
    margin: '20px auto',
    border: '1px solid #ccc',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    height: '80vh',
    backgroundColor: '#fff',
  },
  chatWindow: {
    flex: 1,
    padding: 10,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  message: {
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  inputArea: {
    display: 'flex',
    padding: 10,
    borderTop: '1px solid #ccc',
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ccc',
    marginRight: 10,
  },
  button: {
    padding: '10px 16px',
    borderRadius: 8,
    border: 'none',
    background: '#10a37f',
    color: 'white',
    cursor: 'pointer',
  },
  newChatButton: {
    padding: '10px 16px',
    borderRadius: 8,
    border: 'none',
    background: '#007bff',
    color: 'white',
    cursor: 'pointer',
    marginTop: 10,
  },
};

export default AiClient;
