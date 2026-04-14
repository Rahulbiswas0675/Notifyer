import React from 'react';
import { Smartphone, MonitorPlay } from 'lucide-react';
import clsx from 'clsx';

export const DeviceSidebar = ({ devices, selectedDeviceId, onSelectDevice }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-100 flex items-center gap-2">
        <MonitorPlay className="w-6 h-6 text-primary" />
        <h1 className="font-bold text-lg text-slate-900 tracking-tight">Zondra Watcher</h1>
      </div>
      
      <div className="p-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Monitored Devices</h2>
        <div className="space-y-1">
          {devices.map((device) => (
            <button
              key={device.id}
              onClick={() => onSelectDevice(device.id)}
              className={clsx(
                "w-full flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors duration-200",
                selectedDeviceId === device.id 
                  ? "bg-blue-50 text-primary font-medium" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Smartphone className={clsx("w-4 h-4 mr-3", selectedDeviceId === device.id ? "text-primary" : "text-slate-400")} />
              <span className="flex-1 text-left truncate">{device.name}</span>
              {device.status === 'online' ? (
                <span className="flex items-center w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" title="Online"></span>
              ) : (
                <span className="flex items-center w-2 h-2 rounded-full bg-slate-300" title="Offline"></span>
              )}
            </button>
          ))}
          {devices.length === 0 && (
             <div className="text-sm text-slate-400 italic px-2">No devices found.</div>
          )}
        </div>
      </div>
    </div>
  );
};
