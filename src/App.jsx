import React, { useState, useEffect } from 'react';
import { ShieldCheck, Layers, Wrench } from 'lucide-react';
import gsap from 'gsap';
import StepDetail from './components/StepDetail';
import VoterToolsView from './components/VoterToolsView';
import ChatBot from './components/ChatBot';
import { electionSteps } from './data/electionSteps';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('timeline');

  useEffect(() => {
    // Initial GSAP animation for header
    gsap.fromTo('.header-animate', 
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="app-container">
      {/* Background decoration */}
      <div className="bg-decoration-saffron" />
      <div className="bg-decoration-green" />

      <div className="content-wrapper">
        <header className="app-header">
          <div style={{ position: 'absolute', top: '1rem', right: '1.5rem', zIndex: 100 }} id="google_translate_element"></div>
          
          <div className="header-icon-wrapper header-animate">
            <ShieldCheck size={32} />
          </div>
          <h1 className="app-title header-animate">
            The <span className="gradient-text">Indian Election</span> Process
          </h1>
          <p className="app-subtitle header-animate mb-8">
            Your interactive guide to understanding how the world's largest democracy votes.
          </p>

          {/* View Switcher Tabs */}
          <div className="tab-switcher-container header-animate">
            <div className="tab-switcher-wrapper">
              <button
                onClick={() => setCurrentView('timeline')}
                className={`tab-btn ${currentView === 'timeline' ? 'active-timeline' : ''}`}
              >
                <Layers size={18} />
                Election Timeline
              </button>
              <button
                onClick={() => setCurrentView('tools')}
                className={`tab-btn ${currentView === 'tools' ? 'active-tools' : ''}`}
              >
                <Wrench size={18} />
                Interactive Tools
              </button>
            </div>
          </div>
        </header>

        <div className="single-column-layout">
          {currentView === 'timeline' ? (
            <div className="main-content">
              {electionSteps.map((step, index) => (
                <StepDetail key={step.id} step={step} index={index + 1} />
              ))}
            </div>
          ) : (
            <VoterToolsView />
          )}
        </div>
      </div>
      
      {/* AI Chat Bot */}
      <ChatBot />
    </div>
  );
}

export default App;
