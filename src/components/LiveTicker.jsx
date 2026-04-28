import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

const LiveTicker = React.memo(() => {
  const [newsUpdates, setNewsUpdates] = useState(["Loading live news..."]);
  const [currentUpdate, setCurrentUpdate] = useState(0);

  useEffect(() => {
    // Fetch live news using an open RSS-to-JSON API targeting NDTV or a major Indian news feed
    const fetchNews = async () => {
      try {
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://feeds.feedburner.com/ndtvnews-top-stories');
        const data = await response.json();
        
        if (data?.status === 'ok' && data?.items?.length > 0) {
          const headlines = data.items.slice(0, 10).map(item => `LIVE: ${item.title}`);
          setNewsUpdates(headlines);
        } else {
          setNewsUpdates(["LIVE: Failed to fetch the latest news updates. Check your connection."]);
        }
      } catch (error) {
        console.error("LiveTicker Error:", error);
        setNewsUpdates(["LIVE: Error loading live feed."]);
      }
    };

    fetchNews();
    
    // Refresh news every 10 minutes
    const fetchInterval = setInterval(fetchNews, 600000); 
    return () => clearInterval(fetchInterval);
  }, []);

  useEffect(() => {
    const tickerInterval = setInterval(() => {
      setCurrentUpdate((prev) => (prev + 1) % newsUpdates.length);
    }, 6000); // Change message every 6 seconds

    return () => clearInterval(tickerInterval);
  }, [newsUpdates]);

  return (
    <div 
      className="bg-red-600 text-white py-2 px-4 flex items-center justify-center font-sans shadow-md border-b border-red-700 relative z-50"
      role="region"
      aria-live="polite"
      aria-label="Live Election News Updates"
    >
      <div className="max-w-[1200px] w-full flex items-center gap-3">
        <div 
          className="flex items-center gap-2 bg-white text-red-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider animate-pulse whitespace-nowrap"
          aria-hidden="true"
        >
          <Activity size={14} />
          Live Updates
        </div>
        <div className="overflow-hidden flex-1 relative h-6">
          <div 
            key={currentUpdate}
            className="absolute left-0 w-full animate-[slideUp_0.5s_ease-out_forwards] truncate text-sm font-medium"
          >
            {newsUpdates[currentUpdate]}
          </div>
        </div>
      </div>
    </div>
  );
});

LiveTicker.displayName = 'LiveTicker';

export default LiveTicker;
