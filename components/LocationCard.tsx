
import React from 'react';

interface LocationCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  meta?: string;
  icon: string;
  mapLink?: string;
}

const LocationCard: React.FC<LocationCardProps> = ({ title, subtitle, description, meta, icon, mapLink }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-3 hover:border-slate-300 transition-colors">
      <div className="flex items-start">
        <div className="bg-slate-50 p-3 rounded-lg mr-4 text-slate-600">
          <i className={`fas ${icon} text-lg`}></i>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 font-medium">{subtitle}</p>}
          {description && <p className="text-sm text-slate-600 mt-1 leading-relaxed">{description}</p>}
          {meta && <p className="text-xs text-slate-400 mt-2 italic">{meta}</p>}
        </div>
        {mapLink && (
          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 bg-blue-50 text-blue-600 p-2 rounded-full hover:bg-blue-100 transition-colors"
          >
            <i className="fas fa-directions"></i>
          </a>
        )}
      </div>
    </div>
  );
};

export default LocationCard;
