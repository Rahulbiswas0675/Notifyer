import React from 'react';
import { Trash2, SmartphoneNfc, Clock, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export const NotificationCard = ({ notification, onDelete }) => {
  const { id, timestamp, appIcon } = notification;
  
  // Fallbacks for different Firebase data structures
  const displayAppName = notification.appName || notification.packageName || notification.name || 'System App';
  const title = notification.title || 'Notification';
  
  // Logic to get the most detailed content available
  const getDetailedContent = () => {
    if (notification.textLines) {
      if (Array.isArray(notification.textLines)) {
        return notification.textLines.join('\n');
      }
      return notification.textLines;
    }
    if (notification.bigText) return notification.bigText;
    return notification.content || notification.text || notification.message || 'No content';
  };

  const content = getDetailedContent();

  return (
    <div className="bg-[#0a0a0a]/80 backdrop-blur-sm rounded-xl p-5 border border-slate-800 hover:border-emerald-500/40 transition-all duration-500 group relative overflow-hidden shadow-2xl">
      <div className="flex gap-5">
        <div className="flex-shrink-0">
          <div className="relative">
            {appIcon ? (
              <img src={appIcon} alt={displayAppName} className="w-12 h-12 rounded-lg object-cover ring-1 ring-slate-800 group-hover:ring-emerald-500/30 transition-all" />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 text-emerald-500 flex items-center justify-center shadow-inner group-hover:border-emerald-500/30 transition-all">
                <SmartphoneNfc className="w-6 h-6" />
              </div>
            )}
            {displayAppName.toLowerCase().includes('whatsapp') && (
              <div className="absolute -right-1 -bottom-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0a0a0a] rounded-full"></div>
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-[0.2em] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Signal</span>
                 <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest truncate max-w-[120px]">{displayAppName}</span>
              </div>
              <h3 className="text-[14px] font-bold text-white pr-8 leading-tight uppercase tracking-tight">{title}</h3>
            </div>
          </div>
          
          <div className="bg-black/40 rounded-lg p-4 border border-slate-900 group-hover:border-emerald-500/10 transition-colors">
            <p className="text-[13px] text-slate-400 leading-relaxed font-medium whitespace-pre-wrap break-words">
              {content}
            </p>
          </div>

          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-slate-500 font-mono">
              <Clock className="w-3.5 h-3.5 text-emerald-500/50" />
              <span className="text-[10px] uppercase tracking-tighter">
                {timestamp ? format(new Date(timestamp), 'HH:mm:ss') : 'LIVE'}
              </span>
            </div>
            {content.includes('http') && (
               <button className="flex items-center gap-1.5 text-emerald-500 hover:text-emerald-400 transition-colors group/link">
                  <ExternalLink className="w-3.5 h-3.5 group-hover/link:animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Dump URL</span>
               </button>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 flex items-start opacity-0 group-hover:opacity-100 transition-all duration-500">
          <button
            onClick={() => onDelete(id)}
            className="p-2.5 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/30"
            title="Purge Signal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
