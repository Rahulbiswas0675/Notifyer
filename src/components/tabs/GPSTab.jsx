import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Map as MapIcon, Layers, Shield } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { format } from 'date-fns';
import 'leaflet/dist/leaflet.css';
import { useDecryptedFirebase } from '../../hooks/useDecryptedFirebase';

const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export const GPSTab = ({ deviceId }) => {
  const { data: locationData, loading } = useDecryptedFirebase(deviceId, 'location', { mode: 'single' });

  const lat = locationData?.latitude || 0;
  const lng = locationData?.longitude || 0;
  const timestamp = locationData?.timestamp || 0;
  const isLocked = timestamp > 0 && (Date.now() - timestamp < 300000);

  const [mapCenter, setMapCenter] = useState([0, 0]);

  useEffect(() => {
    if (lat !== 0 && lng !== 0) {
      setMapCenter([lat, lng]);
    }
  }, [lat, lng]);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between mb-6 pb-5 border-b-2 border-zinc-900">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-red-600/10 border border-red-600/40 flex items-center justify-center shadow-lg">
            <MapIcon className="w-7 h-7 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-[0.1em]">GPS Location</h2>
            <p className="text-xs text-zinc-500 font-bold mt-1.5 uppercase tracking-widest">Triangulated Device Position</p>
          </div>
        </div>
        {timestamp > 0 ? (
          isLocked ? (
            <div className="flex items-center gap-3 bg-red-950/30 px-5 py-2 border-2 border-red-900/60 text-red-500 shadow-[0_0_20px_rgba(255,49,49,0.3)]">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Live Signal Lock</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-zinc-900 px-5 py-2 border-2 border-zinc-800 text-zinc-500">
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Signal Lost</span>
            </div>
          )
        ) : null}
      </div>

      {lat !== 0 && lng !== 0 ? (
        <div className="relative flex-1 w-full min-h-[600px] border-2 border-zinc-900 bg-black group overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-red-600/[0.03] pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <MapContainer
            center={[lat, lng]}
            zoom={16}
            style={{ height: '100%', width: '100%', background: '#000' }}
            zoomControl={false}
            attributionControl={false}
          >
            {/* Cartodb Dark Matter tiles for pure Dark Mode aesthetic */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <Marker position={[lat, lng]} icon={customIcon}>
              <Popup className="tech-popup">
                <div className="p-3 font-mono text-center bg-black border-2 border-red-600">
                  <div className="text-[11px] uppercase font-black text-red-500 border-b border-zinc-800 pb-2 mb-3 tracking-widest">DEVICE_LOCK</div>
                  <div className="text-sm text-white font-bold">
                    {lat.toFixed(6)}, {lng.toFixed(6)}
                  </div>
                </div>
              </Popup>
            </Marker>
            <MapUpdater center={mapCenter} zoom={16} />
          </MapContainer>

          {/* HUD Overlay */}
          <div className="absolute top-10 right-10 bg-black/90 backdrop-blur-xl border-2 border-zinc-800 p-6 z-[1000] shadow-[0_0_40px_rgba(0,0,0,0.8)] min-w-[280px]">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-900">
              <div className="flex items-center gap-3">
                <Navigation className="w-5 h-5 text-red-600" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400">Telemetry Data</span>
              </div>
              <Shield className="w-4 h-4 text-red-900" />
            </div>
            
            <div className="space-y-4 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-bold">LATITUDE:</span>
                <span className="text-white font-white font-black tracking-widest">{lat.toFixed(6)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-bold">LONGITUDE:</span>
                <span className="text-white font-black tracking-widest">{lng.toFixed(6)}</span>
              </div>
              <div className="pt-4 border-t border-zinc-900 flex justify-between items-center">
                 <span className="text-[10px] text-zinc-600 font-bold">ACCURACY:</span>
                 <span className="text-[10px] text-red-600 font-black">{locationData.accuracy ? Math.round(locationData.accuracy) + ' meters' : 'N/A'}</span>
              </div>
              <div className="text-[9px] text-zinc-700 italic mt-3 font-bold border-t border-zinc-900 pt-3">
                 SATELLITE_FIX_TIME: {format(new Date(timestamp), 'HH:mm:ss')}
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-6 left-6 z-[1000] flex flex-col gap-2">
             <div className="bg-black/80 border border-zinc-800 py-2 px-3 flex items-center gap-3">
                <Layers className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Layers: Sat_Overlay_Disabled</span>
             </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-[550px] border border-dashed border-zinc-900 bg-zinc-950 flex flex-col items-center justify-center text-zinc-800">
          <MapPin className="w-12 h-12 mb-4 animate-bounce text-zinc-900" />
          <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Pending_GPS_Lock_On_Target...</p>
        </div>
      )}
    </div>
  );
};
