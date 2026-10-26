import React, { useRef, useEffect } from 'react';
import { Bot, Sparkles, Shield, HeartPulse, RefreshCw } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types/ai';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';

interface ChatPanelProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  error?: string | null;
  onSendMessage: (text: string) => void;
  onRetry?: () => void;
  onToolConfirmed?: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  isLoading,
  error,
  onSendMessage,
  onRetry,
  onToolConfirmed,
}) => {
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-[75vh] md:h-[calc(100vh-160px)] bg-slate-50/70 border border-border rounded-3xl overflow-hidden shadow-sm">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" data-lenis-prevent>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-cyan text-white flex items-center justify-center mb-4 shadow-lg shadow-primary/25">
              <Bot className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-ink tracking-tight">Genova AI Health Assistant</h3>
            <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed">
              Your conversational guide for medical report explanation, physician discovery, consultation preparation, and preventive health insights.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 w-full text-left">
              <div className="p-3 bg-white border border-border rounded-xl">
                <div className="flex items-center gap-1.5 font-bold text-xs text-ink mb-1">
                  <HeartPulse className="w-4 h-4 text-primary" /> Report Explainer
                </div>
                <p className="text-[11px] text-ink-muted">
                  Understands lab metrics and explains medical terminology in plain language.
                </p>
              </div>

              <div className="p-3 bg-white border border-border rounded-xl">
                <div className="flex items-center gap-1.5 font-bold text-xs text-ink mb-1">
                  <Shield className="w-4 h-4 text-cyan" /> Care Coordinator
                </div>
                <p className="text-[11px] text-ink-muted">
                  Finds specialists and prepares appointments with explicit confirmation.
                </p>
              </div>
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} onToolConfirmed={onToolConfirmed} />
          ))
        )}

        {isLoading && <TypingIndicator />}

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-error flex items-center justify-between gap-3 text-xs">
            <span>{error}</span>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-2.5 py-1 rounded-md bg-white border border-red-300 font-bold text-xs flex items-center gap-1 hover:bg-red-100 transition-colors cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3 h-3" /> Retry
              </button>
            )}
          </div>
        )}

        <div ref={scrollEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-3 sm:p-4 bg-white border-t border-border">
        <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};
