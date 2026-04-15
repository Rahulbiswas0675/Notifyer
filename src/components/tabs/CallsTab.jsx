import React from 'react';
import { Phone, ArrowUpRight, ArrowDownLeft, Trash2, Clock, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { useDecryptedFirebase } from '../../hooks/useDecryptedFirebase';

export const CallsTab = ({ deviceId, searchTerm, onDelete }) => {
  const { data: calls, loading } = useDecryptedFirebase(deviceId, 'calls');

  if (loading && calls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <Phone className="w-10 h-10 text-red-600 mb-4" />
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">Scanning_Voice_Channels...</p>
      </div>
    );
  }

  const filtered = calls.filter(call => {
    const searchStr = `${call.number} ${call.type} ${call.appName}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 lg:space-y-10">
      <div className="sticky top-0 sticky-header pt-4 pb-4 lg:pb-5 mb-6 lg:mb-10 border-b-2 border-zinc-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-5">
            <div className="w-10 h-10 lg:w-14 lg:h-14 bg-red-600/10 border border-red-600/40 flex items-center justify-center shadow-lg">
              <Phone className="w-5 h-5 lg:w-7 lg:h-7 text-red-600" />
            </div>
            <div>
              <h2 className="text-sm lg:text-lg font-black text-white uppercase tracking-[0.1em]">Calls</h2>
              <p className="text-[8px] lg:text-xs text-zinc-500 font-bold mt-1 uppercase tracking-widest">Voice Traffic Logs</p>
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 px-3 lg:px-6 py-2 lg:py-3 shadow-inner">
            <span className="text-[9px] lg:text-xs font-black text-red-500 uppercase tracking-[0.2em] whitespace-nowrap">LOGS: {filtered.length}</span>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="w-full bg-zinc-950 border border-zinc-900 overflow-hidden relative group shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black border-b-2 border-zinc-900 text-xs uppercase tracking-[0.2em] text-red-600 font-black">
                  <th className="p-6">Contact Node</th>
                  <th className="p-6">Call Type</th>
                  <th className="p-6">Duration</th>
                  <th className="p-6">Timestamp</th>
                  <th className="p-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-bold text-zinc-300 divide-y divide-zinc-900">
                {filtered.map((call, idx) => {
                  const isIncoming = call.type?.toLowerCase().includes('incoming');
                  const number = call.number || 'UNKNOWN';

                  return (
                    <tr key={call.id || idx} className="hover:bg-red-950/10 transition-colors group/row">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={clsx(
                            "w-10 h-10 flex items-center justify-center border-2",
                            isIncoming ? "bg-red-950/30 border-red-900/40 text-red-500" : "bg-zinc-900 border-zinc-800 text-zinc-500"
                          )}>
                            {isIncoming ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="text-white text-base tracking-widest leading-none mb-2 font-mono font-black uppercase">{number}</p>
                            <p className="text-[11px] text-zinc-600 uppercase tracking-[0.2em] font-black">{call.appName || 'Native Call'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={clsx(
                          "px-3 py-1 border-2 text-[10px] uppercase font-black tracking-widest",
                          isIncoming ? "border-red-900/60 bg-red-950/20 text-red-600" : "border-zinc-800 bg-zinc-900 text-zinc-500"
                        )}>
                          {call.type || 'PROTOCOL_ERR'}
                        </span>
                      </td>
                      <td className="p-6 font-mono font-black text-red-500/80">
                        {call.duration || '0s'}
                      </td>
                      <td className="p-6 font-mono text-xs text-zinc-500 font-bold">
                        {call.timestamp ? format(new Date(call.timestamp), 'yyyy-MM-dd HH:mm:ss') : 'N/A'}
                      </td>
                      <td className="p-6">
                        <div className="flex justify-center">
                          <button
                            onClick={() => onDelete(call.id)}
                            className="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-zinc-800 text-zinc-600 hover:text-red-500 hover:border-red-600/50 hover:bg-red-950/30 transition-all opacity-0 group-hover/row:opacity-100 shadow-lg"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-zinc-900 p-20 text-center text-zinc-800">
          <p className="text-[10px] uppercase font-bold tracking-[0.3em]">No_Transmission_Records</p>
        </div>
      )}
    </div>
  );
};

const clsx = (...classes) => classes.filter(Boolean).join(' ');
