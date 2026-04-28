import React, { useState } from 'react';
import { Users, BookOpen, Briefcase, Award, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const realCandidates = {
  cand1: {
    name: 'Narendra Modi',
    party: 'BJP (NDA)',
    education: 'M.A. Political Science (Gujarat Univ.)',
    experience: 'PM (2014-Present), CM Gujarat (2001-2014)',
    keyPromises: ['Make India 3rd Largest Economy', 'Infrastructure & Kashi Corridor Dev', 'Modernization of Transport'],
    color: 'bg-accent-saffron'
  },
  cand2: {
    name: 'Ajay Rai',
    party: 'INC (I.N.D.I.A.)',
    education: 'Graduate (Kashi Vidyapeeth)',
    experience: '5-Time Former MLA, UPCC President',
    keyPromises: ['Tackle Local Unemployment', 'Control Inflation', 'Better Local Governance'],
    color: 'bg-accent-blue-light'
  }
};

const CandidateComparison = () => {
  const [selectedCandidates, setSelectedCandidates] = useState(['cand1', 'cand2']);

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 shadow-xl my-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-700/50 rounded-lg text-emerald-400">
          <Users size={24} />
        </div>
        <div>
          <h3 className="text-xl font-heading font-bold text-white">Varanasi 2024: Key Candidates</h3>
          <p className="text-sm text-slate-400">Comparing top candidates from the recent election.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {selectedCandidates.map((id, index) => {
          const candidate = realCandidates[id];
          return (
            <motion.div 
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-slate-900/60 rounded-xl p-5 border border-slate-700 hover:border-slate-500 transition-colors"
            >
              <div className="flex items-center justify-between mb-4 border-b border-slate-700/50 pb-4">
                <div>
                  <h4 className="text-lg font-bold text-white">{candidate.name}</h4>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold text-white mt-1 ${candidate.color}`}>
                    {candidate.party}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700">
                  <Users className="text-slate-400" size={20} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BookOpen size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Education</p>
                    <p className="text-sm text-white">{candidate.education}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Briefcase size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Experience</p>
                    <p className="text-sm text-white">{candidate.experience}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Key Promises</p>
                    <ul className="space-y-1">
                      {candidate.keyPromises.map((promise, i) => (
                        <li key={i} className="text-sm text-white flex items-center gap-1.5">
                          <CheckCircle size={12} className="text-emerald-400" />
                          {promise}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CandidateComparison;
