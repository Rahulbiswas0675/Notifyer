import React, { useState } from 'react';
import { Search, Trash2, List, Phone, Map } from 'lucide-react';
import { SignalsTab } from './tabs/SignalsTab';
import { CallsTab } from './tabs/CallsTab';
import { GPSTab } from './tabs/GPSTab';
import clsx from 'clsx';

export const DashboardFeed = ({ deviceId, activeTab, searchTerm, onDeleteLog }) => {
  return (
    <div className="flex flex-col h-full bg-black">
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto scroll-smooth bg-black">
        {!deviceId ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-900">
            <Cpu className="w-24 h-24 mb-6 opacity-10 animate-pulse" />
            <p className="text-sm uppercase font-black tracking-[0.5em]">System Offline // Select Device</p>
          </div>
        ) : (
          <div className="w-full max-w-[1530px] mx-auto  m-4 bg-black">
            {activeTab === 'notifications' && (
              <SignalsTab
                deviceId={deviceId}
                searchTerm={searchTerm}
                onDelete={(logId) => onDeleteLog(deviceId, 'notifications', logId)}
              />
            )}
            {activeTab === 'calls' && (
              <CallsTab
                deviceId={deviceId}
                searchTerm={searchTerm}
                onDelete={(logId) => onDeleteLog(deviceId, 'calls', logId)}
              />
            )}
            {activeTab === 'location' && <GPSTab deviceId={deviceId} />}
          </div>
        )}
      </div>
    </div>
  );
};

const Cpu = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path d="M2 9h2" /><path d="M20 15h2" /><path d="M20 9h2" /><path d="M9 2v2" /><path d="M9 20v2" /></svg>
);
