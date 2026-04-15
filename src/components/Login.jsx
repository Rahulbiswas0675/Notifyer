import React, { useState } from 'react';
import { Terminal, KeyRound, Cpu, ShieldAlert } from 'lucide-react';
import logo from '../assets/logo.png';

export const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would be a Firebase Auth call or similar
    if (password === 'The-Bad-Boy') {
      onLogin();
    } else {
      setError('AUTHENTICATION_FAILED: ACCESS_DENIED');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 p-8 pt-10 relative overflow-hidden group">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-red-600 shadow-[0_0_15px_rgba(255,0,0,0.5)]"></div>

          <div className="flex flex-col items-center mb-10 mt-2">
            <div className="w-24 h-24 bg-black border border-red-600/40 flex items-center justify-center shadow-[0_0_30px_rgba(255,49,49,0.15)] p-4 mb-8 relative">
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-red-600"></div>
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-red-600"></div>
              <img src={logo} alt="Logo" className="w-full h-full object-contain filter brightness-125" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tighter">Notification Manager</h1>
            <div className="flex items-center gap-2 text-[11px] text-red-500 uppercase tracking-widest font-bold bg-red-950/40 px-4 py-1.5 border border-red-900/60">
              <Terminal className="w-4 h-4" />
              Admin_Gateway_v2.2
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-[0.4em] mb-4 px-1">
                Security_Protocol
              </label>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="AUTHORIZATION_CODE"
                  className="w-full bg-zinc-900/40 border border-zinc-800 text-white px-5 py-5 pl-14 focus:outline-none focus:border-red-600 hover:border-zinc-700 transition-all font-mono placeholder:text-zinc-700 text-base"
                  autoFocus
                />
                <KeyRound className="w-6 h-6 text-zinc-700 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-red-500 transition-colors" />
              </div>
            </div>

            {error && (
              <div className="bg-red-950/30 border border-red-900/60 p-5 flex items-center gap-4 animate-in fade-in slide-in-from-top-3 duration-300">
                <ShieldAlert className="w-6 h-6 text-red-600 flex-shrink-0" />
                <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-5 shadow-[0_0_25px_rgba(255,49,49,0.3)] hover:shadow-[0_0_40px_rgba(255,49,49,0.5)] transform transition-all active:scale-[0.97] uppercase tracking-[0.4em] text-sm flex items-center justify-center gap-4"
            >
              <Cpu className="w-6 h-6" />
              Initialize_System
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col items-center gap-3">
            <p className="text-zinc-600 text-[9px] uppercase tracking-[0.4em]">
              Gateway: Restricted_Access
            </p>
            <div className="flex gap-2">
              <span className="w-1.5 h-1.5 bg-red-600/40 rounded-full animate-pulse"></span>
              <span className="w-1.5 h-1.5 bg-red-600/40 rounded-full animate-pulse delay-75"></span>
              <span className="w-1.5 h-1.5 bg-red-600/40 rounded-full animate-pulse delay-150"></span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-zinc-700 text-[9px] uppercase tracking-[0.2em] font-bold">
            System_Ready // Encrypted_Mirror_Active
          </p>
        </div>
      </div>
    </div>
  );
};
