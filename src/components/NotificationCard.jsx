import React from 'react';
import { Trash2, SmartphoneNfc } from 'lucide-react';
import { format } from 'date-fns';

export const NotificationCard = ({ notification, onDelete }) => {
  const { id, appName, title, content, timestamp, appIcon } = notification;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200 group flex gap-4">
      <div className="flex-shrink-0 pt-1">
        {appIcon ? (
          <img src={appIcon} alt={appName} className="w-10 h-10 rounded-lg shadow-sm object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
            <SmartphoneNfc className="w-5 h-5" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">{appName || 'System App'}</span>
            <h3 className="text-sm font-semibold text-slate-900 truncate pr-4">{title}</h3>
          </div>
          <span className="text-xs text-slate-400 whitespace-nowrap">
            {timestamp ? format(new Date(timestamp), 'MMM d, h:mm a') : 'Just now'}
          </span>
        </div>
        <p className="text-sm text-slate-600 line-clamp-2 mt-1 leading-relaxed">
          {content}
        </p>
      </div>

      <div className="flex-shrink-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onDelete(id)}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete Notification"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
