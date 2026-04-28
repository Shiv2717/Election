import React from 'react';
import { motion } from 'framer-motion';

const Timeline = ({ steps, activeStepId }) => {
  const handleStepClick = (id) => {
    const element = document.getElementById(`step-${id}`);
    if (element) {
      // Get the element's position relative to the viewport
      const y = element.getBoundingClientRect().top + window.scrollY - 100; // Offset for header/padding
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="timeline-container">
      {/* Connecting Line */}
      <div className="timeline-line" />

      <div className="timeline-steps">
        {steps.map((step, index) => {
          const isActive = step.id === activeStepId;
          
          return (
            <div 
              key={step.id}
              className={`timeline-step ${isActive ? 'active' : ''}`}
              onClick={() => handleStepClick(step.id)}
            >
              {/* Timeline Node */}
              <div className="timeline-node-wrapper">
                <motion.div 
                  className="timeline-node"
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    boxShadow: isActive ? '0 0 15px rgba(255, 153, 51, 0.5)' : 'none'
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Step Info */}
              <div className="timeline-step-info">
                <h3 className="timeline-step-title">
                  Step {index + 1}: {step.title}
                </h3>
                <p className="timeline-step-date">{step.timeline}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
