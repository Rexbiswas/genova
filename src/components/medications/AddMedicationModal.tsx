import React, { useState } from 'react';
import { Pill, Plus, Calendar, Clock, User, FileText, CheckCircle2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Medication, MedicationForm, MedicationFrequency, TimeOfDay } from '../../types/medication';

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (med: Omit<Medication, 'id'>) => void;
}

const COLOR_PALETTE = ['#0786C5', '#09B7D5', '#19B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];

export const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [dosage, setDosage] = useState('');
  const [form, setForm] = useState<MedicationForm>('tablet');
  const [condition, setCondition] = useState('');
  const [prescribedBy, setPrescribedBy] = useState('Dr. Aline Carvalho');
  const [clinicName, setClinicName] = useState('Genova Central Medical Center');
  const [frequency, setFrequency] = useState<MedicationFrequency>('once_daily');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [timeString, setTimeString] = useState('08:00 AM');
  const [instructions, setInstructions] = useState('');
  const [refillsRemaining, setRefillsRemaining] = useState(3);
  const [pillColor, setPillColor] = useState(COLOR_PALETTE[0]);
  const [warningText, setWarningText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) return;

    let frequencyLabel = 'Once daily';
    if (frequency === 'twice_daily') frequencyLabel = 'Twice daily with meals';
    else if (frequency === 'three_times_daily') frequencyLabel = 'Three times daily';
    else if (frequency === 'as_needed') frequencyLabel = 'As needed (PRN)';
    else if (frequency === 'weekly') frequencyLabel = 'Once weekly';

    const newMed: Omit<Medication, 'id'> = {
      name: name.trim(),
      genericName: genericName.trim() || undefined,
      dosage: dosage.trim(),
      form,
      condition: condition.trim() || 'General Health Maintenance',
      prescribedBy: prescribedBy.trim() || 'Self / Primary Physician',
      clinicName: clinicName.trim() || 'Genova Health Network',
      frequency,
      frequencyLabel,
      instructions: instructions.trim() || `Take ${dosage.trim()} by mouth according to physician directions.`,
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
      refillsRemaining: Number(refillsRemaining) || 0,
      totalRefills: Number(refillsRemaining) || 0,
      daysRemaining: 30,
      pillColor,
      adherencePercentage: 100,
      warnings: warningText.trim() ? [warningText.trim()] : undefined,
      schedules: [
        {
          timeOfDay,
          timeString,
          dosage: `1 ${form.charAt(0).toUpperCase() + form.slice(1)} (${dosage})`,
          takenToday: false,
        },
      ],
    };

    onAdd(newMed);
    onClose();

    // Reset form
    setName('');
    setGenericName('');
    setDosage('');
    setCondition('');
    setInstructions('');
    setWarningText('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Medication" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & Dosage */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-navy mb-1">
              Medication Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Omeprazole, Metformin"
              className="w-full px-3.5 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy mb-1">
              Dosage <span className="text-error">*</span>
            </label>
            <input
              type="text"
              required
              value={dosage}
              onChange={e => setDosage(e.target.value)}
              placeholder="e.g. 20 mg, 500 mg"
              className="w-full px-3.5 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Generic Name & Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-navy mb-1">Generic Name / Brand (Optional)</label>
            <input
              type="text"
              value={genericName}
              onChange={e => setGenericName(e.target.value)}
              placeholder="e.g. Prilosec"
              className="w-full px-3.5 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy mb-1">Form</label>
            <select
              value={form}
              onChange={e => setForm(e.target.value as MedicationForm)}
              className="w-full px-3.5 py-2 rounded-xl border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="tablet">Tablet</option>
              <option value="capsule">Capsule</option>
              <option value="liquid">Liquid / Syrup</option>
              <option value="injection">Injection</option>
              <option value="inhaler">Inhaler</option>
              <option value="topical">Topical / Cream</option>
            </select>
          </div>
        </div>

        {/* Condition / Indication */}
        <div>
          <label className="block text-xs font-bold text-navy mb-1">Therapeutic Purpose / Condition</label>
          <input
            type="text"
            value={condition}
            onChange={e => setCondition(e.target.value)}
            placeholder="e.g. Acid Reflux, Hypertension, Blood Sugar"
            className="w-full px-3.5 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Schedule & Timing */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-background border border-border">
          <div>
            <label className="block text-xs font-bold text-navy mb-1">Frequency</label>
            <select
              value={frequency}
              onChange={e => setFrequency(e.target.value as MedicationFrequency)}
              className="w-full px-3 py-1.5 rounded-lg border border-border text-xs bg-white focus:outline-none focus:border-primary"
            >
              <option value="once_daily">Once daily</option>
              <option value="twice_daily">Twice daily</option>
              <option value="three_times_daily">3 times daily</option>
              <option value="as_needed">As needed (PRN)</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy mb-1">Time of Day</label>
            <select
              value={timeOfDay}
              onChange={e => setTimeOfDay(e.target.value as TimeOfDay)}
              className="w-full px-3 py-1.5 rounded-lg border border-border text-xs bg-white focus:outline-none focus:border-primary"
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="bedtime">Bedtime</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy mb-1">Target Time</label>
            <input
              type="text"
              value={timeString}
              onChange={e => setTimeString(e.target.value)}
              placeholder="08:00 AM"
              className="w-full px-3 py-1.5 rounded-lg border border-border text-xs bg-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-xs font-bold text-navy mb-1">Instructions / Food Advisory</label>
          <textarea
            rows={2}
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
            placeholder="e.g. Take 1 tablet 30 minutes before first meal with water."
            className="w-full px-3.5 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          />
        </div>

        {/* Doctor & Refills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-navy mb-1">Prescribing Doctor</label>
            <input
              type="text"
              value={prescribedBy}
              onChange={e => setPrescribedBy(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-border text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy mb-1">Refills Authorized</label>
            <input
              type="number"
              min={0}
              max={12}
              value={refillsRemaining}
              onChange={e => setRefillsRemaining(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-border text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Color Badge Picker */}
        <div>
          <label className="block text-xs font-bold text-navy mb-1.5">Visual Color Badge</label>
          <div className="flex items-center gap-2">
            {COLOR_PALETTE.map(color => (
              <button
                type="button"
                key={color}
                onClick={() => setPillColor(color)}
                style={{ backgroundColor: color }}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  pillColor === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'opacity-80 hover:opacity-100'
                }`}
              >
                {pillColor === color && <CheckCircle2 className="w-4 h-4 text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Cautionary Warning */}
        <div>
          <label className="block text-xs font-bold text-navy mb-1">Special Precautions / Allergy Notes</label>
          <input
            type="text"
            value={warningText}
            onChange={e => setWarningText(e.target.value)}
            placeholder="e.g. Avoid alcohol, take with food, may cause drowsiness"
            className="w-full px-3.5 py-2 rounded-xl border border-border text-sm focus:outline-none focus:border-primary"
          />
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border text-ink-muted hover:bg-background text-xs font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Save Medication
          </button>
        </div>
      </form>
    </Modal>
  );
};
