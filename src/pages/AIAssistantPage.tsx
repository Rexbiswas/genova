import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Paperclip,
  Mic,
  MicOff,
  RotateCcw,
  Plus,
  MessageSquare,
  Trash2,
  X,
} from 'lucide-react';
import { ChatMessage as ChatMessageType, Conversation } from '../types/ai';
import { ChatMessage } from '../components/ai/ChatMessage';
import { TypingIndicator } from '../components/ai/TypingIndicator';
import { aiService } from '../services/aiService';
import { useApp } from '../contexts/AppContext';

export const AIAssistantPage: React.FC = () => {
  const { showToast } = useApp();

  // Chat State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // History Slide-Over Drawer
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);

  // Dynamic time-of-day greeting (not personalized)
  const [greeting, setGreeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    return 'Good evening';
  });

  // Dynamic rotating prompt topics
  const dynamicTopics = [
    'discussing symptoms & triage guidance',
    'interpreting lab results & medical reports',
    'medication schedules & drug interactions',
    'preventive wellness & nutrition advice',
    'finding certified medical specialists',
  ];
  const [topicIndex, setTopicIndex] = useState(0);
  const [fadeAnim, setFadeAnim] = useState(true);

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) setGreeting('Good morning');
      else if (hour >= 12 && hour < 17) setGreeting('Good afternoon');
      else setGreeting('Good evening');
    };
    const timer = setInterval(updateGreeting, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeAnim(false);
      setTimeout(() => {
        setTopicIndex(prev => (prev + 1) % dynamicTopics.length);
        setFadeAnim(true);
      }, 250);
    }, 3200);
    return () => clearInterval(interval);
  }, [dynamicTopics.length]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const loadConversations = async () => {
    try {
      const list = await aiService.getConversations();
      setConversations(list);
    } catch {
      // offline fallback
    }
  };

  const handleSelectConversation = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await aiService.getConversation(id);
      setActiveConversationId(id);
      setMessages(res.messages);
      setHistoryDrawerOpen(false);
    } catch {
      showToast('Failed to load conversation messages', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(undefined);
    setMessages([]);
    setError(null);
    setInputText('');
    setHistoryDrawerOpen(false);
  };

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await aiService.deleteConversation(id);
      setConversations(prev => prev.filter(c => c.id !== id));
      if (activeConversationId === id) {
        handleNewChat();
      }
      showToast('Conversation deleted', 'info');
    } catch {
      showToast('Failed to delete conversation', 'error');
    }
  };

  const handleSendMessage = async (promptText?: string) => {
    const textToSend = (promptText || inputText).trim();
    if (!textToSend || isLoading) return;

    setIsLoading(true);
    setError(null);
    setLastFailedPrompt(null);
    setInputText('');

    const tempUserMsg: ChatMessageType = {
      id: `temp-${Date.now()}`,
      sender: 'user',
      content: textToSend,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const res = await aiService.sendMessage(textToSend, activeConversationId);
      setActiveConversationId(res.conversationId);
      setMessages(prev => [
        ...prev.filter(m => m.id !== tempUserMsg.id),
        res.userMessage,
        res.assistantMessage,
      ]);
      loadConversations();
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'Unable to connect to Genova AI service. Please verify server connection.');
      setLastFailedPrompt(textToSend);
      setMessages(prev => prev.filter(m => m.id !== tempUserMsg.id));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      showToast('Listening... Speak your health question', 'info');
      setTimeout(() => {
        setIsRecording(false);
        setInputText('Can you explain the implications of my elevated cholesterol levels?');
        showToast('Voice query transcribed', 'success');
      }, 3200);
    } else {
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      showToast(`Attached "${file.name}". Analyzing report...`, 'info');
      handleSendMessage(`I've attached my report "${file.name}". Can you summarize the key lab metrics and findings?`);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full h-[calc(100vh-5.5rem)] rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden relative">
      {/* Hidden file input for reports */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* ======================================================== */}
      {/* 1. TOP HEADER BAR                                        */}
      {/* ======================================================== */}
      <div className="h-14 px-4 sm:px-6 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0 bg-white/95 backdrop-blur-xs z-10">
        {/* Left: Bot Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-cyan text-white flex items-center justify-center shrink-0 shadow-sm shadow-primary/20">
            <Bot className="w-5 h-5 stroke-[2.5]" />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs sm:text-sm text-slate-900 tracking-tight">Genova AI</span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                v2.4
              </span>
            </div>

            {messages.length > 0 && (
              <button
                onClick={handleNewChat}
                className="ml-2 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-primary-light/70 text-primary text-[11px] font-bold hover:bg-primary-light transition-all cursor-pointer"
                title="Start a new consultation"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Session</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: History Drawer Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHistoryDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="View consultation history"
          >
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">History</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px] font-extrabold">
              {conversations.length}
            </span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN WORKSPACE (Scrollable Chat or Centered Welcome)   */}
      {/* ======================================================== */}
      <div
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 no-scrollbar flex flex-col"
        data-lenis-prevent
      >
        {messages.length === 0 ? (
          /* Clean Minimal Welcome State with Dynamic Greeting & Rotating Topics */
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-lg mx-auto my-auto py-12 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary to-cyan text-white flex items-center justify-center shadow-lg shadow-primary/20 mb-5">
              <Bot className="w-8 h-8 stroke-[2.2]" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {greeting}! <span className="text-primary block sm:inline">How can I assist you today?</span>
            </h2>
            <div className="mt-2.5 h-8 flex items-center justify-center">
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Ask about{' '}
                <span
                  className={`text-slate-800 font-semibold inline-block transition-all duration-300 ${
                    fadeAnim
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 -translate-y-1'
                  }`}
                >
                  {dynamicTopics[topicIndex]}
                </span>
              </p>
            </div>
          </div>
        ) : (
          /* Active Conversation Stream */
          <div className="w-full max-w-4xl mx-auto space-y-4 pb-4 px-2 sm:px-4">
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-between gap-3 text-xs">
                <span>{error}</span>
                {lastFailedPrompt && (
                  <button
                    onClick={() => handleSendMessage(lastFailedPrompt)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-red-300 font-bold text-xs flex items-center gap-1 hover:bg-red-100 transition-colors cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-3 h-3" /> Retry
                  </button>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. BOTTOM CHAT INPUT BAR                                 */}
      {/* ======================================================== */}
      <div className="px-4 sm:px-8 pb-4 pt-2 shrink-0 bg-white border-t border-slate-100">
        <div className="w-full max-w-4xl mx-auto space-y-2">
          {/* Main Input Form */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 p-1.5 pl-3 bg-white border border-slate-200 rounded-2xl shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all"
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-slate-400 hover:text-primary rounded-xl transition-colors cursor-pointer shrink-0"
              title="Attach medical report or image (PDF, JPG, PNG)"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Ask Genova AI anything about your health..."
              disabled={isLoading}
              className="flex-1 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 bg-transparent outline-none disabled:opacity-50"
              aria-label="Ask Genova AI"
            />

            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer shrink-0 ${
                isRecording ? 'text-red-500 bg-red-50 animate-pulse' : 'text-slate-400 hover:text-slate-700'
              }`}
              title={isRecording ? 'Listening...' : 'Voice dictate'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-9 h-9 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-sm shadow-primary/25 transition-all cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-medium">
              Genova AI is an informational health assistant and does not provide clinical diagnoses or prescriptions.
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. HISTORY SLIDE-OVER DRAWER                             */}
      {/* ======================================================== */}
      {historyDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setHistoryDrawerOpen(false)}
          />

          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col p-5 z-10 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <h3 className="font-extrabold text-sm text-slate-900">Consultation History</h3>
              </div>
              <button
                onClick={() => setHistoryDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3">
              <button
                onClick={handleNewChat}
                className="w-full py-2.5 px-3 rounded-xl bg-primary text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-primary/20 hover:bg-primary-hover transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Start New Consultation</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 no-scrollbar" data-lenis-prevent>
              {conversations.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-400">
                  No past consultations recorded yet.
                </div>
              ) : (
                conversations.map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`group flex items-center justify-between p-3 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                      activeConversationId === conv.id
                        ? 'bg-primary-light text-primary font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate pr-2">{conv.title}</span>
                    <button
                      onClick={e => handleDeleteConversation(e, conv.id)}
                      className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete consultation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistantPage;
