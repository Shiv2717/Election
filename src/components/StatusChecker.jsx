import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const StatusChecker = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="tool-panel">
      <h3 className="tool-title">🔍 Voter Status Checker</h3>
      
      <p className="tool-desc">
        Already registered? Make sure your name is actually on the electoral roll before voting day. You can search by your EPIC number, details, or mobile number.
      </p>

      <a 
        href="https://electoralsearch.eci.gov.in/" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          backgroundColor: 'var(--accent-saffron)', color: 'white', fontWeight: 600,
          padding: '0.75rem 1.5rem', borderRadius: '0.5rem', transition: 'all 0.3s ease',
          boxShadow: '0 4px 14px 0 rgba(255, 153, 51, 0.3)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#e68a2e';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--accent-saffron)';
          e.currentTarget.style.transform = 'none';
        }}
      >
        <Search size={18} />
        Check Electoral Roll Online
      </a>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="accordion-btn group"
      >
        <div className="title">
          <AlertCircle size={18} />
          <span>Name missing from the list?</span>
        </div>
        {isOpen ? <ChevronUp size={18} className="accordion-icon" /> : <ChevronDown size={18} className="accordion-icon" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingTop: '1rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
              <p style={{ marginBottom: '0.75rem' }}>If you have registered but cannot find your name, follow these steps:</p>
              <ol style={{ listStyleType: 'decimal', paddingLeft: '1.25rem', marginBottom: '1rem' }}>
                <li style={{ marginBottom: '0.5rem' }}><strong>Check Application Status:</strong> If you recently applied via Form 6, check the application status on the NVSP portal using your Reference ID. It might still be under processing.</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Search Variations:</strong> Try searching by alternative details (e.g., if searching by EPIC fails, try searching by your exact details or mobile number).</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Contact BLO:</strong> Locate your Booth Level Officer (BLO) through the ECI portal and contact them for clarification.</li>
                <li><strong>Re-apply:</strong> If your application was rejected or it has been a very long time, you may need to fill out Form 6 again.</li>
              </ol>
              <div style={{ backgroundColor: 'rgba(51, 65, 85, 0.5)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(71, 85, 105, 0.5)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--accent-saffron)' }}>Tip:</strong> The electoral rolls are continuously updated. A special summary revision is done every year around November-December. Ensure you check the draft roll published then.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StatusChecker;
