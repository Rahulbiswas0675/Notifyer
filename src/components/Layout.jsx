import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';

export const Layout = ({ header, sidebar, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-400 relative overflow-hidden">
      {/* CRT Scanline Effect */}
      <div className="scanline"></div>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 flex-col bg-[#050a18] border-r border-slate-800 shadow-[20px_0_40px_rgba(0,0,0,0.5)] z-20">
        {sidebar}
      </aside>

      {/* Sidebar - Mobile Drawer */}
      <div className={clsx(
        "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity lg:hidden",
        isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={() => setIsSidebarOpen(false)} />
      
      <aside className={clsx(
        "fixed inset-y-0 left-0 w-72 bg-[#050a18] z-50 transform transition-transform duration-300 border-r border-slate-800 lg:hidden",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="absolute top-4 right-4 lg:hidden">
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        {sidebar}
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <header className="h-16 flex-shrink-0 bg-[#020617]/80 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 flex items-center z-30 sticky top-0 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 mr-2 text-slate-400 lg:hidden hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1 overflow-hidden">
            {header}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth bg-gradient-to-b from-[#020617] to-[#04091e]">
          {children}
        </main>
      </div>
    </div>
  );
};
