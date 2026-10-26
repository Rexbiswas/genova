import React from 'react';
import { Check, Clock, AlertCircle, Sun, CloudSun, Moon, Sunset, Sparkles } from 'lucide-react';
import { Medication, TimeOfDay } from '../../types/medication';

interface TodayDoseTrackerProps {
  items: Array<{
    medication: Medication;
    schedule: Medication['schedules'][0];
    scheduleIndex: number;
  }>;
  onToggleDose: (medId: string, index: number, markTaken: boolean) => void;
  onSkipDose: (medId: string, index: number) => void;
}

export const TodayDoseTracker: React.FC<TodayDoseTrackerProps> = ({
  items,
  onToggleDose,
  onSkipDose,
}) => {
  const total = items.length;
  const taken = items.filter(i => i.schedule.takenToday).length;
  const percentage = total > 0 ? Math.round((taken / total) * 100) : 0;

  const getTimeIcon = (tod: TimeOfDay) => {
    switch (tod) {
      case 'morning':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'afternoon':
        return <CloudSun className="w-4 h-4 text-sky-500" />;
      case 'evening':
        return <Sunset className="w-4 h-4 text-orange-500" />;
      case 'bedtime':
        return <Moon className="w-4 h-4 text-indigo-500" />;
    }
  };

  const getTimeBadgeColor = (tod: TimeOfDay) => {
    switch (tod) {
      case 'morning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'afternoon':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'evening':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'bedtime':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="bg-white rounded-card p-6 border border-border shadow-card mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border-light">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-navy">Today's Medication Tracker</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary border border-primary/20">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <p className="text-sm text-ink-muted mt-1">
            Track and log your scheduled doses to maintain optimal therapy adherence.
          </p>
        </div>

        {/* Adherence progress bar & stats */}
        <div className="flex items-center gap-4 bg-background px-4 py-2.5 rounded-2xl border border-border">
          <div className="text-right">
            <p className="text-xs font-semibold text-ink-muted">Today's Adherence</p>
            <p className="text-lg font-bold text-navy">
              {taken} of {total} taken <span className="text-xs text-primary font-bold">({percentage}%)</span>
            </p>
          </div>
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-border stroke-current"
                strokeWidth="3.5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-cyan stroke-current transition-all duration-500 ease-out"
                strokeDasharray={`${percentage}, 100`}
                strokeLinecap="round"
                strokeWidth="3.5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[11px] font-bold text-navy">{percentage}%</span>
          </div>
        </div>
      </div>

      {/* Doses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {items.map(({ medication, schedule, scheduleIndex }) => {
          const isTaken = schedule.takenToday;
          const isSkipped = schedule.skippedToday;

          return (
            <div
              key={`${medication.id}-${scheduleIndex}`}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isTaken
                  ? 'bg-success-soft/30 border-success/30'
                  : isSkipped
                  ? 'bg-neutral-50 border-neutral-200 opacity-60'
                  : 'bg-white border-border hover:border-primary/40 hover:shadow-hover'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getTimeBadgeColor(
                      schedule.timeOfDay
                    )}`}
                  >
                    {getTimeIcon(schedule.timeOfDay)}
                    <span className="capitalize">{schedule.timeOfDay}</span> • {schedule.timeString}
                  </span>
                  {isTaken && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Taken
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-sm"
                    style={{ backgroundColor: medication.pillColor || '#0786C5' }}
                  >
                    {medication.dosage.split(' ')[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-navy text-sm leading-tight hover:text-primary transition-colors">
                      {medication.name}
                    </h3>
                    <p className="text-xs text-ink-muted mt-0.5 font-medium">{schedule.dosage}</p>
                    <p className="text-[11px] text-ink-light truncate mt-1 max-w-[170px]" title={medication.condition}>
                      {medication.condition}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border-light flex items-center justify-between gap-2">
                {isTaken ? (
                  <button
                    onClick={() => onToggleDose(medication.id, scheduleIndex, false)}
                    className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-ink-muted hover:text-error hover:bg-error-soft transition-colors"
                  >
                    Undo taken
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onToggleDose(medication.id, scheduleIndex, true)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Take Dose
                    </button>
                    {!isSkipped && (
                      <button
                        onClick={() => onSkipDose(medication.id, scheduleIndex)}
                        className="py-1.5 px-2.5 rounded-xl border border-border text-ink-muted hover:text-ink hover:bg-background text-xs font-medium transition-colors"
                        title="Skip this dose"
                      >
                        Skip
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
