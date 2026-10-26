import React from 'react';
import { Pill, RefreshCw, AlertTriangle, Calendar, User, Info, CheckCircle2, ChevronRight } from 'lucide-react';
import { Medication } from '../../types/medication';

interface MedicationCardProps {
  medication: Medication;
  onSelect: (med: Medication) => void;
  onRequestRefill: (medId: string) => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  onSelect,
  onRequestRefill,
}) => {
  const isRefillUrgent = medication.daysRemaining !== undefined && medication.daysRemaining <= 7 && medication.status === 'active';
  const isCompleted = medication.status === 'completed';

  return (
    <div
      className={`bg-white rounded-card border transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:shadow-hover ${
        isCompleted
          ? 'border-border opacity-75'
          : isRefillUrgent
          ? 'border-error/40 hover:border-error'
          : 'border-border hover:border-primary/50'
      }`}
    >
      {/* Top Banner Accent */}
      <div
        className="h-1.5 w-full transition-all duration-300 group-hover:h-2"
        style={{ backgroundColor: medication.pillColor || '#0786C5' }}
      />

      <div className="p-5 flex-1 flex flex-col">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105"
              style={{
                backgroundColor: `${medication.pillColor || '#0786C5'}15`,
                color: medication.pillColor || '#0786C5',
              }}
            >
              <Pill className="w-5 h-5 stroke-[2.2]" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-navy text-base group-hover:text-primary transition-colors">
                  {medication.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-background text-ink border border-border">
                  {medication.dosage}
                </span>
              </div>
              {medication.genericName && (
                <p className="text-xs text-ink-muted">
                  Generic: <span className="italic">{medication.genericName}</span>
                </p>
              )}
            </div>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${
              medication.status === 'active'
                ? 'bg-success-soft text-success border-success/30'
                : medication.status === 'completed'
                ? 'bg-neutral-100 text-neutral-600 border-neutral-300'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {medication.status}
          </span>
        </div>

        {/* Condition / Indication */}
        <div className="mb-3 px-3 py-1.5 rounded-xl bg-background border border-border-light text-xs text-ink font-medium flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan shrink-0" />
          <span className="truncate">{medication.condition}</span>
        </div>

        {/* Regimen / Instructions */}
        <p className="text-xs text-ink-secondary mb-4 line-clamp-2 leading-relaxed">
          {medication.instructions}
        </p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-border-light mt-auto">
          <div>
            <span className="text-[11px] text-ink-muted flex items-center gap-1">
              <User className="w-3 h-3 text-ink-light" /> Prescribed By
            </span>
            <p className="font-semibold text-navy truncate mt-0.5">{medication.prescribedBy}</p>
          </div>

          <div>
            <span className="text-[11px] text-ink-muted flex items-center gap-1">
              <Calendar className="w-3 h-3 text-ink-light" /> Frequency
            </span>
            <p className="font-semibold text-navy truncate mt-0.5">{medication.frequencyLabel}</p>
          </div>
        </div>

        {/* Refill status badge */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <RefreshCw className={`w-3.5 h-3.5 ${isRefillUrgent ? 'text-error animate-spin' : 'text-ink-muted'}`} />
            <span className={`font-semibold ${isRefillUrgent ? 'text-error font-bold' : 'text-ink'}`}>
              {medication.refillsRemaining} refills left
            </span>
          </div>

          {medication.daysRemaining !== undefined && medication.status === 'active' && (
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                isRefillUrgent
                  ? 'bg-error-soft text-error border border-error/30 animate-pulse'
                  : 'bg-background text-ink-muted'
              }`}
            >
              {medication.daysRemaining} days left
            </span>
          )}
        </div>

        {/* Warnings preview if present */}
        {medication.warnings && medication.warnings.length > 0 && (
          <div className="mt-3 p-2 rounded-xl bg-amber-50/80 border border-amber-200/60 text-[11px] text-amber-800 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span className="truncate">{medication.warnings[0]}</span>
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="p-4 bg-background/50 border-t border-border-light flex items-center gap-2">
        <button
          onClick={() => onSelect(medication)}
          className="flex-1 py-2 px-3 rounded-xl border border-border bg-white hover:bg-primary-light hover:border-primary/40 text-navy hover:text-primary text-xs font-bold transition-all flex items-center justify-center gap-1"
        >
          <Info className="w-3.5 h-3.5" /> View Details
        </button>

        {medication.status === 'active' && (
          <button
            onClick={() => onRequestRefill(medication.id)}
            disabled={medication.refillsRemaining <= 0}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              medication.refillsRemaining > 0
                ? isRefillUrgent
                  ? 'bg-error hover:bg-red-600 text-white shadow-sm'
                  : 'bg-primary hover:bg-primary-hover text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refill
          </button>
        )}
      </div>
    </div>
  );
};
