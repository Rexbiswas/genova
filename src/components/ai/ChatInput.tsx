import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestedPrompts = [
    'Explain my recent lab results',
    'Prepare questions for my doctor',
    'Find a cardiologist nearby',
    'Check my upcoming appointments',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleSelectSuggested = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Quick Suggested Prompt Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs" data-lenis-prevent>
        <span className="flex items-center gap-1 text-[11px] font-bold text-ink-muted shrink-0 mr-1">
          <Sparkles className="w-3 h-3 text-cyan" /> Suggested:
        </span>
        {suggestedPrompts.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSelectSuggested(p)}
            disabled={isLoading}
            className="shrink-0 px-3 py-1 rounded-full bg-slate-100 hover:bg-primary-light/50 hover:text-primary border border-border/60 text-ink text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Main Input Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 bg-white border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-2xl p-1.5 shadow-sm transition-all"
      >
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Ask Genova AI about symptoms, lab reports, or doctor appointments..."
          disabled={isLoading}
          className="flex-1 px-3 py-2 text-xs sm:text-sm text-ink placeholder:text-ink-muted/70 bg-transparent outline-none disabled:opacity-50"
          aria-label="Ask Genova AI"
        />

        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-cyan text-white flex items-center justify-center shrink-0 shadow-sm shadow-primary/25 hover:opacity-95 disabled:opacity-40 transition-all cursor-pointer"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center">
        <span className="text-[10px] text-ink-muted">
          Genova AI is an informational health assistant and does not provide clinical diagnoses or prescriptions.
        </span>
      </div>
    </div>
  );
};
