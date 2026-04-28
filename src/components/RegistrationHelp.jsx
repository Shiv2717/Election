import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSignature, FileKey, Globe, Building } from 'lucide-react';

const RegistrationHelp = () => {
  const [activeTab, setActiveTab] = useState('form6');

  const tabs = [
    { id: 'form6', label: 'Form 6 Guide', icon: FileSignature },
    { id: 'docs', label: 'Required Documents', icon: FileKey },
    { id: 'online', label: 'Online Steps', icon: Globe },
    { id: 'offline', label: 'Offline Steps', icon: Building },
  ];

  return (
    <div className="tool-panel" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <h3 className="tool-title" style={{ marginBottom: 0 }}>🪪 Voter Registration Help</h3>
      </div>
      
      {/* Tab Navigation */}
      <div className="tabs-header">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-header-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              {tab.label}
              {isActive && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', backgroundColor: 'var(--accent-saffron)' }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div style={{ padding: '1.5rem' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'form6' && (
            <motion.div
              key="form6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h4 style={{ fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>What is Form 6?</h4>
              <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1rem' }}>
                Form 6 is the application form for the inclusion of a name in the Electoral Roll for a first-time voter or a voter shifting from one constituency to another.
              </p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <li style={{ marginBottom: '0.25rem' }}>Fill in personal details accurately.</li>
                <li style={{ marginBottom: '0.25rem' }}>Ensure family details (if any exist on the roll) are correct.</li>
                <li style={{ marginBottom: '0.25rem' }}>Upload a recent passport-size photograph (online) or paste it (offline).</li>
                <li>Sign the declaration at the end.</li>
              </ul>
            </motion.div>
          )}

          {activeTab === 'docs' && (
            <motion.div
              key="docs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h4 style={{ fontWeight: 600, color: 'white', marginBottom: '0.75rem' }}>Required Documents</h4>
              <div className="docs-grid">
                <div className="doc-card">
                  <span style={{ display: 'block', fontWeight: 500, color: 'var(--accent-blue-light)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Proof of Age (Any One)</span>
                  <ul>
                    <li>Birth Certificate</li>
                    <li>Aadhaar Card</li>
                    <li>PAN Card</li>
                    <li>Driving License</li>
                    <li>Class 10/12 Marksheet</li>
                  </ul>
                </div>
                <div className="doc-card">
                  <span style={{ display: 'block', fontWeight: 500, color: 'var(--accent-green)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Proof of Address (Any One)</span>
                  <ul>
                    <li>Aadhaar Card</li>
                    <li>Water/Electricity/Gas Bill (Recent)</li>
                    <li>Bank Passbook (with photo)</li>
                    <li>Indian Passport</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'online' && (
            <motion.div
              key="online"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ol style={{ position: 'relative', borderLeft: '1px solid var(--border-color)', marginLeft: '0.75rem', paddingLeft: 0, listStyleType: 'none' }}>                  
                <li style={{ marginBottom: '1rem', marginLeft: '1rem', position: 'relative' }}>
                  <div style={{ position: 'absolute', width: '12px', height: '12px', backgroundColor: 'var(--accent-saffron)', borderRadius: '50%', left: '-1.45rem', top: '0.3rem', border: '1px solid var(--bg-color)' }}></div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>Step 1: Visit NVSP</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Go to voters.eci.gov.in and login or sign up.</p>
                </li>
                <li style={{ marginBottom: '1rem', marginLeft: '1rem', position: 'relative' }}>
                  <div style={{ position: 'absolute', width: '12px', height: '12px', backgroundColor: 'var(--accent-saffron)', borderRadius: '50%', left: '-1.45rem', top: '0.3rem', border: '1px solid var(--bg-color)' }}></div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>Step 2: Fill Form 6</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Select "New Voter Registration (Form 6)" and fill in the details.</p>
                </li>
                <li style={{ marginBottom: '1rem', marginLeft: '1rem', position: 'relative' }}>
                  <div style={{ position: 'absolute', width: '12px', height: '12px', backgroundColor: 'var(--accent-saffron)', borderRadius: '50%', left: '-1.45rem', top: '0.3rem', border: '1px solid var(--bg-color)' }}></div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>Step 3: Upload Documents</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Upload scanned copies of age and address proof, and a photo.</p>
                </li>
                <li style={{ marginLeft: '1rem', position: 'relative' }}>
                  <div style={{ position: 'absolute', width: '12px', height: '12px', backgroundColor: 'var(--accent-green)', borderRadius: '50%', left: '-1.45rem', top: '0.3rem', border: '1px solid var(--bg-color)' }}></div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>Step 4: Submit & Track</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Submit the form and save the Reference ID to track status.</p>
                </li>
              </ol>
            </motion.div>
          )}

          {activeTab === 'offline' && (
            <motion.div
              key="offline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--bg-color-light)', fontSize: '0.75rem', fontWeight: 'bold', color: 'white', flexShrink: 0, marginTop: '0.125rem' }}>1</span>
                  <p style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>Obtain two copies of Form 6 from Electoral Registration Officers, Assistant Electoral Registration Officers, or Booth Level Officers (BLO).</p>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--bg-color-light)', fontSize: '0.75rem', fontWeight: 'bold', color: 'white', flexShrink: 0, marginTop: '0.125rem' }}>2</span>
                  <p style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>Fill the form and attach photocopies of your age and address proofs.</p>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--bg-color-light)', fontSize: '0.75rem', fontWeight: 'bold', color: 'white', flexShrink: 0, marginTop: '0.125rem' }}>3</span>
                  <p style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>Submit the filled form back to the ERO, AERO, or BLO, or mail it to the address of the ERO of your constituency.</p>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RegistrationHelp;
