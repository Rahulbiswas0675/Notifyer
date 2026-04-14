import React, { useState } from 'react';
import { NotificationCard } from './NotificationCard';
import { ClipboardCard } from './ClipboardCard';
import { SearchBar } from './SearchBar';
import { Bell, ClipboardList, AlertCircle, WifiOff, Smartphone, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { ref, remove } from 'firebase/database';
import { db } from '../firebase/firebaseConfig';

export const DashboardFeed = ({ deviceId, deviceStatus, notifications, clipboardLogs, error }) => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [searchQuery, setSearchQuery] = useState('');

  const handleDeleteNotification = async (notifId) => {
    try {
      if (!deviceId) return;
      const notifRef = ref(db, `logs/${deviceId}/notifications/${notifId}`);
      await remove(notifRef);
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (n.appName && n.appName.toLowerCase().includes(q)) ||
      (n.title && n.title.toLowerCase().includes(q)) ||
      (n.content && n.content.toLowerCase().includes(q))
    );
  });

  const filteredClipboardLogs = clipboardLogs.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.text && c.text.toLowerCase().includes(q);
  });

  if (!deviceId) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400">
        <Smartphone className="w-16 h-16 mb-4 text-slate-200" />
        <h2 className="text-xl font-medium text-slate-600 mb-2">No Device Selected</h2>
        <p className="text-sm">Select a device from the sidebar to view live logs.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Header with Search and Device Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className={clsx(
            "p-3 rounded-xl", 
            deviceStatus === 'online' ? "bg-green-100 text-green-600 shadow-sm" : "bg-slate-100 text-slate-500 shadow-sm"
          )}>
            {deviceStatus === 'online' ? <CheckCircle2 className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Live Device Feed</h2>
            <div className="flex items-center text-sm mt-1">
              <span className={clsx("font-semibold", deviceStatus === 'online' ? "text-green-600" : "text-slate-500")}>
                {deviceStatus === 'online' ? 'Online' : 'Offline'}
              </span>
              <span className="mx-2 text-slate-300">•</span>
              <span className="text-slate-500 font-mono text-xs bg-slate-100 px-2 py-0.5 rounded-md">ID: {deviceId}</span>
            </div>
          </div>
        </div>
        
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-800">Connection Error</h4>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100/70 p-1 rounded-xl mb-6 self-start border border-slate-200">
        <button
          onClick={() => setActiveTab('notifications')}
          className={clsx(
            "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            activeTab === 'notifications' 
              ? "bg-white text-primary shadow shrink-0" 
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
          )}
        >
          <Bell className="w-4 h-4 mr-2" />
          Notifications
          <span className={clsx("ml-2 py-0.5 px-2 rounded-full text-xs font-semibold", activeTab === 'notifications' ? "bg-blue-50 text-blue-600" : "bg-slate-200 text-slate-500")}>
            {filteredNotifications.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('clipboard')}
          className={clsx(
            "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            activeTab === 'clipboard' 
              ? "bg-white text-primary shadow shrink-0" 
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
          )}
        >
          <ClipboardList className="w-4 h-4 mr-2" />
          Clipboard
          <span className={clsx("ml-2 py-0.5 px-2 rounded-full text-xs font-semibold", activeTab === 'clipboard' ? "bg-blue-50 text-blue-600" : "bg-slate-200 text-slate-500")}>
            {filteredClipboardLogs.length}
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {activeTab === 'notifications' ? (
          <div className="space-y-3">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(notification => (
                <NotificationCard 
                  key={notification.id} 
                  notification={notification} 
                  onDelete={handleDeleteNotification} 
                />
              ))
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-slate-400 bg-white border border-slate-100 border-dashed rounded-2xl">
                <Bell className="w-12 h-12 mb-4 text-slate-200" />
                <p className="text-sm font-medium">No notifications found.</p>
                {searchQuery && <p className="text-xs mt-2">Try clearing your search filters</p>}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            {filteredClipboardLogs.length > 0 ? (
              filteredClipboardLogs.map(log => (
                <ClipboardCard key={log.id} clipboardData={log} />
              ))
            ) : (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 bg-white border border-slate-100 border-dashed rounded-2xl">
                <ClipboardList className="w-12 h-12 mb-4 text-slate-200" />
                <p className="text-sm font-medium">No clipboard logs found.</p>
                {searchQuery && <p className="text-xs mt-2">Try clearing your search filters</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
