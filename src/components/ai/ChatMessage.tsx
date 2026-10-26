import React, { useState } from 'react';
import { Bot, User, CheckCircle2, AlertTriangle, Calendar, Clock, Stethoscope, ShieldAlert } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types/ai';
import { SourceReferences } from './SourceReferences';
import { Button } from '../ui/Button';
import { aiService } from '../../services/aiService';
import { useApp } from '../../contexts/AppContext';

interface ChatMessageProps {
  message: ChatMessageType;
  onToolConfirmed?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onToolConfirmed }) => {
  const isAssistant = message.sender === 'assistant';
  const { showToast } = useApp();
  const [confirming, setConfirming] = useState(false);
  const [toolConfirmed, setToolConfirmed] = useState(message.toolAction?.status === 'confirmed');

  const handleConfirmTool = async () => {
    if (!message.toolAction) return;
    setConfirming(true);
    try {
      await aiService.confirmTool(message.toolAction.toolName, message.toolAction.input);
      setToolConfirmed(true);
      showToast('Appointment confirmed via Genova scheduling desk!', 'success');
      if (onToolConfirmed) onToolConfirmed();
    } catch (err: any) {
      showToast(err.message || 'Failed to confirm booking', 'error');
    } finally {
      setConfirming(false);
    }
  };

  const isEmergency = message.content.includes('IMMEDIATE ATTENTION REQUIRED') || message.content.includes('🚨');

  return (
    <div className={`flex items-start gap-3 py-2.5 ${isAssistant ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
          isAssistant
            ? isEmergency
              ? 'bg-red-600 text-white'
              : 'bg-gradient-to-br from-primary to-cyan text-white shadow-primary/20'
            : 'bg-slate-900 text-white'
        }`}
      >
        {isAssistant ? isEmergency ? <ShieldAlert className="w-4 h-4" /> : <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 shadow-xs text-xs sm:text-sm leading-relaxed transition-all ${
          isAssistant
            ? isEmergency
              ? 'bg-red-50 border-2 border-red-500 text-ink rounded-tl-sm'
              : 'bg-white border border-border text-ink rounded-tl-sm'
            : 'bg-primary text-white rounded-tr-sm shadow-md shadow-primary/20'
        }`}
      >
        {/* Main Content */}
        <div className="whitespace-pre-wrap space-y-2">
          {message.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h4 key={idx} className="font-bold text-sm sm:text-base text-ink pt-1 pb-0.5">
                  {paragraph.replace('### ', '')}
                </h4>
              );
            }
            if (paragraph.startsWith('• ') || paragraph.startsWith('- ')) {
              return (
                <ul key={idx} className="space-y-1 my-1 pl-2">
                  {paragraph.split('\n').map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{item.replace(/^[•-]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            return <p key={idx}>{paragraph}</p>;
          })}
        </div>

        {/* Interactive Tool Confirmation Card (Care Coordinator) */}
        {message.toolAction && message.toolAction.toolName === 'prepareAppointment' && (
          <div className="mt-3.5 p-3.5 rounded-xl bg-slate-50 border border-primary/30 text-ink space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase">
                <Calendar className="w-3 h-3" /> Booking Request Prepared
              </span>
              <span className="text-xs font-black text-ink">Fee: ₹{message.toolAction.input.price}</span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="font-bold text-ink flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-primary" />
                <span>{message.toolAction.input.doctorName} ({message.toolAction.input.doctorSpecialty})</span>
              </div>
              <div className="text-ink-muted flex items-center gap-2">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {message.toolAction.input.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {message.toolAction.input.time}</span>
              </div>
            </div>

            {toolConfirmed ? (
              <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Appointment Confirmed on Genova Schedule</span>
              </div>
            ) : (
              <div className="pt-1 flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleConfirmTool}
                  disabled={confirming}
                  className="bg-gradient-to-r from-primary to-cyan text-xs font-bold"
                >
                  {confirming ? 'Booking...' : 'Confirm Booking'}
                </Button>
                <span className="text-[11px] text-ink-muted">Explicit patient confirmation required</span>
              </div>
            )}
          </div>
        )}

        {/* Source References */}
        {message.sources && message.sources.length > 0 && (
          <SourceReferences sources={message.sources} />
        )}

        {/* Clinical Safety Disclaimer Note */}
        {isAssistant && message.safetyNote && (
          <div className="mt-3 pt-2 text-[10px] text-ink-muted/80 border-t border-border/50 flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
            <span>{message.safetyNote}</span>
          </div>
        )}
      </div>
    </div>
  );
};
