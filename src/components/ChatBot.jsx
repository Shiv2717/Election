import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I am your Election Assistant. Ask me anything about the Indian election process.", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { text: input, isBot: false }];
    setMessages(newMessages);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      let botResponse = "I'm still learning, but you can find a lot of information in the steps above!";
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes("register") || lowerInput.includes("form 6")) {
        botResponse = "To register, you need to fill Form 6. You can do this online on the NVSP portal or via the Voter Helpline app.";
      } else if (lowerInput.includes("date") || lowerInput.includes("when")) {
        botResponse = "Election dates are announced by the Election Commission of India. Check the 'Election Announcement' step for details.";
      } else if (lowerInput.includes("evm") || lowerInput.includes("machine")) {
        botResponse = "EVM stands for Electronic Voting Machine. You press the blue button next to your candidate's name to cast your vote.";
      } else if (lowerInput.includes("results") || lowerInput.includes("win")) {
        botResponse = "Results are declared after counting. The candidate with the most valid votes wins the constituency.";
      }

      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="chatbot-fab"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: 'var(--accent-saffron)',
          color: 'white',
          padding: '1rem',
          borderRadius: '50%',
          border: 'none',
          boxShadow: '0 4px 12px rgba(255, 153, 51, 0.4)',
          cursor: 'pointer',
          zIndex: 50,
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s ease',
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="chatbot-window glass-panel"
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              width: '350px',
              height: '500px',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 50,
              padding: '0',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(30, 41, 59, 0.9)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageCircle size={20} color="var(--accent-saffron)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>AI Assistant</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  style={{
                    alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                    backgroundColor: msg.isBot ? 'rgba(51, 65, 85, 0.8)' : 'var(--accent-blue-light)',
                    padding: '0.75rem 1rem',
                    borderRadius: '1rem',
                    borderBottomLeftRadius: msg.isBot ? '0' : '1rem',
                    borderBottomRightRadius: msg.isBot ? '1rem' : '0',
                    maxWidth: '80%',
                    fontSize: '0.95rem'
                  }}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form 
              onSubmit={handleSend}
              style={{
                padding: '1rem',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                gap: '0.5rem',
                backgroundColor: 'rgba(30, 41, 59, 0.9)'
              }}
            >
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-color)',
                  color: 'white',
                  outline: 'none'
                }}
              />
              <button 
                type="submit"
                style={{
                  backgroundColor: 'var(--accent-saffron)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0 1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
