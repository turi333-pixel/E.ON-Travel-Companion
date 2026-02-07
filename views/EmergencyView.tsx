
import React from 'react';
import { EMERGENCY_CONTACTS, OFFICE_QUICK_LINKS } from '../constants';

const EmergencyView: React.FC = () => {
  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-6">
        <h2 className="text-red-700 font-bold text-xl mb-2 flex items-center">
          <i className="fas fa-circle-exclamation mr-3 animate-pulse"></i> 
          Immediate Support
        </h2>
        <p className="text-red-600 text-sm leading-relaxed">
          Critical situation? Call the international emergency line or local services immediately.
        </p>
      </div>

      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">E.ON Global Support</h3>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-bold text-slate-900">{EMERGENCY_CONTACTS.GLOBAL_MEDICAL.name}</h4>
              <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold">24/7</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">{EMERGENCY_CONTACTS.GLOBAL_MEDICAL.description}</p>
            <a href={`tel:${EMERGENCY_CONTACTS.GLOBAL_MEDICAL.number}`} className="flex items-center justify-center bg-red-600 text-white w-full py-3 rounded-xl font-bold shadow-md hover:bg-red-700 transition-all">
              <i className="fas fa-phone mr-3"></i> {EMERGENCY_CONTACTS.GLOBAL_MEDICAL.number}
            </a>
          </div>
          <div className="p-4 bg-slate-50 text-xs text-slate-500 flex justify-between">
            <span>Contract: <strong>{EMERGENCY_CONTACTS.GLOBAL_MEDICAL.contractNo}</strong></span>
            <span>Security: <strong>Global Line</strong></span>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">International SOS</h3>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-start mb-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg mr-4">
              <i className="fas fa-shield-heart text-lg"></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-900">ISOS Assistance</h4>
              <p className="text-xs text-slate-500">Membership Required</p>
            </div>
          </div>
          <div className="bg-slate-100 p-3 rounded-lg mb-4 flex justify-between items-center">
            <span className="text-xs text-slate-600">ID: <strong>{EMERGENCY_CONTACTS.INTERNATIONAL_SOS.membership}</strong></span>
            <button 
              onClick={() => navigator.clipboard.writeText(EMERGENCY_CONTACTS.INTERNATIONAL_SOS.membership)}
              className="text-blue-600 text-[10px] font-bold uppercase"
            >
              Copy
            </button>
          </div>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed italic">
            "{EMERGENCY_CONTACTS.INTERNATIONAL_SOS.description}"
          </p>
          <a href={EMERGENCY_CONTACTS.INTERNATIONAL_SOS.appLink} target="_blank" rel="noreferrer" className="block text-center border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all">
            Open Assistance App
          </a>
        </div>
      </section>

      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Other Critical Lines</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h4 className="text-sm font-bold text-slate-900">{EMERGENCY_CONTACTS.EU_EMERGENCY.name}</h4>
              <p className="text-xs text-slate-500">{EMERGENCY_CONTACTS.EU_EMERGENCY.description}</p>
            </div>
            <a href={`tel:${EMERGENCY_CONTACTS.EU_EMERGENCY.number}`} className="bg-slate-100 text-slate-700 p-3 rounded-full font-bold h-12 w-12 flex items-center justify-center">
              112
            </a>
          </div>
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h4 className="text-sm font-bold text-slate-900">{EMERGENCY_CONTACTS.THEFT_HOTLINE.name}</h4>
              <p className="text-xs text-slate-500">{EMERGENCY_CONTACTS.THEFT_HOTLINE.description}</p>
            </div>
            <a href={`tel:${EMERGENCY_CONTACTS.THEFT_HOTLINE.number}`} className="bg-slate-100 text-slate-700 p-2 px-3 rounded-xl font-bold h-12 flex items-center justify-center">
              116 116
            </a>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Location Specific</h3>
        <div className="bg-slate-800 text-white p-5 rounded-2xl shadow-xl">
          <h4 className="font-bold mb-1">{OFFICE_QUICK_LINKS.RUHR_TECH.name}</h4>
          <p className="text-xs text-slate-400 mb-4">Essen, Ruhr Tech Campus</p>
          <div className="space-y-3">
             <a href={`tel:${OFFICE_QUICK_LINKS.RUHR_TECH.emergency}`} className="flex justify-between items-center bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all">
               <span className="text-sm font-medium">HSE Emergency Call</span>
               <i className="fas fa-chevron-right text-slate-500"></i>
             </a>
             <div className="bg-red-500/20 border border-red-500/30 p-3 rounded-xl text-xs">
               <strong>Chain:</strong> Call 112, then dial 0201-844 51 0000 internally.
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmergencyView;
