
import React, { useState } from 'react';
import { LocationData } from '../types';

interface TodayViewProps {
  data: LocationData | null;
  loading: boolean;
  onRefresh: () => void;
  onSearch: (city: string) => void;
}

const TodayView: React.FC<TodayViewProps> = ({ data, loading, onRefresh, onSearch }) => {
  const [manualCity, setManualCity] = useState('');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center animate-pulse">
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
          <i className="fas fa-e text-red-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold"></i>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Analyzing Location</h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-[280px]">
          Retrieving office details, travel routes, and cultural insights for your destination...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center shadow-xl shadow-red-200 mb-8 transform -rotate-6">
          <i className="fas fa-e text-white text-4xl font-bold"></i>
        </div>
        
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">Welcome, Colleague</h2>
          <p className="text-slate-500 text-sm leading-relaxed max-w-[280px] mx-auto">
            Your single trusted hub for E.ON business travel. Let's find your destination.
          </p>
        </div>

        <div className="w-full space-y-4 max-w-xs">
          <button
            onClick={onRefresh}
            className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-100 flex items-center justify-center gap-3 hover:bg-red-700 active:scale-[0.98] transition-all"
          >
            <i className="fas fa-location-crosshairs text-lg"></i>
            Use Current Location (GPS)
          </button>

          <div className="relative py-4 flex items-center">
            <div className="flex-grow border-t border-slate-300/30"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-slate-300/30"></div>
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); if(manualCity.trim()) onSearch(manualCity); }}
            className="space-y-3"
          >
            <div className="relative">
              <i className="fas fa-city absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                placeholder="Enter city or office..."
                value={manualCity}
                onChange={(e) => setManualCity(e.target.value)}
                className="w-full bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900"
              />
            </div>
            <button
              type="submit"
              disabled={!manualCity.trim()}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Start Planning
            </button>
          </form>
        </div>

        <p className="mt-12 text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2 bg-slate-100/50 px-3 py-1 rounded-full">
          <i className="fas fa-lock text-[8px]"></i> Secured for E.ON Project Services
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Weather Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <p className="text-blue-100 font-bold uppercase text-[10px] tracking-widest mb-1 opacity-80">Current Weather</p>
            <h2 className="text-3xl font-bold tracking-tight">{data.city}</h2>
            <p className="text-blue-200 text-sm font-medium">{data.weather.condition}</p>
          </div>
          <div className="text-right">
            <span className="text-5xl font-light tracking-tighter">{data.weather.currentTemp}°</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-blue-500/30 relative z-10">
          {data.weather.forecast.slice(0, 3).map((f, i) => (
            <div key={i} className="text-center">
              <p className="text-[10px] font-bold text-blue-200 mb-1 uppercase tracking-wider">{f.day}</p>
              <p className="text-lg font-bold">{f.temp}°</p>
              <p className="text-[10px] text-blue-100 font-medium opacity-70">{f.condition}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Local Cultural Guide */}
      <section className="glass-card rounded-2xl border border-slate-200/50 overflow-hidden shadow-sm">
        <div className="bg-red-50/50 px-4 py-3 border-b border-red-100/50 flex items-center justify-between">
          <h3 className="text-[10px] font-bold text-red-700 uppercase tracking-widest">Local Cultural Guide</h3>
          <i className="fas fa-earth-americas text-red-600 opacity-40"></i>
        </div>
        <div className="p-5 space-y-5">
          <div className="flex items-start">
            <div className="w-9 h-9 rounded-xl bg-blue-50/80 text-blue-600 flex items-center justify-center mr-4 shrink-0 shadow-sm border border-blue-100/50">
              <i className="fas fa-handshake text-sm"></i>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Social Etiquette</h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{data.culture.etiquette}</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-9 h-9 rounded-xl bg-emerald-50/80 text-emerald-600 flex items-center justify-center mr-4 shrink-0 shadow-sm border border-emerald-100/50">
              <i className="fas fa-briefcase text-sm"></i>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Business Norms</h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{data.culture.businessNorms}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100/50">
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1.5">Useful Phrase</p>
              <p className="text-base font-bold text-slate-900 tracking-tight">"{data.culture.usefulPhrase.phrase}"</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-xs text-slate-600 font-bold">{data.culture.usefulPhrase.meaning}</span>
                <span className="text-[10px] text-slate-400 font-medium italic">[{data.culture.usefulPhrase.pronunciation}]</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Logistics */}
      <section>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Key Logistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4 rounded-2xl border border-slate-200/50 shadow-sm">
            <i className="fas fa-plane-arrival text-blue-500 mb-2"></i>
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-tight">Airport</h4>
            <p className="text-[11px] text-slate-500 truncate font-medium mt-1">{data.airport.name}</p>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-200/50 shadow-sm">
            <i className="fas fa-train text-emerald-500 mb-2"></i>
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-tight">Transport</h4>
            <p className="text-[11px] text-slate-500 truncate font-medium mt-1">{data.transport.apps[0] || 'Local Apps'}</p>
          </div>
        </div>
      </section>

      {/* Practical Dining Advice */}
      <section className="bg-amber-50/80 backdrop-blur-sm rounded-2xl p-5 border border-amber-100/50 shadow-sm">
        <div className="flex items-center mb-3">
          <i className="fas fa-utensils text-amber-600 mr-3 text-sm"></i>
          <h4 className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">Dining & Tipping</h4>
        </div>
        <p className="text-xs text-amber-900/80 leading-relaxed font-medium">{data.culture.diningCustoms}</p>
      </section>

      <div className="pt-4 pb-8">
        <button 
          onClick={onRefresh}
          className="w-full py-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-red-600 transition-colors flex items-center justify-center gap-2 border border-dashed border-slate-200 rounded-xl bg-white/30"
        >
          <i className="fas fa-arrows-rotate text-[8px]"></i> Update Location Context
        </button>
      </div>
    </div>
  );
};

export default TodayView;
