import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { DeviceSidebar } from './components/DeviceSidebar';
import { DashboardFeed } from './components/DashboardFeed';
import { useFirebaseLive } from './hooks/useFirebaseLive';
import { db } from './firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';

function App() {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  // Fetch all devices for the sidebar
  useEffect(() => {
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
  }, [selectedDeviceId]);

  // Use custom hook to fetch live feed for selected device
  const { notifications, clipboardLogs, deviceStatus, error } = useFirebaseLive(selectedDeviceId);

  return (
    <Layout
      header={
        <div className="flex items-center w-full justify-between">
          <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Zondra Watcher Workspace
          </div>
          <div className="flex items-center gap-4">
            <button className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-primary font-semibold border border-slate-200 shadow-sm hover:bg-slate-200 transition-colors">
              Z
            </button>
          </div>
        </div>
      }
      sidebar={
        <DeviceSidebar 
          devices={devices} 
          selectedDeviceId={selectedDeviceId} 
          onSelectDevice={setSelectedDeviceId} 
        />
      }
    >
      <DashboardFeed 
        deviceId={selectedDeviceId}
        deviceStatus={deviceStatus}
        notifications={notifications}
        clipboardLogs={clipboardLogs}
        error={error}
      />
    </Layout>
  );
}

export default App;
