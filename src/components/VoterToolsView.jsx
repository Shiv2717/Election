import React from 'react';
import { motion } from 'framer-motion';
import EligibilityChecker from './EligibilityChecker';
import RegistrationHelp from './RegistrationHelp';
import StatusChecker from './StatusChecker';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.15,
      delayChildren: 0.1
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const VoterToolsView = () => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}
    >
      <div className="tools-view-header">
        <h2>Interactive Voter Tools</h2>
        <p>
          Use these practical tools to check your eligibility, understand exactly how to register, and verify your name is on the electoral roll.
        </p>
      </div>

      <motion.div variants={itemVariants}>
        <EligibilityChecker />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <RegistrationHelp />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <StatusChecker />
      </motion.div>
    </motion.div>
  );
};

export default VoterToolsView;
