import React, { useState } from 'react';
import { Cpu, Power, Edit2, Check, X } from 'lucide-react';
import clsx from 'clsx';

export const DeviceSidebar = ({
  devices,
  selectedDeviceId,
  onSelectDevice,
  onLogout,
  onRenameDevice
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const startEditing = (e, device) => {
    e.stopPropagation();
    setEditingId(device.id);
    setEditValue(device.name || 'New Device');
  };

  const cancelEditing = (e) => {
    e.stopPropagation();
    setEditingId(null);
    setEditValue('');
  };

  const submitRename = (e, deviceId) => {
    e.stopPropagation();
    if (editValue.trim()) {
      onRenameDevice(deviceId, editValue.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 border-r border-zinc-900">
      <div className="p-6 flex items-center gap-4 border-b border-zinc-900 shadow-xl bg-black">
        <div className="w-10 h-10 flex items-center justify-center">
          <img src="/src/assets/logo.png" alt="Logo" className="w-9 h-9 object-contain" />
        </div>
        <div>
          <h1 className="font-black text-[13px] text-white tracking-[0.05em] leading-none uppercase font-tech">Notification Manager</h1>
          <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mt-1.5 block opacity-90">DASHBOARD HUB</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-6 px-2">
          Connected Devices
        </div>
        {devices.map((device) => {
          const isSelected = selectedDeviceId === device.id;
          const isOnline = Date.now() - (device.lastPing || 0) < 60000;

          return (
            <button
              key={device.id}
              onClick={() => !editingId && onSelectDevice(device.id)}
              className={clsx(
                "w-full text-left p-4 tech-border transition-all duration-300 relative group overflow-hidden",
                isSelected
                  ? "bg-red-950/20 border-red-600/50"
                  : "bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-900/50 hover:border-zinc-700"
              )}
            >
              {/* Status Indicator */}
              <div className={clsx(
                "absolute top-0 right-0 w-8 h-8 flex items-center justify-center",
                isOnline ? "text-red-500" : "text-zinc-800"
              )}>
                <div className={clsx(
                  "w-1.5 h-1.5 rounded-full",
                  isOnline ? "bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]" : "bg-zinc-800"
                )} />
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="flex-1 min-w-0 pr-6">
                  {editingId === device.id ? (
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <input
                        autoFocus
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="bg-zinc-800 border-none text-[11px] font-bold text-white px-1 py-0.5 w-full focus:ring-1 focus:ring-red-600 outline-none"
                      />
                      <button onClick={(e) => submitRename(e, device.id)} className="p-1 hover:text-red-500"><Check className="w-3 h-3" /></button>
                      <button onClick={cancelEditing} className="p-1 hover:text-zinc-400"><X className="w-3 h-3" /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group/title">
                      <span className={clsx(
                        "text-[11px] font-bold truncate tracking-wider uppercase",
                        isSelected ? "text-red-500" : "text-zinc-400"
                      )}>
                        {device.name || 'Unknown Node'}
                      </span>
                      <Edit2
                        className="w-2.5 h-2.5 opacity-0 group-hover/title:opacity-100 cursor-pointer text-zinc-500 hover:text-white transition-opacity"
                        onClick={(e) => startEditing(e, device)}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-600 truncate pr-2">
                  ADDR: {device.id.slice(0, 8)}
                </div>

                {/* Real-time visualizer anim */}
                <div className="flex items-end gap-0.5 h-3 opacity-30">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className={clsx("w-0.5 rounded-t-sm", isOnline ? "bg-red-600 animate-wave" : "bg-zinc-800")}
                      style={{ animationDelay: `${i * 0.1}s`, height: isOnline ? '20%' : '100%' }}
                    />
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-6 border-t border-zinc-900 bg-black shadow-2xl">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 p-4 border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-600 hover:bg-red-950/20 transition-all font-black text-[11px] uppercase tracking-[0.4em]"
        >
          <Power className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};
