import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './index.css';

function App() {
  const [messages, setMessages] = useState([
    { text: "Greetings, student. I am your DSA Instructor. Ask me about algorithms and data structures, and DO NOT waste my time with irrelevance.", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      const botMessage = {
        text: data.reply || "Error: No response received.",
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { text: "Error: Could not connect to the instructor.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-icon">⚡</div>
        <div className="header-info">
          <h1>DSA Instructor</h1>
          <p>Premium Learning Assistant</p>
        </div>
      </div>

      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.sender}`}>
            <div className="avatar">
              {msg.sender === 'bot' ? '🤖' : '👤'}
            </div>
            <div className="message-bubble">
              {msg.sender === 'bot' ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message-wrapper bot">
            <div className="avatar">🤖</div>
            <div className="message-bubble">
              <div className="loading-dots">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about DSA..."
            disabled={loading}
          />
        </div>
        <button onClick={handleSend} disabled={loading || !input.trim()}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default App;
