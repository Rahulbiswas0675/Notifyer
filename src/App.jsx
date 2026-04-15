import React, { useState, useEffect } from 'react';
import { ref, onValue, update, remove, query, limitToLast } from 'firebase/database';
import { db } from './firebase/firebaseConfig';
import { Layout } from './components/Layout';
import { DeviceSidebar } from './components/DeviceSidebar';
import { DashboardFeed } from './components/DashboardFeed';
import { Login } from './components/Login';
import { List, Phone, Map, Search, Trash2, Menu, Clock } from 'lucide-react';
import clsx from 'clsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notifications');
  const [searchTerm, setSearchTerm] = useState('');
  const [unseenCount, setUnseenCount] = useState(0);
  const [lastSeenTime, setLastSeenTime] = useState(() => {
    return parseInt(localStorage.getItem('lastSeenTime') || Date.now());
  });

  const tabs = [
    { id: 'notifications', label: 'Signals', icon: List, path: 'notifications' },
  ];

  const currentTab = tabs.find(t => t.id === activeTab);

  // Load devices on mount
  useEffect(() => {
    const devicesRef = ref(db, 'devices');
    const unsub = onValue(devicesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const deviceList = Object.entries(data).map(([id, val]) => ({
          id,
          ...val,
          lastPing: val.lastPing || 0
        }));
        setDevices(deviceList);
        if (!selectedDeviceId && deviceList.length > 0) {
          setSelectedDeviceId(deviceList[0].id);
        }
      } else {
        setDevices([]);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [selectedDeviceId]);

  // Track unseen notifications
  useEffect(() => {
    if (!selectedDeviceId) return;

    const notificationsRef = ref(db, `logs/${selectedDeviceId}/notifications`);
    const q = query(notificationsRef, limitToLast(20)); // Monitor recent ones

    const unsub = onValue(q, (snapshot) => {
      if (activeTab === 'notifications') {
        setUnseenCount(0);
        const now = Date.now();
        setLastSeenTime(now);
        localStorage.setItem('lastSeenTime', now);
        return;
      }

      const data = snapshot.val();
      if (data) {
        const newItems = Object.values(data).filter(item => item.timestamp > lastSeenTime);
        setUnseenCount(newItems.length);
      }
    });

    return () => unsub();
  }, [selectedDeviceId, activeTab, lastSeenTime]);

  useEffect(() => {
    if (activeTab === 'notifications' && unseenCount > 0) {
      setUnseenCount(0);
      const now = Date.now();
      setLastSeenTime(now);
      localStorage.setItem('lastSeenTime', now);
    }
  }, [activeTab, unseenCount]);

  const handleRenameDevice = async (deviceId, newName) => {
    try {
      const deviceRef = ref(db, `devices/${deviceId}`);
      await update(deviceRef, { name: newName });
    } catch (err) {
      console.error("Failed to rename device", err);
    }
  };

  const handleClearLogs = async (deviceId, path) => {
    if (!window.confirm(`Are you sure you want to clear all ${path} logs?`)) return;
    try {
      const logsRef = ref(db, `logs/${deviceId}/${path}`);
      await remove(logsRef);
    } catch (err) {
      console.error(`Failed to clear ${path} logs`, err);
    }
  };

  const handleDeleteLog = async (deviceId, path, logId) => {
    try {
      const logRef = ref(db, `logs/${deviceId}/${path}/${logId}`);
      await remove(logRef);
    } catch (err) {
      console.error("Failed to delete log entry", err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-speed-spin"></div>
          <span className="text-red-500 font-bold text-xs uppercase tracking-[0.3em] animate-pulse">Initializing_Mirror...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Layout
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      sidebar={
        <DeviceSidebar
          devices={devices}
          selectedDeviceId={selectedDeviceId}
          onSelectDevice={(id) => {
            setSelectedDeviceId(id);
            setIsSidebarOpen(false); // Close on selection
          }}
          onLogout={() => setIsLoggedIn(false)}
          onRenameDevice={handleRenameDevice}
        />
      }
      header={
        <div className="flex items-center justify-between w-full min-w-max lg:min-w-0 px-2 py-0 gap-4">
          {/* Brand and Target */}
          <div className="flex items-center gap-3 lg:gap-6">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-red-500 hover:bg-red-950/20"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 pr-4 lg:pr-6 border-r border-zinc-900">
              <div className="w-7 h-7 lg:w-8 lg:h-8 bg-red-600 flex items-center justify-center text-white font-black text-base lg:text-lg shadow-lg">N</div>
              <div className="hidden sm:block">
                <h1 className="text-[12px] lg:text-sm font-black text-white leading-none tracking-tight font-tech">Notification Manager</h1>
                <p className="text-[7px] lg:text-[8px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1 opacity-90">Live_Stream</p>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 flex p-0.5 lg:p-1 shadow-inner">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "flex items-center gap-1.5 lg:gap-2 px-3 lg:px-5 py-1.5 lg:py-2 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.1em] transition-all whitespace-nowrap relative",
                    activeTab === tab.id
                      ? "bg-red-600 text-white shadow-lg"
                      : "text-zinc-600 hover:text-zinc-200"
                  )}
                >
                  <tab.icon className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                  <span className="hidden xs:inline">{tab.label}</span>
                  <span className="xs:hidden">{tab.id.charAt(0)}</span>
                  
                  {tab.id === 'notifications' && unseenCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-700 text-[8px] items-center justify-center font-bold border border-black shadow-lg">
                        {unseenCount > 9 ? '9+' : unseenCount}
                      </span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6 flex-1 max-w-sm lg:max-w-xl mx-2 lg:mx-8">
            <div className="relative flex-1 group">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white py-1.5 lg:py-2 pl-8 lg:pl-10 pr-3 lg:pr-4 text-[10px] lg:text-xs focus:outline-none focus:border-red-600 transition-all font-mono shadow-inner"
              />
              <Search className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-zinc-600 absolute left-2.5 lg:left-3 top-1/2 -translate-y-1/2 group-focus-within:text-red-500" />
            </div>

            <button
              onClick={() => handleClearLogs(selectedDeviceId, currentTab.path)}
              className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 border border-red-900/40 text-red-500 hover:bg-red-600 hover:text-white transition-all text-[9px] lg:text-[10px] font-black uppercase tracking-[0.1em] bg-red-950/10 shadow-md whitespace-nowrap"
            >
              <Trash2 className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
              <span className="hidden sm:inline">Clear Logs</span>
            </button>
          </div>
          
          <div className="flex flex-col items-end min-w-[100px] lg:min-w-[120px]">
            <span className="text-[7px] lg:text-[8px] font-black text-zinc-700 uppercase tracking-[0.2em] mb-0.5 lg:mb-1">Target_Device</span>
            <div className="bg-red-950/20 border border-red-900/40 px-2 lg:px-3 py-1 text-[9px] lg:text-[10px] text-red-500 font-black tracking-widest uppercase truncate max-w-[120px] lg:max-w-[150px]">
              {devices.find(d => d.id === selectedDeviceId)?.name || selectedDeviceId || 'PROBING...'}
            </div>
          </div>
        </div>
      }
    >
      <DashboardFeed 
        deviceId={selectedDeviceId} 
        activeTab={activeTab}
        searchTerm={searchTerm}
        onDeleteLog={handleDeleteLog}
      />
    </Layout>
  );
}

export default App;
