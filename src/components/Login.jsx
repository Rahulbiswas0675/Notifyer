import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Terminal, KeyRound } from 'lucide-react';

export const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'The-Bad-Boy') {
      onLogin();
    } else {
      setError('ACCESS_DENIED: UNAUTHORIZED_SESSION');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 relative overflow-hidden font-mono">
      {/* CRT Scanline Effect */}
      <div className="scanline opacity-30"></div>
      
      {/* Ambient Cyber Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-sm relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-8 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/40 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)] mb-6 animate-pulse">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-[0.2em] mb-2 uppercase">Notifyer</h1>
            <div className="flex items-center gap-2 text-[10px] text-emerald-500/70 uppercase tracking-widest font-bold">
              <Terminal className="w-3 h-3" />
              Secure Terminal Protocol
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">
                Encryption Key Required
              </label>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full bg-black/40 border border-slate-800 text-emerald-500 px-4 py-4 pl-12 rounded-xl focus:outline-none focus:border-emerald-500/50 transition-all font-mono placeholder:text-slate-800 text-sm"
                  autoFocus
                />
                <KeyRound className="w-5 h-5 text-slate-700 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-500/50 transition-colors" />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/5 border border-red-900/40 rounded-lg p-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                <p className="text-red-500 text-[9px] font-bold uppercase tracking-widest">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transform transition-all active:scale-[0.98] uppercase tracking-[0.3em] text-xs"
            >
              Init Session
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-800/50 flex flex-col items-center gap-2">
            <p className="text-slate-600 text-[8px] uppercase tracking-[0.3em]">
              Node_ID: 0x9F2E-SYMB
            </p>
            <div className="flex gap-1">
               <span className="w-1 h-1 bg-emerald-500/30 rounded-full"></span>
               <span className="w-1 h-1 bg-emerald-500/30 rounded-full animate-bounce delay-75"></span>
               <span className="w-1 h-1 bg-emerald-500/30 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
