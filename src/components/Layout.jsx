import React from 'react';
import clsx from 'clsx';

export const Layout = ({ header, sidebar, children, isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <div className="flex h-screen bg-black font-mono text-white overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Area */}
      <div className={clsx(
        "fixed inset-y-0 left-0 w-80 h-full flex-shrink-0 border-r border-zinc-900 bg-zinc-950 z-40 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:flex",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {sidebar}
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        <header className="h-20 lg:h-16 flex-shrink-0 bg-black border-b border-zinc-900 z-20 flex items-center px-4 lg:px-6 shadow-2xl overflow-x-auto lg:overflow-x-visible no-scrollbar">
          {header}
        </header>

        <main className="flex-1 overflow-hidden relative bg-black">
          {children}
        </main>
      </div>
    </div>
  );
};
