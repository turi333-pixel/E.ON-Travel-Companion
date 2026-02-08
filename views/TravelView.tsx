
import React, { useState, useRef } from 'react';
import { LocationData, FlightStatusData } from '../types';
import LocationCard from '../components/LocationCard';
import { fetchFlightStatus } from '../services/geminiService';

interface TravelViewProps {
  data: LocationData | null;
  loading: boolean;
  onSearch: (city: string) => void;
  onDetectLocation: () => void;
}

// Simple in-memory cache for flight status
const flightCache = new Map<string, { data: FlightStatusData; timestamp: number }>();
const CACHE_DURATION = 120 * 1000; // 120 seconds

const TravelView: React.FC<TravelViewProps> = ({ data, loading, onSearch, onDetectLocation }) => {
  const [query, setQuery] = useState('');
  const [flightNo, setFlightNo] = useState('');
  const [flightDate, setFlightDate] = useState(new Date().toISOString().split('T')[0]);
  const [flightResult, setFlightResult] = useState<FlightStatusData | null>(null);
  const [flightLoading, setFlightLoading] = useState(false);
  const [flightError, setFlightError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  const handleFlightCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFlight = flightNo.trim().toUpperCase();
    if (!cleanFlight) return;

    const cacheKey = `${cleanFlight}-${flightDate}`;
    const cached = flightCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
      setFlightResult(cached.data);
      setFlightError(null);
      return;
    }

    setFlightLoading(true);
    setFlightError(null);
    setFlightResult(null);

    try {
      const result = await fetchFlightStatus(cleanFlight, flightDate);
      setFlightResult(result);
      flightCache.set(cacheKey, { data: result, timestamp: Date.now() });
    } catch (err: any) {
      setFlightError(err.message || "Failed to check flight status. Please try LH123 format.");
    } finally {
      setFlightLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('on time') || s.includes('landed')) return 'text-emerald-600 bg-emerald-50';
    if (s.includes('delay')) return 'text-amber-600 bg-amber-50';
    if (s.includes('cancel')) return 'text-red-600 bg-red-50';
    return 'text-blue-600 bg-blue-50';
  };

  return (
    <div className="p-4 pt-2 space-y-6">
      {/* Flight Status Section */}
      <section className="glass-card rounded-2xl border border-blue-200 overflow-hidden shadow-sm">
        <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center">
            <i className="fas fa-plane-up mr-2"></i> Flight Status
          </h3>
          <span className="text-[10px] text-blue-100 font-medium">Real-time Data</span>
        </div>
        <div className="p-4">
          <form onSubmit={handleFlightCheck} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. LH123"
                  value={flightNo}
                  onChange={(e) => setFlightNo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none uppercase font-bold"
                />
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={flightDate}
                  onChange={(e) => setFlightDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={flightLoading || !flightNo.trim()}
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {flightLoading ? (
                <>
                  <i className="fas fa-spinner animate-spin"></i> Checking...
                </>
              ) : (
                <>
                  <i className="fas fa-search-location"></i> Check Status
                </>
              )}
            </button>
          </form>

          {flightError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg text-[11px] text-red-600 leading-relaxed font-medium">
              <i className="fas fa-circle-info mr-1.5"></i> {flightError}
            </div>
          )}

          {flightResult && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-black text-slate-900">{flightResult.flightNumber}</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${getStatusColor(flightResult.status)}`}>
                  {flightResult.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Departure</p>
                  <p className="text-sm font-bold text-slate-800">{flightResult.departure.airport}</p>
                  <p className="text-xs text-slate-500">
                    Sch: {flightResult.departure.scheduled} 
                    {flightResult.departure.estimated && <span className="text-blue-600 font-bold ml-1">Est: {flightResult.departure.estimated}</span>}
                  </p>
                  {(flightResult.departure.terminal || flightResult.departure.gate) && (
                    <p className="text-[10px] text-slate-400">
                      {flightResult.departure.terminal && `T${flightResult.departure.terminal}`} 
                      {flightResult.departure.gate && ` Gate ${flightResult.departure.gate}`}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Arrival</p>
                  <p className="text-sm font-bold text-slate-800">{flightResult.arrival.airport}</p>
                  <p className="text-xs text-slate-500">
                    Sch: {flightResult.arrival.scheduled}
                    {flightResult.arrival.estimated && <span className="text-blue-600 font-bold ml-1">Est: {flightResult.arrival.estimated}</span>}
                  </p>
                   {(flightResult.arrival.terminal || flightResult.arrival.gate) && (
                    <p className="text-[10px] text-slate-400">
                      {flightResult.arrival.terminal && `T${flightResult.arrival.terminal}`} 
                      {flightResult.arrival.gate && ` Gate ${flightResult.arrival.gate}`}
                    </p>
                  )}
                </div>
              </div>

              {flightResult.sources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {flightResult.sources.slice(0, 2).map((source, i) => (
                      <a key={i} href={source.uri} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 font-medium hover:underline flex items-center">
                        <i className="fas fa-link mr-1 text-[8px]"></i> {source.title.length > 20 ? source.title.substring(0, 20) + '...' : source.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-4 text-[9px] text-slate-400 italic leading-tight">
                Disclaimer: Status is best-effort based on public sources. Please confirm with your airline or airport for critical decisions.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Main Search Bar */}
      <div className="sticky top-0 z-20 py-3 mb-2 bg-slate-50/95 backdrop-blur-sm -mx-4 px-4 border-b border-slate-200/30">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              type="text"
              placeholder="Search destination travel context..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm"
            />
          </div>
          <button
            type="button"
            onClick={onDetectLocation}
            className="bg-blue-600 text-white p-3 rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all"
            title="Use Current Location"
          >
            <i className="fas fa-location-crosshairs"></i>
          </button>
        </form>
      </div>

      {loading && (
        <div className="space-y-4 pt-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-white/60 rounded-xl animate-pulse border border-slate-200/50 shadow-sm"></div>
          ))}
        </div>
      )}

      {data && !loading && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Explore {data.city}</h2>

          {/* E.ON Offices */}
          <section className="mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
              <i className="fas fa-building mr-2 text-red-600"></i> E.ON Offices
            </h3>
            {data.offices.length > 0 ? (
              data.offices.map((office, idx) => (
                <LocationCard
                  key={idx}
                  title={office.name}
                  subtitle={office.address}
                  description={office.hours}
                  meta={office.contacts}
                  icon="fa-briefcase"
                  mapLink={office.mapLink}
                />
              ))
            ) : (
              <p className="text-sm text-slate-400 italic bg-white/50 p-4 rounded-xl border border-dashed border-slate-200">
                No specific E.ON offices found. Showing general travel hub data.
              </p>
            )}
          </section>

          {/* Transport Section */}
          <section className="mb-8 bg-slate-100/80 -mx-4 px-4 py-8 rounded-3xl border-y border-slate-200/50 backdrop-blur-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
              <i className="fas fa-bus-alt mr-2 text-blue-600"></i> Getting Around
            </h3>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4">
              <p className="text-sm text-slate-700 leading-relaxed mb-3">{data.transport.guidance}</p>
              <div className="flex flex-wrap gap-2">
                {data.transport.apps.map((app, i) => (
                  <span key={i} className="bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-slate-200 tracking-wide">
                    {app}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Airport Route</h4>
                <p className="text-sm font-semibold text-slate-800 leading-tight">{data.airport.name}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{data.airport.bestRoute}</p>
                <p className="text-xs text-blue-600 font-bold mt-2">~ {data.airport.approxTime}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tickets</h4>
                <p className="text-xs text-slate-600 leading-tight">{data.transport.ticketInfo}</p>
              </div>
            </div>
          </section>

          {/* Hotels & Dining */}
          <section className="mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
              <i className="fas fa-bed mr-2 text-amber-600"></i> Recommended Hotels
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {data.hotels.map((hotel, idx) => (
                <div key={idx} className="min-w-[260px] bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-amber-50 text-amber-600 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-amber-100">
                      {hotel.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium"><i className="fas fa-star text-amber-400 mr-1"></i>{hotel.rating}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">{hotel.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{hotel.description}</p>
                  <a href={hotel.mapLink} target="_blank" rel="noreferrer" className="inline-block mt-3 text-blue-600 text-xs font-semibold hover:underline">
                    View on Map <i className="fas fa-chevron-right ml-1"></i>
                  </a>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
              <i className="fas fa-utensils mr-2 text-emerald-600"></i> Reliable Dining
            </h3>
            {data.restaurants.map((rest, idx) => (
              <LocationCard
                key={idx}
                title={rest.name}
                subtitle={rest.cuisine}
                description={rest.description}
                icon="fa-plate-wheat"
                mapLink={rest.mapLink}
              />
            ))}
          </section>
        </div>
      )}
    </div>
  );
};

export default TravelView;
