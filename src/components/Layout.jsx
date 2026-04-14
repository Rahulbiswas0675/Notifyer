import React from 'react';

export const Layout = ({ sidebar, header, children }) => {
  return (
    <div className="flex h-screen bg-background overflow-hidden antialiased text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white">
        {sidebar}
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex-shrink-0 border-b border-slate-200 bg-white px-6 flex items-center justify-between shadow-sm z-10">
          {header}
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
