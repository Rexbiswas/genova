import React from 'react';
import {
  FileText,
  Calendar,
  Building,
  Download,
  Trash2,
  Bot,
  HelpCircle,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { MedicalRecord } from '../../types/record';
import { Button } from '../ui/Button';
import { medicalRecordService } from '../../services/medicalRecordService';
import { useApp } from '../../contexts/AppContext';

interface ReportDetailsProps {
  record: MedicalRecord;
  onDeleteSuccess?: () => void;
}

export const ReportDetails: React.FC<ReportDetailsProps> = ({ record, onDeleteSuccess }) => {
  const { showToast } = useApp();

  const handleDownload = () => {
    const url = medicalRecordService.getDownloadUrl(record.id);
    window.open(url, '_blank');
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${record.title}" from your health locker?`)) {
      return;
    }
    try {
      await medicalRecordService.deleteRecord(record.id);
      showToast('Record deleted from health locker', 'info');
      if (onDeleteSuccess) onDeleteSuccess();
    } catch {
      showToast('Failed to delete medical record', 'error');
    }
  };

  return (
    <div className="bg-white border border-border rounded-3xl p-5 sm:p-6 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-light">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-cyan text-white flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
            <FileText className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-ink tracking-tight">{record.title}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                {record.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-ink-muted font-medium">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {record.recordDate}</span>
              {record.facilityName && (
                <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5" /> {record.facilityName}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <Button variant="outline" size="sm" onClick={handleDownload} icon={<Download className="w-3.5 h-3.5" />}>
            Download
          </Button>
          <button
            onClick={handleDelete}
            className="p-2 text-ink-muted hover:text-error hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            title="Delete record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Plain-Language Summary Box */}
      {record.aiSummary && (
        <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-primary-light/20 border border-primary/20 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <strong className="text-xs sm:text-sm font-extrabold text-ink">Genova AI Plain-Language Explanation</strong>
            </div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Automated Analysis</span>
          </div>

          <p className="text-xs sm:text-sm text-ink leading-relaxed font-medium">{record.aiSummary}</p>

          {/* Key Findings */}
          {record.aiKeyFindings && record.aiKeyFindings.length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block mb-1.5">
                Key Clinical Takeaways:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {record.aiKeyFindings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-border/60">
                    <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="text-ink font-semibold">{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Questions to ask Doctor */}
          {record.aiQuestionsForDoctor && record.aiQuestionsForDoctor.length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-cyan" /> Questions to Ask Your Doctor:
              </span>
              <ul className="space-y-1.5 text-xs">
                {record.aiQuestionsForDoctor.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-border/60 text-ink">
                    <span className="w-4 h-4 rounded-full bg-cyan/15 text-cyan text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ambiguous Values Disclosure */}
          {record.ambiguousValues && record.ambiguousValues.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Uncertain or Ambiguous Data:</strong>
                <span>{record.ambiguousValues.join(' ')}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Extracted Lab Metrics Table */}
      {record.metrics && record.metrics.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-extrabold text-ink uppercase tracking-wider">
              Extracted Lab Parameters & Reference Ranges
            </h3>
            <span className="text-[11px] text-ink-muted">{record.metrics.length} metrics cataloged</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-border text-ink-muted font-bold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Test Marker</th>
                  <th className="py-3 px-4">Value</th>
                  <th className="py-3 px-4">Standard Reference</th>
                  <th className="py-3 px-4">Clinical Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light font-medium">
                {record.metrics.map((m, idx) => {
                  const isNormal = m.interpretation === 'normal';
                  return (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-ink">{m.name}</td>
                      <td className="py-3 px-4 font-extrabold text-ink">
                        {m.value} {m.unit && <span className="font-normal text-ink-muted text-[11px]">{m.unit}</span>}
                      </td>
                      <td className="py-3 px-4 text-ink-muted">{m.referenceRange || 'Standard Range'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            isNormal
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {m.interpretation || 'normal'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
