import React, { useState } from 'react';
import { Copy, Check, Scissors } from 'lucide-react';
import { format } from 'date-fns';

export const ClipboardCard = ({ clipboardData }) => {
  const { id, text, timestamp } = clipboardData;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 group flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 text-primary font-medium text-sm border px-2 py-1 bg-blue-50 border-blue-100 rounded-md">
          <Scissors className="w-3.5 h-3.5" />
          <span>Clipboard Log</span>
        </div>
        <span className="text-xs text-slate-400">
          {timestamp ? format(new Date(timestamp), 'MMM d, h:mm a') : 'Just now'}
        </span>
      </div>
      
      <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-100 relative group-hover:border-slate-200 transition-colors">
        <p className="text-sm text-slate-700 font-mono break-words whitespace-pre-wrap">
          {text}
        </p>
        
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="p-1.5 bg-white border border-slate-200 shadow-sm rounded-md text-slate-600 hover:text-primary hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            title="Copy to Desktop"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
