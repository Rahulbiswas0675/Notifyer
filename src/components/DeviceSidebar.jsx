import React from 'react';
import { Smartphone, Activity, ShieldCheck, Cpu, Power, LogOut } from 'lucide-react';
import clsx from 'clsx';

export const DeviceSidebar = ({ devices, selectedDeviceId, onSelectDevice, onLogout }) => {
  return (
    <div className="h-full flex flex-col bg-[#050a18]">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-900/20">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-widest leading-none">Notify</h1>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 block">Data Node: 0x42A</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></span>
              Remote Units
            </h2>
            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-mono border border-emerald-500/20 px-2 py-0.5 rounded shadow-sm">
              [{devices.length}]
            </span>
          </div>
          
          <div className="space-y-1">
            {devices.map((device) => (
              <button
                key={device.id}
                onClick={() => onSelectDevice(device.id)}
                className={clsx(
                  "w-full group flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-300 relative overflow-hidden",
                  selectedDeviceId === device.id 
                    ? "bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                )}
              >
                <div className={clsx(
                  "p-2 rounded-lg transition-colors duration-300",
                  selectedDeviceId === device.id ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-600 group-hover:text-slate-400"
                )}>
                  <Smartphone className="w-4 h-4" />
                </div>

                <div className="flex-1 text-left min-w-0">
                  <p className="truncate font-bold tracking-tight text-xs uppercase">{device.name}</p>
                  <p className="text-[9px] opacity-60 font-mono truncate">LINK_ID: {device.id.slice(0, 12)}</p>
                </div>

                {device.status === 'online' ? (
                  <div className="flex items-center gap-1.5 p-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-800 border border-slate-700">
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">Operation Status</h2>
          <div className="space-y-4 px-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-2 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500/70" />
                <span>Firewall</span>
              </div>
              <span className="text-emerald-500 font-bold uppercase">Locked</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-2 text-slate-400">
                <Activity className="w-4 h-4 text-emerald-500/70" />
                <span>Stream</span>
              </div>
              <span className="text-emerald-500 font-bold uppercase">Encrypted</span>
            </div>
          </div>
        </section>
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900/30">
        <div className="flex items-center gap-3 p-2 mb-4">
          <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-emerald-500 font-mono shadow-inner">
            OP_01
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-white truncate uppercase tracking-tighter">Rahul</p>
            <p className="text-[9px] text-slate-500 font-mono truncate">Status: Authenticated</p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="w-full group flex items-center justify-center gap-2 py-3 rounded-lg border border-red-900/30 bg-red-950/20 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-red-950/20"
        >
          <LogOut className="w-4 h-4 group-hover:animate-bounce" />
          Terminate Session
        </button>
      </div>
    </div>
  );
};
