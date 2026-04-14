import { useState, useEffect } from 'react';
import { ref, onChildAdded, query, limitToLast, onValue } from 'firebase/database';
import { db } from '../firebase/firebaseConfig';

export const useFirebaseLive = (deviceId) => {
  const [notifications, setNotifications] = useState([]);
  const [deviceStatus, setDeviceStatus] = useState('offline');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!deviceId) return;
    
    // Clear old data when device changes
    setNotifications([]);
    setError(null);

    try {
      const notifRef = ref(db, `logs/${deviceId}/notifications`);
      const statusRef = ref(db, `devices/${deviceId}/status`); // Or adjust path accordingly

      // We use onChildAdded to instantly pop new data to the top
      // By using unshift/spreading the previous array after the new item
      const notifQuery = query(notifRef, limitToLast(50));
      const unsubNotif = onChildAdded(notifQuery, (snapshot) => {
        const data = snapshot.val();
        setNotifications((prev) => {
          // Prevent duplicates if already exists
          if (prev.find((n) => n.id === snapshot.key)) return prev;
          return [{ id: snapshot.key, ...data }, ...prev];
        });
      }, (err) => setError(err.message));

      // Quick listener for device live status
      const unsubStatus = onValue(statusRef, (snapshot) => {
        const val = snapshot.val();
        setDeviceStatus(val === 'online' || val === true ? 'online' : 'offline');
      }, (err) => setError(err.message));

      return () => {
         unsubNotif();
         unsubStatus();
      };
    } catch (e) {
      setError(e.message);
    }
  }, [deviceId]);

  return { notifications, deviceStatus, error };
};
