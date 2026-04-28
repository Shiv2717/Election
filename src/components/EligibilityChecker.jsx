import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

const EligibilityChecker = () => {
  const [answers, setAnswers] = useState({
    citizen: null,
    age: null,
    resident: null
  });

  const handleSelect = (question, value) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const isComplete = answers.citizen !== null && answers.age !== null && answers.resident !== null;
  const isEligible = answers.citizen && answers.age && answers.resident;

  return (
    <div className="tool-panel">
      <h3 className="tool-title">✅ Quick Eligibility Checker</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Question 1 */}
        <div className="question-group">
          <p className="question-text">1. Are you an Indian citizen?</p>
          <div className="btn-group">
            <button 
              onClick={() => handleSelect('citizen', true)}
              className={`check-btn ${answers.citizen === true ? 'yes-active' : ''}`}
            >Yes</button>
            <button 
              onClick={() => handleSelect('citizen', false)}
              className={`check-btn ${answers.citizen === false ? 'no-active' : ''}`}
            >No</button>
          </div>
        </div>

        {/* Question 2 */}
        <div className="question-group">
          <p className="question-text">2. Are you 18 years or older as of January 1st?</p>
          <div className="btn-group">
            <button 
              onClick={() => handleSelect('age', true)}
              className={`check-btn ${answers.age === true ? 'yes-active' : ''}`}
            >Yes</button>
            <button 
              onClick={() => handleSelect('age', false)}
              className={`check-btn ${answers.age === false ? 'no-active' : ''}`}
            >No</button>
          </div>
        </div>

        {/* Question 3 */}
        <div className="question-group">
          <p className="question-text">3. Are you an ordinary resident of the polling area where you wish to enroll?</p>
          <div className="btn-group">
            <button 
              onClick={() => handleSelect('resident', true)}
              className={`check-btn ${answers.resident === true ? 'yes-active' : ''}`}
            >Yes</button>
            <button 
              onClick={() => handleSelect('resident', false)}
              className={`check-btn ${answers.resident === false ? 'no-active' : ''}`}
            >No</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isComplete && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`result-box ${isEligible ? 'eligible' : 'not-eligible'}`}
          >
            {isEligible ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
                {isEligible ? "You are Eligible!" : "Not Eligible"}
              </h4>
              <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                {isEligible 
                  ? "Great! You meet the basic criteria. Please proceed to fill out Form 6 to register for your Voter ID." 
                  : "Unfortunately, you must meet all three criteria (Citizen, 18+, and Resident) to vote in Indian elections."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EligibilityChecker;
