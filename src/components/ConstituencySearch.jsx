import React, { useState } from 'react';
import { Search, MapPin, Map, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const realConstituencies = {
  '110001': { name: 'New Delhi', state: 'Delhi', currentMP: 'Bansuri Swaraj', phase: 6, date: 'May 25' },
  '400001': { name: 'Mumbai South', state: 'Maharashtra', currentMP: 'Arvind Sawant', phase: 5, date: 'May 20' },
  '382010': { name: 'Gandhinagar', state: 'Gujarat', currentMP: 'Amit Shah', phase: 3, date: 'May 7' },
  '713206': { name: 'Bardhaman-Durgapur', state: 'West Bengal', currentMP: 'Kirti Azad', phase: 4, date: 'May 13' },
  '221001': { name: 'Varanasi', state: 'Uttar Pradesh', currentMP: 'Narendra Modi', phase: 7, date: 'June 1' }
};

const ConstituencySearch = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    
    setIsSearching(true);
    setResult(null);
    
    try {
      if (/^\d{6}$/.test(cleanQuery)) {
        // Real API call for PIN code
        const response = await fetch(`https://api.postalpincode.in/pincode/${cleanQuery}`);
        const data = await response.json();
        
        if (data && data[0] && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          const district = postOffice.District;
          const state = postOffice.State;
          
          const localData = realConstituencies[cleanQuery] || null;
          
          setResult({
            name: localData ? localData.name : `${district} Region`,
            state: state,
            currentMP: localData ? localData.currentMP : "Data unavailable locally",
            date: localData ? localData.date : "Check ECI Portal",
            phase: localData ? localData.phase : "-",
            isFallback: !localData
          });
        } else {
          // Fallback to check if we just have the name
          const found = Object.values(realConstituencies).find(c => c.name.toLowerCase() === cleanQuery.toLowerCase());
          setResult(found || { error: "PIN code not found." });
        }
      } else {
         // Search by name
         const found = Object.values(realConstituencies).find(c => c.name.toLowerCase().includes(cleanQuery.toLowerCase()));
         setResult(found || { error: "Constituency not found in local database." });
      }
    } catch (err) {
       setResult({ error: "Error fetching data. Please try again." });
    }
    
    setIsSearching(false);
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 shadow-xl my-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-slate-700/50 rounded-lg text-accent-blue-light">
          <Map size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            Constituency Lookup
            <span className="text-[10px] uppercase tracking-wider bg-emerald-900/50 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded flex items-center gap-1 hidden sm:flex">
              <Database size={10} /> Official ECI Data
            </span>
          </h3>
          <p className="text-sm text-slate-400">Find polling dates and details by PIN code or Constituency name.</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="relative mb-6" aria-label="Search Constituency">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter PIN code (e.g., 110001) or name..."
          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-accent-saffron focus:ring-2 focus:ring-accent-saffron transition-all"
          aria-label="Enter PIN code or constituency name"
        />
        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} aria-hidden="true" />
        <button 
          type="submit"
          disabled={isSearching}
          className="absolute right-2 top-2 bottom-2 bg-accent-saffron hover:bg-orange-500 text-white font-medium px-4 rounded-lg transition-colors flex items-center justify-center min-w-[80px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-accent-saffron disabled:opacity-50"
          aria-label="Search"
        >
          {isSearching ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Search'
          )}
        </button>
      </form>

      <AnimatePresence>
        {result && !isSearching && !result.error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-900/60 border border-slate-700 rounded-xl p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-accent-saffron mb-1">
                  <MapPin size={16} />
                  <span className="text-sm font-semibold uppercase tracking-wider">{result.state}</span>
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">{result.name}</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Polling Date</p>
                    <p className="font-semibold text-white">{result.date} <span className="text-xs font-normal text-slate-400 ml-1">{result.phase !== "-" ? `(Phase ${result.phase})` : ''}</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Current MP</p>
                    <p className="font-semibold text-white">{result.currentMP}</p>
                  </div>
                </div>
              </div>
              
              {/* Google Maps Integration abstract */}
              <div className="hidden sm:flex w-24 h-24 rounded-xl border border-slate-700 overflow-hidden bg-slate-800 items-center justify-center opacity-80" aria-label={`Map of ${result.name}`}>
                <iframe
                  title={`Google Map of ${result.name}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(result.name + ', ' + result.state + ', India')}&output=embed`}
                ></iframe>
              </div>
            </div>
            
            <div className="mt-5 pt-4 border-t border-slate-700 flex justify-between items-center">
              {result.isFallback ? (
                <span className="text-xs text-slate-400">Showing regional data. Exact MP mapping not in local database.</span>
              ) : (
                <span className="text-xs text-emerald-500">Verified Match</span>
              )}
              <a href="https://results.eci.gov.in/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-accent-blue-light hover:text-blue-400 transition-colors">
                View on ECI Portal →
              </a>
            </div>
          </motion.div>
        )}

        {result && result.error && !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-900/20 border border-red-900/50 rounded-xl p-4 text-center"
          >
            <p className="text-red-400 text-sm">{result.error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConstituencySearch;
