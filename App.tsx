
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppTab, LocationData } from './types';
import BottomNav from './components/BottomNav';
import TodayView from './views/TodayView';
import TravelView from './views/TravelView';
import EmergencyView from './views/EmergencyView';
import BCDInfoView from './views/BCDInfoView';
import { fetchLocationInsights, reverseGeocode } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.TODAY);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Reference to the scrollable main container
  const scrollContainerRef = useRef<HTMLElement>(null);

  // Always reset scroll to top when switching tabs
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, [activeTab]);

  const handleSearch = async (city: string, coords?: { latitude: number; longitude: number }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLocationInsights(city, coords);
      setLocationData(data);
      setActiveTab(AppTab.TODAY);
    } catch (err: any) {
      setError(err.message || "Something went wrong fetching travel data.");
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const cityString = await reverseGeocode(latitude, longitude);
          await handleSearch(cityString, { latitude, longitude });
        } catch (err) {
          await handleSearch("Current Location", { latitude, longitude });
        }
      },
      (err) => {
        setError("Location permission denied. Please enter a city manually.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.TODAY:
        return (
          <TodayView 
            data={locationData} 
            loading={loading} 
            onRefresh={detectLocation} 
            onSearch={handleSearch}
          />
        );
      case AppTab.TRAVEL:
        return (
          <TravelView 
            data={locationData} 
            loading={loading} 
            onSearch={handleSearch} 
            onDetectLocation={detectLocation} 
          />
        );
      case AppTab.EMERGENCY:
        return <EmergencyView />;
      case AppTab.INFO:
        return <BCDInfoView />;
      default:
        return (
          <TodayView 
            data={locationData} 
            loading={loading} 
            onRefresh={detectLocation} 
            onSearch={handleSearch}
          />
        );
    }
  };

  return (
    <div className="h-screen flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Top Header - Using glassmorphism to show pattern */}
      <header className="flex-shrink-0 z-40 glass-header border-b border-slate-200/50 px-6 py-4 flex justify-between items-center h-[72px]">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3 shadow-sm shadow-red-200">
            <i className="fas fa-e text-white font-bold"></i>
          </div>
          <h1 className="font-bold text-slate-900 tracking-tight">Travel Companion</h1>
        </div>
        <div className="text-[10px] font-bold text-slate-500 bg-slate-100/50 px-2 py-1 rounded uppercase tracking-wider">
          Project Services
        </div>
      </header>

      {/* Main Content Area - This is the scroll container */}
      <main 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto relative"
      >
        {/* Error Message inside main to ensure it scrolls or is handled contextually, 
            but here it's better placed just below the header for visibility */}
        {error && (
          <div className="mx-4 mt-4 bg-red-100/90 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-sm z-50 sticky top-4">
            <div className="flex items-center">
              <i className="fas fa-circle-exclamation mr-3 opacity-70"></i>
              <span className="text-xs font-medium">{error}</span>
            </div>
            <button onClick={() => setError(null)} className="ml-2 p-1"><i className="fas fa-times"></i></button>
          </div>
        )}
        
        <div className="pb-24 pt-2">
          {renderContent()}
        </div>
      </main>

      {/* Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
