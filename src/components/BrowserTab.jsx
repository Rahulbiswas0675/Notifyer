import React from 'react';
import { Globe, ExternalLink, Link2, Ghost } from 'lucide-react';

export const BrowserTab = ({ notifications }) => {
  const extractLinks = () => {
    const linkSet = new Set();
    const links = [];

    notifications.forEach(n => {
      const text = (n.content || n.text || n.message || n.bigText || '');
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const matches = text.match(urlRegex);
      
      if (matches) {
        matches.forEach(url => {
          if (!linkSet.has(url)) {
            linkSet.add(url);
            links.push({
              url,
              appName: n.appName || n.packageName || 'Unknown',
              timestamp: n.timestamp
            });
          }
        });
      }
    });

    return links.sort((a, b) => b.timestamp - a.timestamp);
  };

  const links = extractLinks();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="bg-slate-950 rounded-2xl p-8 border border-slate-800 shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-emerald-500/10"></div>
        <div className="relative z-10 flex items-center gap-5">
           <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
             <Globe className="w-7 h-7" />
           </div>
           <div>
              <h2 className="text-2xl font-black text-white tracking-[0.2em] uppercase">EXTRACT_STREAM</h2>
              <p className="text-[11px] text-slate-500 font-mono uppercase tracking-[0.1em] mt-1">Automatic Link Interception Protocol Active</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.length > 0 ? (
          links.map((link, idx) => (
            <div key={idx} className="bg-[#0a0a0a]/80 backdrop-blur-sm rounded-xl p-5 border border-slate-800 hover:border-emerald-500/40 transition-all duration-500 group relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 group-hover:text-emerald-500 transition-colors">
                  <Link2 className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono text-emerald-500/60 uppercase tracking-widest">{link.appName}</span>
              </div>
              <p className="text-xs font-mono text-slate-400 break-all mb-6 line-clamp-1 leading-relaxed bg-black/40 p-2 rounded border border-slate-900">{link.url}</p>
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600/10 border border-emerald-600/30 hover:bg-emerald-600 text-emerald-500 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] transition-all w-full justify-center shadow-lg shadow-emerald-950/20"
              >
                Dump Link
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-slate-700 bg-slate-950 border border-dashed border-slate-800 rounded-3xl">
            <Ghost className="w-16 h-16 mb-6 text-slate-800 animate-pulse" />
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500">No signals intercepted</p>
            <p className="text-[10px] font-mono mt-2 text-slate-600">Awaiting URL broadcast in monitored channels...</p>
          </div>
        )}
      </div>
    </div>
  );
};
