import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Pill,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  Clock,
  CheckCircle2,
  CalendarCheck,
} from 'lucide-react';
import { Medication } from '../types/medication';
import { medicationService } from '../services/medicationService';
import { MedicationCard } from '../components/medications/MedicationCard';
import { TodayDoseTracker } from '../components/medications/TodayDoseTracker';
import { MedicationDetailsModal } from '../components/medications/MedicationDetailsModal';
import { AddMedicationModal } from '../components/medications/AddMedicationModal';
import { EmptyState } from '../components/ui/EmptyState';
import { useApp } from '../contexts/AppContext';

export const MedicationsPage: React.FC = () => {
  const { showToast } = useApp();
  const navigate = useNavigate();

  const [medications, setMedications] = useState<Medication[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'refill_needed' | 'completed'>('active');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = () => {
    const list = medicationService.getMedications();
    setMedications(list);
  };

  const handleToggleDose = (medId: string, index: number, markTaken: boolean) => {
    try {
      medicationService.toggleScheduleDose(medId, index, markTaken);
      loadMedications();
      if (markTaken) {
        showToast('Dose recorded successfully. Great job staying on track!', 'success');
      } else {
        showToast('Dose intake status reverted.', 'info');
      }
    } catch (err) {
      showToast('Failed to update dose log.', 'error');
    }
  };

  const handleSkipDose = (medId: string, index: number) => {
    try {
      medicationService.skipScheduleDose(medId, index);
      loadMedications();
      showToast('Dose marked as skipped for today.', 'info');
    } catch {
      showToast('Could not skip dose.', 'error');
    }
  };

  const handleRequestRefill = (medId: string) => {
    try {
      const res = medicationService.requestRefill(medId);
      loadMedications();
      showToast(res.message, res.success ? 'success' : 'info');
    } catch {
      showToast('Refill request failed.', 'error');
    }
  };

  const handleAddMedication = (newMedData: Omit<Medication, 'id'>) => {
    const created = medicationService.addMedication(newMedData);
    loadMedications();
    showToast(`${created.name} added to your active medications.`, 'success');
  };

  const handleDeleteMedication = (medId: string) => {
    medicationService.deleteMedication(medId);
    loadMedications();
    showToast('Medication deleted from records.', 'info');
  };

  // Stats
  const activeMeds = medications.filter(m => m.status === 'active');
  const refillNeededMeds = activeMeds.filter(m => m.daysRemaining !== undefined && m.daysRemaining <= 7);
  const todayDoses = medicationService.getTodayDoses();
  const takenDosesCount = todayDoses.filter(d => d.schedule.takenToday).length;
  const overallAdherence =
    activeMeds.length > 0
      ? Math.round(activeMeds.reduce((acc, m) => acc + (m.adherencePercentage || 100), 0) / activeMeds.length)
      : 100;

  // Filtered List
  const filteredMedications = medications.filter(med => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (med.genericName && med.genericName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      med.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.prescribedBy.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'active') return med.status === 'active';
    if (filterTab === 'completed') return med.status === 'completed';
    if (filterTab === 'refill_needed') {
      return med.status === 'active' && ((med.daysRemaining !== undefined && med.daysRemaining <= 7) || med.refillsRemaining <= 1);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Page Title & Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">Medications & Prescriptions</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-light text-primary border border-primary/20">
              Rx Active
            </span>
          </div>
          <p className="text-sm text-ink-muted mt-1">
            Manage your daily regimens, log doses, monitor refills, and check drug interactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              navigate(
                `/ai-assistant?prompt=${encodeURIComponent(
                  'Can you check my current active medications for any potential drug interactions, food precautions, or contraindications?'
                )}`
              )
            }
            className="px-4 py-2.5 rounded-xl border border-cyan/40 bg-cyan-light/30 hover:bg-cyan-light/60 text-navy font-bold text-xs transition-all shadow-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan" /> Interaction Check
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Medication
          </button>
        </div>
      </div>

      {/* Top Health OS Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-card p-4 border border-border shadow-card flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0">
            <Pill className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-xs text-ink-muted font-medium">Active Prescriptions</p>
            <p className="text-xl font-extrabold text-navy mt-0.5">{activeMeds.length} Therapies</p>
          </div>
        </div>

        <div className="bg-white rounded-card p-4 border border-border shadow-card flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-success-soft text-success flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-xs text-ink-muted font-medium">Today's Doses</p>
            <p className="text-xl font-extrabold text-navy mt-0.5">
              {takenDosesCount} / {todayDoses.length} Taken
            </p>
          </div>
        </div>

        <div className="bg-white rounded-card p-4 border border-border shadow-card flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-light text-cyan flex items-center justify-center shrink-0">
            <CalendarCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-xs text-ink-muted font-medium">Therapy Adherence</p>
            <p className="text-xl font-extrabold text-navy mt-0.5">{overallAdherence}%</p>
          </div>
        </div>

        <div className="bg-white rounded-card p-4 border border-border shadow-card flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              refillNeededMeds.length > 0 ? 'bg-error-soft text-error animate-pulse' : 'bg-neutral-100 text-ink-muted'
            }`}
          >
            <RefreshCw className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-xs text-ink-muted font-medium">Refill Alerts</p>
            <p className="text-xl font-extrabold text-navy mt-0.5">
              {refillNeededMeds.length > 0 ? `${refillNeededMeds.length} Due Soon` : 'All Stocked'}
            </p>
          </div>
        </div>
      </div>

      {/* Today's Schedule & Dose Tracker */}
      <TodayDoseTracker
        items={todayDoses}
        onToggleDose={handleToggleDose}
        onSkipDose={handleSkipDose}
      />

      {/* Prescriptions Header & Search / Filters */}
      <div className="bg-white rounded-card p-5 border border-border shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-light">
          <div>
            <h2 className="text-lg font-bold text-navy">All Prescriptions & Medications</h2>
            <p className="text-xs text-ink-muted">
              Official records synchronized with your electronic health locker and verified physicians.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-ink-light absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search medication, condition, doctor..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-2">
          <button
            onClick={() => setFilterTab('active')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTab === 'active'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-background text-ink-muted hover:text-navy hover:bg-neutral-200'
            }`}
          >
            Active Therapies ({activeMeds.length})
          </button>

          <button
            onClick={() => setFilterTab('refill_needed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterTab === 'refill_needed'
                ? 'bg-error text-white shadow-sm'
                : 'bg-background text-ink-muted hover:text-navy hover:bg-neutral-200'
            }`}
          >
            Refills Needed ({refillNeededMeds.length})
          </button>

          <button
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTab === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-background text-ink-muted hover:text-navy hover:bg-neutral-200'
            }`}
          >
            All History ({medications.length})
          </button>

          <button
            onClick={() => setFilterTab('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTab === 'completed'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-background text-ink-muted hover:text-navy hover:bg-neutral-200'
            }`}
          >
            Completed Courses ({medications.filter(m => m.status === 'completed').length})
          </button>
        </div>

        {/* Medications Cards Grid */}
        {filteredMedications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
            {filteredMedications.map(med => (
              <MedicationCard
                key={med.id}
                medication={med}
                onSelect={setSelectedMedication}
                onRequestRefill={handleRequestRefill}
              />
            ))}
          </div>
        ) : (
          <div className="py-12">
            <EmptyState
              icon={Pill}
              title="No medications found"
              description={
                searchQuery
                  ? `No medications match your search "${searchQuery}". Try searching for another name or condition.`
                  : "You don't have any medications in this category."
              }
              actionLabel="Add Medication"
              onAction={() => setIsAddModalOpen(true)}
            />
          </div>
        )}
      </div>

      {/* Safety & Pharmacy Advisory Disclaimer */}
      <div className="p-4 rounded-card bg-white border border-border shadow-card flex items-center gap-3 text-xs text-ink-muted">
        <ShieldCheck className="w-5 h-5 text-success shrink-0" />
        <p>
          <strong className="text-navy">Clinical Safety Disclaimer:</strong> All prescription modifications, dosage
          titrations, and therapy cessations must be authorized by your attending physician. Genova AI provides
          informational reminders and safety checks only.
        </p>
      </div>

      {/* Modals */}
      <MedicationDetailsModal
        medication={selectedMedication}
        isOpen={Boolean(selectedMedication)}
        onClose={() => setSelectedMedication(null)}
        onRequestRefill={handleRequestRefill}
        onDelete={handleDeleteMedication}
      />

      <AddMedicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMedication}
      />
    </div>
  );
};

export default MedicationsPage;
