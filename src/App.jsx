import React, { useState, useEffect } from 'react';
import { ShieldCheck, Layers, Wrench, Activity, Map, Bot, FileSignature } from 'lucide-react';
import gsap from 'gsap';
import StepDetail from './components/StepDetail';
import VoterToolsView from './components/VoterToolsView';
import ChatBot from './components/ChatBot';
import LiveTicker from './components/LiveTicker';
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
    <div className="app-container font-sans bg-slate-900 text-slate-100">
      <LiveTicker />
      
      {/* Background decoration */}
      <div className="bg-decoration-saffron" />
      <div className="bg-decoration-green" />

      <div className="content-wrapper">
        <header className="app-header">
          <div style={{ position: 'absolute', top: '1rem', right: '1.5rem', zIndex: 100 }} id="google_translate_element"></div>
          
          <div className="header-icon-wrapper header-animate">
            <ShieldCheck size={32} />
          </div>
          <h1 className="app-title header-animate font-heading tracking-tight">
            The <span className="gradient-text">Indian Election</span> Process
          </h1>
          <p className="app-subtitle header-animate mb-12">
            Your interactive guide to understanding how the world's largest democracy votes.
          </p>

          {/* Features Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12 header-animate">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-left hover:bg-slate-800 transition-colors">
              <Activity className="text-red-500 mb-3" size={24} />
              <h3 className="text-sm font-bold text-white mb-1">Live Updates</h3>
              <p className="text-xs text-slate-400">Real-time news from major national feeds.</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-left hover:bg-slate-800 transition-colors">
              <Map className="text-accent-blue-light mb-3" size={24} />
              <h3 className="text-sm font-bold text-white mb-1">Constituency Data</h3>
              <p className="text-xs text-slate-400">Search polling & MP details by PIN code.</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-left hover:bg-slate-800 transition-colors">
              <FileSignature className="text-accent-saffron mb-3" size={24} />
              <h3 className="text-sm font-bold text-white mb-1">Voter Tools</h3>
              <p className="text-xs text-slate-400">Check eligibility & registration status easily.</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-left hover:bg-slate-800 transition-colors">
              <Bot className="text-emerald-500 mb-3" size={24} />
              <h3 className="text-sm font-bold text-white mb-1">AI Assistant</h3>
              <p className="text-xs text-slate-400">24/7 automated help for election queries.</p>
            </div>
          </div>

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

      {/* Authority Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/80 backdrop-blur mt-12 py-8 relative z-10">
        <div className="max-w-[1200px] mx-auto px-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm text-slate-400 flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span className="font-semibold text-slate-300">Data source:</span> Election Commission of India (ECI)
            </p>
            <p className="text-xs text-slate-500 mt-1">
              This platform provides supplementary tools for voter awareness. Always verify your status on the official ECI portal.
            </p>
          </div>
          <div className="flex gap-4">
            <a href="https://eci.gov.in/" target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-accent-blue-light hover:underline">
              Official ECI Website
            </a>
            <a href="https://voters.eci.gov.in/" target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-accent-blue-light hover:underline">
              Voter Service Portal
            </a>
          </div>
        </div>
      </footer>
      
      {/* AI Chat Bot */}
      <ChatBot />
    </div>
  );
}

export default App;
