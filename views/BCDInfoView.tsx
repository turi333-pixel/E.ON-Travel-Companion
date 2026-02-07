
import React from 'react';
import { EMERGENCY_CONTACTS } from '../constants';

const BCDInfoView: React.FC = () => {
  const bcd = EMERGENCY_CONTACTS.BCD_TRAVEL;

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <i className="fas fa-plane absolute top-[-20px] right-[-20px] text-8xl opacity-10 -rotate-12"></i>
        <h2 className="text-2xl font-bold mb-1">BCD Travel Hub</h2>
        <p className="text-blue-100 text-sm">Your primary contact for all E.ON bookings and disruptions.</p>
        <div className="mt-6 space-y-3">
          <a href={`tel:${bcd.number}`} className="flex items-center bg-white text-blue-600 w-full py-4 rounded-xl font-bold justify-center shadow-md">
            <i className="fas fa-phone mr-3"></i> Call Main Team
          </a>
          <a href={`mailto:${bcd.email}`} className="flex items-center bg-blue-500 text-white w-full py-4 rounded-xl font-bold justify-center border border-blue-400">
            <i className="fas fa-envelope mr-3"></i> {bcd.email}
          </a>
        </div>
      </div>

      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Urgent Assistance (Out of Hours)</h3>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            For urgent rebookings or cancellations outside 08:30-17:00. Note: Surcharges may apply.
          </p>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-semibold text-slate-700">24/7 Hotline</span>
              <a href={`tel:${bcd.emergency24}`} className="text-blue-600 font-bold text-sm">{bcd.emergency24}</a>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-semibold text-slate-700">Backup Out-of-Hours</span>
              <a href={`tel:${bcd.outOfHours}`} className="text-blue-600 font-bold text-sm">030 40365 2243</a>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Disruption Policy</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start">
            <div className="bg-green-50 text-green-600 p-2 rounded-lg mr-4 mt-1">
              <i className="fas fa-train"></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">DB Train Cancellations</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                If DB cancels, you can usually take alternative trains. Check Concur for seat reservation rebooking.
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start">
            <div className="bg-red-50 text-red-600 p-2 rounded-lg mr-4 mt-1">
              <i className="fas fa-plane-circle-exclamation"></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Flight Delays</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Use BCD & AirHelp link for compensation claims. Call BCD for rebookings on low-cost carriers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-2">Internal Portals</h3>
        <ul className="space-y-3">
          <li className="flex items-center justify-between text-sm">
            <span className="text-slate-600">BCD Booking (Cytric)</span>
            <i className="fas fa-external-link-alt text-slate-400"></i>
          </li>
          <li className="flex items-center justify-between text-sm">
            <span className="text-slate-600">HSE App Support</span>
            <i className="fas fa-external-link-alt text-slate-400"></i>
          </li>
          <li className="flex items-center justify-between text-sm">
             <span className="text-slate-600">Concur Germany</span>
             <a href="tel:08007236433" className="text-blue-600 font-bold">0800 723 6433</a>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default BCDInfoView;
