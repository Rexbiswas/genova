import React from 'react';
import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 py-2 animate-in fade-in duration-200">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-cyan text-white flex items-center justify-center shrink-0 shadow-sm shadow-primary/20">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
        <span className="text-xs font-semibold text-ink-muted ml-2">Genova AI is thinking...</span>
      </div>
    </div>
  );
};
