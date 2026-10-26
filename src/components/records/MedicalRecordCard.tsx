import React from 'react';
import { FileText, Calendar, Building, Bot, Download, ChevronRight, Activity } from 'lucide-react';
import { MedicalRecord } from '../../types/record';
import { medicalRecordService } from '../../services/medicalRecordService';

interface MedicalRecordCardProps {
  record: MedicalRecord;
  isSelected?: boolean;
  onSelect: () => void;
}

export const MedicalRecordCard: React.FC<MedicalRecordCardProps> = ({ record, isSelected, onSelect }) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = medicalRecordService.getDownloadUrl(record.id);
    window.open(url, '_blank');
  };

  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-2xl border p-4 transition-all cursor-pointer shadow-xs group ${
        isSelected
          ? 'border-primary ring-2 ring-primary/10 shadow-md'
          : 'border-border hover:border-primary/40 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary-light transition-colors">
            <FileText className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-ink group-hover:text-primary transition-colors truncate">
                {record.title}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-slate-100 text-ink-muted shrink-0">
                {record.category.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1 text-xs text-ink-muted">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {record.recordDate}
              </span>
              {record.facilityName && (
                <span className="flex items-center gap-1 truncate">
                  <Building className="w-3 h-3" /> {record.facilityName}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="p-1.5 text-ink-muted hover:text-primary rounded-lg transition-colors cursor-pointer shrink-0"
          title="Download original file"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Extracted metric chips preview */}
      {record.metrics && record.metrics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border-light">
          {record.metrics.slice(0, 3).map((m, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md bg-slate-50 border border-border-light text-[10px] font-semibold text-ink"
            >
              {m.name}: <strong className="text-primary">{m.value}</strong>
            </span>
          ))}
          {record.metrics.length > 3 && (
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-ink-muted">
              +{record.metrics.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Bottom AI Explainer Banner */}
      {record.aiSummary && (
        <div className="mt-3 flex items-center justify-between text-[11px] text-primary font-bold">
          <span className="flex items-center gap-1">
            <Bot className="w-3.5 h-3.5" /> AI Explanation Ready
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
        </div>
      )}
    </div>
  );
};
