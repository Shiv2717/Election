import React, { useState } from 'react';
import { Search, MapPin, Map, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPoliticalInfoForPin } from '../data/politicalLookup';

const ConstituencySearch = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const cleanQuery = query.replace(/\s+/g, '').trim();
    if (!cleanQuery) return;

    if (!/^\d{6}$/.test(cleanQuery)) {
      setResult({ error: 'Please enter a valid 6-digit Indian PIN code.' });
      return;
    }
    
    setIsSearching(true);
    setResult(null);
    
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${cleanQuery}`);
      const data = await response.json();
      const postOffices = data?.[0]?.PostOffice?.map((office) => ({
        name: office.Name || 'Unknown office',
        branchType: office.BranchType || 'N/A',
        deliveryStatus: office.DeliveryStatus || 'N/A',
        district: office.District || 'N/A',
        division: office.Division || 'N/A',
        region: office.Region || 'N/A',
        state: office.State || 'N/A',
        circle: office.Circle || 'N/A',
        country: office.Country || 'India',
        pincode: office.Pincode || cleanQuery
      })) || [];

      if (data?.[0]?.Status === 'Success' && postOffices.length > 0) {
        const firstOffice = postOffices[0];
        const deliveryCount = postOffices.filter((office) => office.deliveryStatus.toLowerCase() === 'delivery').length;
        const politicalInfo = await getPoliticalInfoForPin(cleanQuery);

        setResult({
          pincode: cleanQuery,
          district: firstOffice.district,
          state: firstOffice.state,
          region: firstOffice.region,
          circle: firstOffice.circle,
          country: firstOffice.country,
          constituency: politicalInfo?.constituency || 'Not mapped',
          currentMp: politicalInfo?.mpName || 'Unavailable',
          currentParty: politicalInfo?.party || 'Unavailable',
          isVacant: politicalInfo?.isVacant || false,
          hasPoliticalData: Boolean(politicalInfo),
          totalOffices: postOffices.length,
          deliveryCount,
          offices: postOffices
        });
      } else {
        setResult({ error: 'No post office data found for this PIN code.' });
      }
    } catch (err) {
      setResult({ error: 'Error fetching India Post data. Please try again.' });
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
            All India PIN Lookup
            <span className="text-[10px] uppercase tracking-wider bg-emerald-900/50 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded inline-flex items-center gap-1">
              <Database size={10} /> India Post Data
            </span>
          </h3>
          <p className="text-sm text-slate-400">Search any valid Indian PIN code to see every post office mapped to that location.</p>
          <p className="text-xs text-slate-500 mt-1">The same search also returns the current Lok Sabha constituency and MP when the pin is mapped.</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="relative mb-6" aria-label="Search PIN Code">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a 6-digit PIN code (e.g., 110001)"
          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-accent-saffron focus:ring-2 focus:ring-accent-saffron transition-all"
          aria-label="Enter Indian PIN code"
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
                <h4 className="text-2xl font-bold text-white mb-4">PIN Code {result.pincode}</h4>

                <div className="mb-5 rounded-xl border border-slate-700 bg-slate-950/50 p-4">
                  <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Current MP</span>
                    <span className={`text-[11px] uppercase tracking-wider px-2 py-1 rounded-full border ${result.isVacant ? 'border-amber-500/40 bg-amber-500/10 text-amber-400' : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'}`}>
                      {result.isVacant ? 'Vacant seat' : 'Sitting member'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="rounded-lg bg-slate-900/70 border border-slate-700 p-3">
                      <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Lok Sabha constituency</p>
                      <p className="text-sm font-semibold text-white">{result.constituency}</p>
                    </div>
                    <div className="rounded-lg bg-slate-900/70 border border-slate-700 p-3">
                      <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Current MP</p>
                      <p className="text-sm font-semibold text-white">{result.currentMp}</p>
                    </div>
                    <div className="rounded-lg bg-slate-900/70 border border-slate-700 p-3">
                      <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Party</p>
                      <p className="text-sm font-semibold text-white">{result.currentParty}</p>
                    </div>
                  </div>

                  {!result.hasPoliticalData && (
                    <p className="mt-3 text-xs text-amber-400">Political mapping was not found for this PIN, but the postal data is still shown below.</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">District</p>
                    <p className="font-semibold text-white">{result.district}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">State</p>
                    <p className="font-semibold text-white">{result.state}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Post Offices</p>
                    <p className="font-semibold text-white">{result.totalOffices}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Delivery Offices</p>
                    <p className="font-semibold text-white">{result.deliveryCount}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
                  <span className="rounded-full bg-slate-800 px-3 py-1">Region: {result.region}</span>
                  <span className="rounded-full bg-slate-800 px-3 py-1">Circle: {result.circle}</span>
                  <span className="rounded-full bg-slate-800 px-3 py-1">Country: {result.country}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-xs text-slate-400">All post offices returned for this PIN code</span>
                <span className="text-xs text-emerald-500 font-medium">Nationwide coverage</span>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {result.offices.map((office, index) => (
                  <div key={`${office.name}-${index}`} className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h5 className="text-white font-semibold">{office.name}</h5>
                        <p className="text-xs text-slate-400 mt-1">
                          {office.branchType} · {office.deliveryStatus}
                        </p>
                      </div>
                      <span className="text-[11px] text-accent-saffron bg-accent-saffron/10 border border-accent-saffron/30 rounded-full px-2 py-1 whitespace-nowrap">
                        {office.pincode}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-400 sm:grid-cols-2">
                      <span>Division: {office.division}</span>
                      <span>Region: {office.region}</span>
                      <span>District: {office.district}</span>
                      <span>Circle: {office.circle}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-5 pt-4 border-t border-slate-700 flex justify-between items-center gap-3 flex-wrap">
              <span className="text-xs text-slate-400">Showing India Post location data for this PIN code.</span>
              <a href="https://www.indiapost.gov.in/VAS/Pages/LocatePostOffices.aspx" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-accent-blue-light hover:text-blue-400 transition-colors">
                View on India Post →
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
