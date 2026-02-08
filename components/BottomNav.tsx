
import React from 'react';
import { AppTab } from '../types';

interface BottomNavProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: AppTab.TODAY, icon: 'fa-calendar-day', label: 'Today' },
    { id: AppTab.TRAVEL, icon: 'fa-map-marked-alt', label: 'Travel' },
    { id: AppTab.EMERGENCY, icon: 'fa-shield-halved', label: 'Emergency' },
    { id: AppTab.INFO, icon: 'fa-circle-info', label: 'BCD Info' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 safe-bottom z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full transition-all ${
              activeTab === tab.id ? 'text-blue-600 scale-105' : 'text-slate-400 opacity-70'
            }`}
          >
            <i className={`fas ${tab.icon} text-lg mb-1`}></i>
            <span className="text-[9px] font-bold uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
