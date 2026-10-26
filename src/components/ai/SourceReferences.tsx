import React from 'react';
import { FileText, Calendar, ExternalLink } from 'lucide-react';
import { MessageSource } from '../../types/ai';
import { useNavigate } from 'react-router-dom';

interface SourceReferencesProps {
  sources: MessageSource[];
}

export const SourceReferences: React.FC<SourceReferencesProps> = ({ sources }) => {
  const navigate = useNavigate();

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-border/60">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-2">
        <FileText className="w-3.5 h-3.5 text-primary" />
        <span>Referenced Medical Records ({sources.length})</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {sources.map((src, i) => (
          <div
            key={i}
            onClick={() => {
              if (src.recordId) {
                navigate(`/records?recordId=${src.recordId}`);
              } else {
                navigate('/records');
              }
            }}
            className="group flex flex-col p-2.5 rounded-xl bg-white/80 hover:bg-white border border-border hover:border-primary/40 transition-all cursor-pointer shadow-xs text-left"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-ink group-hover:text-primary transition-colors truncate">
                {src.title}
              </span>
              <ExternalLink className="w-3 h-3 text-ink-muted group-hover:text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {src.date && (
              <span className="text-[10px] text-ink-muted flex items-center gap-1 mt-0.5">
                <Calendar className="w-2.5 h-2.5" /> {src.date}
              </span>
            )}

            {src.snippet && (
              <p className="text-[11px] text-ink-muted mt-1 line-clamp-2 leading-relaxed">
                {src.snippet}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
