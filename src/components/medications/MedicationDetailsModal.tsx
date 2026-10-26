import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Pill,
  Calendar,
  User,
  Clock,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Trash2,
  Building,
  ShieldAlert,
  FileCheck2,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Medication } from '../../types/medication';

interface MedicationDetailsModalProps {
  medication: Medication | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestRefill: (id: string) => void;
  onDelete: (id: string) => void;
}

export const MedicationDetailsModal: React.FC<MedicationDetailsModalProps> = ({
  medication,
  isOpen,
  onClose,
  onRequestRefill,
  onDelete,
}) => {
  const navigate = useNavigate();

  if (!medication) return null;

  const handleAskAI = () => {
    onClose();
    navigate(
      `/ai-assistant?prompt=${encodeURIComponent(
        `Can you tell me more about my medication ${medication.name} (${medication.dosage})? Are there any common side effects, food interactions, or precautions I should know about?`
      )}`
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Prescription & Therapy Details" maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Header Hero */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0"
              style={{ backgroundColor: medication.pillColor || '#0786C5' }}
            >
              <Pill className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-navy">{medication.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-light text-primary border border-primary/20">
                  {medication.dosage}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize bg-neutral-100 text-ink-muted">
                  {medication.form}
                </span>
              </div>
              {medication.genericName && (
                <p className="text-xs text-ink-muted mt-0.5">
                  Generic equivalent: <span className="font-semibold text-ink">{medication.genericName}</span>
                </p>
              )}
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${
              medication.status === 'active'
                ? 'bg-success-soft text-success border-success/30'
                : 'bg-neutral-100 text-neutral-600 border-neutral-300'
            }`}
          >
            {medication.status}
          </span>
        </div>

        {/* Clinical Indication */}
        <div className="p-3.5 rounded-xl bg-background border border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-ink-muted font-medium">Therapeutic Indication / Condition</p>
            <p className="text-sm font-bold text-navy mt-0.5">{medication.condition}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-ink-muted font-medium">Therapy Adherence</p>
            <p className="text-sm font-bold text-primary mt-0.5">{medication.adherencePercentage}% Streak</p>
          </div>
        </div>

        {/* Schedule & Timing */}
        <div>
          <h4 className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" /> Daily Intake Schedule
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {medication.schedules.map((schedule, i) => (
              <div key={i} className="p-3 rounded-xl border border-border bg-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan" />
                  <div>
                    <span className="text-xs font-bold text-navy capitalize">{schedule.timeOfDay}</span>
                    <p className="text-xs text-ink-muted">{schedule.timeString}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-ink bg-background px-2.5 py-1 rounded-lg border border-border">
                  {schedule.dosage}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-100">
          <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-primary" /> Clinical Instructions
          </h4>
          <p className="text-sm text-ink-secondary leading-relaxed">{medication.instructions}</p>
        </div>

        {/* Prescribing Info & Pharmacy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-border bg-white">
            <span className="text-ink-muted flex items-center gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-ink-light" /> Prescribing Physician
            </span>
            <p className="font-bold text-navy text-sm mt-1">{medication.prescribedBy}</p>
            {medication.clinicName && (
              <p className="text-xs text-ink-muted mt-0.5 flex items-center gap-1">
                <Building className="w-3 h-3" /> {medication.clinicName}
              </p>
            )}
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-white">
            <span className="text-ink-muted flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-ink-light" /> Timeline & Refills
            </span>
            <p className="font-bold text-navy text-sm mt-1">
              {medication.refillsRemaining} refills remaining{' '}
              <span className="text-ink-muted font-normal">of {medication.totalRefills}</span>
            </p>
            <p className="text-xs text-ink-muted mt-0.5">
              Prescribed: {medication.startDate}
              {medication.daysRemaining !== undefined && ` • ~${medication.daysRemaining} days supply left`}
            </p>
          </div>
        </div>

        {/* Safety & Warnings */}
        {medication.warnings && medication.warnings.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Cautionary Warnings & Food Interactions
            </h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-amber-900">
              {medication.warnings.map((warn, i) => (
                <li key={i}>{warn}</li>
              ))}
            </ul>
          </div>
        )}

        {/* AI Assistant Quick Consult Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan/10 via-primary-light/50 to-primary/10 border border-cyan/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-navy">Have Questions About This Drug?</h4>
              <p className="text-xs text-ink-muted">
                Ask Genova AI for plain-English explanations of side effects, interactions, or missed doses.
              </p>
            </div>
          </div>
          <button
            onClick={handleAskAI}
            className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shrink-0 transition-all shadow-sm"
          >
            Ask AI
          </button>
        </div>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (confirm(`Remove ${medication.name} from your medications list?`)) {
                onDelete(medication.id);
                onClose();
              }
            }}
            className="px-3 py-2 rounded-xl text-error hover:bg-error-soft text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Remove
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-ink-secondary hover:bg-background text-xs font-bold transition-colors"
            >
              Close
            </button>
            {medication.status === 'active' && (
              <button
                onClick={() => {
                  onRequestRefill(medication.id);
                  onClose();
                }}
                disabled={medication.refillsRemaining <= 0}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Request Refill
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
