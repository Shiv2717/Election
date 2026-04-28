import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I am your Election Assistant. Ask me anything about the Indian election process.", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInput("");
    setIsTyping(true);

    const lowerInput = userMessage.toLowerCase();
    let botResponse = "";

    // 1. Check Local Knowledge Base First
    if (lowerInput.includes("hello") || lowerInput.includes("hi ") || lowerInput === "hi") {
      botResponse = "Hello! How can I help you today?";
    } else if (lowerInput.includes("register") || lowerInput.includes("form 6") || lowerInput.includes("apply")) {
      botResponse = "To register to vote, you need to fill out Form 6. You can do this online on the official NVSP portal, via the Voter Helpline App, or offline at your local Electoral Registration Office.";
    } else if (lowerInput.includes("date") || lowerInput.includes("when")) {
      botResponse = "The 2024 General Elections were held in 7 phases from April 19 to June 1, 2024. The results were declared on June 4, 2024.";
    } else if (lowerInput.includes("evm") || lowerInput.includes("machine") || lowerInput.includes("vote")) {
      botResponse = "EVM stands for Electronic Voting Machine. To cast your vote, press the blue button next to your chosen candidate's name and symbol. A red light will glow, and you'll hear a long beep confirming your vote. Check the VVPAT slip to verify.";
    } else if (lowerInput.includes("results") || lowerInput.includes("won") || lowerInput.includes("winner")) {
      botResponse = "In the 2024 Lok Sabha Elections, the NDA alliance secured 293 seats, forming the government, while the I.N.D.I.A bloc won 234 seats.";
    } else if (lowerInput.includes("who is") && lowerInput.includes("modi")) {
      botResponse = "Narendra Modi is the current Prime Minister of India, representing the Bharatiya Janata Party (BJP). He secured his third consecutive victory in the 2024 elections from the Varanasi constituency.";
    } else {
      // 2. Fetch from Wikipedia API for general knowledge
      try {
        // Step A: Search for the best matching Wikipedia article title
        const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(userMessage)}&limit=1&namespace=0&format=json&origin=*`);
        const searchData = await searchRes.json();
        
        if (searchData[1] && searchData[1].length > 0) {
          const title = searchData[1][0];
          
          // Step B: Fetch the summary of that article
          const summaryRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
          if (summaryRes.ok) {
            const summaryData = await summaryRes.json();
            if (summaryData.extract) {
              botResponse = summaryData.extract;
            }
          }
        }
      } catch (error) {
        console.error("Wikipedia API fetch failed:", error);
      }

      // 3. Fallback if API fails or no result found
      if (!botResponse) {
        botResponse = "I'm sorry, I couldn't find an answer to that specific question. Try asking me about the Indian election process, voter registration, or EVMs!";
      }
    }

    // Add slight delay to simulate human typing speed
    setTimeout(() => {
      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
      setIsTyping(false);
    }, 600);
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
                    maxWidth: '85%',
                    fontSize: '0.95rem',
                    lineHeight: '1.4'
                  }}
                >
                  {msg.text}
                </div>
              ))}
              
              {isTyping && (
                <div style={{
                  alignSelf: 'flex-start',
                  backgroundColor: 'rgba(51, 65, 85, 0.8)',
                  padding: '1rem',
                  borderRadius: '1rem',
                  borderBottomLeftRadius: '0',
                  display: 'flex',
                  gap: '6px',
                  alignItems: 'center'
                }}>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
              
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
