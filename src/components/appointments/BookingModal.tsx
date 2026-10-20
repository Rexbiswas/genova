import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingFormSchema, BookingFormData } from '../../utils/validation';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useApp } from '../../contexts/AppContext';
import { doctorService } from '../../services/doctorService';
import { ConsultationType } from '../../types/appointment';
import { getTodayDateString, generateDynamicDate, formatRelativeDate } from '../../utils/dates';
import { Video, UserCheck, PhoneCall, Calendar as CalendarIcon, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

export const BookingModal: React.FC = () => {
  const { bookingDoctor, closeBookingModal, bookAppointment, doctors } = useApp();
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string>(bookingDoctor?.id || '');

  const today = getTodayDateString();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      doctorId: bookingDoctor?.id || '',
      consultationType: 'video',
      date: generateDynamicDate(1),
      time: '',
      notes: '',
    },
  });

  const selectedDate = watch('date');
  const selectedType = watch('consultationType');
  const selectedTime = watch('time');

  useEffect(() => {
    if (bookingDoctor) {
      setSelectedDocId(bookingDoctor.id);
      setValue('doctorId', bookingDoctor.id);
    }
  }, [bookingDoctor, setValue]);

  // Load slots when doctor or date changes
  useEffect(() => {
    async function loadSlots() {
      if (!selectedDocId || !selectedDate) return;
      setLoadingSlots(true);
      try {
        const slots = await doctorService.getDoctorAvailability(selectedDocId, selectedDate);
        setAvailableSlots(slots);
        if (slots.length > 0 && !slots.includes(selectedTime)) {
          setValue('time', slots[0]);
        }
      } catch (err) {
        console.error('Failed to load slots', err);
        setAvailableSlots(['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']);
      } finally {
        setLoadingSlots(false);
      }
    }
    loadSlots();
  }, [selectedDocId, selectedDate, setValue, selectedTime]);

  const activeDoctor = doctors.find(d => d.id === selectedDocId) || bookingDoctor;

  const onSubmit = async (data: BookingFormData) => {
    try {
      await bookAppointment({
        doctorId: data.doctorId,
        date: data.date,
        time: data.time,
        consultationType: data.consultationType as ConsultationType,
        notes: data.notes,
      });
      reset();
      closeBookingModal();
    } catch (err) {
      console.error('Booking failed', err);
    }
  };

  if (!bookingDoctor && !selectedDocId) return null;

  return (
    <Modal isOpen={!!bookingDoctor} onClose={closeBookingModal} title="Schedule Medical Consultation" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Physician Header Card */}
        {activeDoctor && (
          <div className="flex items-center gap-3.5 p-3 rounded-card bg-slate-50 border border-border-light overflow-hidden">
            <img
              src={activeDoctor.image}
              alt={activeDoctor.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80';
              }}
              className="w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] rounded-xl object-cover ring-1 ring-border shadow-sm shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wide block truncate">
                {activeDoctor.specialty}
              </span>
              <h4 className="text-sm font-bold text-ink truncate leading-snug">
                {activeDoctor.name}
              </h4>
              <p className="text-xs text-ink-muted truncate">
                {activeDoctor.role}
              </p>
            </div>
            <div className="text-right shrink-0 pl-2">
              <span className="text-base font-extrabold text-ink block leading-tight">
                ₹{activeDoctor.price}
              </span>
              <span className="text-[10px] text-ink-muted block whitespace-nowrap">
                Fee / Session
              </span>
            </div>
          </div>
        )}

        {/* Consultation Type Selector */}
        <div>
          <label className="text-xs font-bold text-ink uppercase tracking-wider block mb-2">
            1. Consultation Mode
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { type: 'video' as const, label: 'HD Video', icon: Video, desc: 'Encrypted Telehealth' },
              { type: 'in-person' as const, label: 'Clinic Visit', icon: UserCheck, desc: 'At Doctor Office' },
              { type: 'audio' as const, label: 'Voice Call', icon: PhoneCall, desc: 'Direct Audio' },
            ].map(m => {
              const Icon = m.icon;
              const isSelected = selectedType === m.type;
              return (
                <button
                  type="button"
                  key={m.type}
                  onClick={() => setValue('consultationType', m.type)}
                  className={`p-3 rounded-card border text-left flex flex-col items-start gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary-light/30 ring-2 ring-primary/20 text-ink'
                      : 'border-border bg-white text-ink-muted hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-ink-muted'}`} />
                  <span className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-ink'}`}>{m.label}</span>
                  <span className="text-[10px] text-ink-muted leading-tight">{m.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Selector */}
        <div>
          <label className="text-xs font-bold text-ink uppercase tracking-wider block mb-2">
            2. Choose Date
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {[0, 1, 2, 3].map(offset => {
              const dStr = generateDynamicDate(offset);
              const isSelected = selectedDate === dStr;
              return (
                <button
                  type="button"
                  key={dStr}
                  onClick={() => setValue('date', dStr)}
                  className={`py-2 px-2.5 rounded-control border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary text-white shadow-md shadow-primary/25 font-bold'
                      : 'border-border bg-white text-ink hover:bg-slate-50 text-xs font-semibold'
                  }`}
                >
                  <div className="text-[10px] opacity-80">{offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : formatRelativeDate(dStr).split(',')[0]}</div>
                  <div className="text-xs font-extrabold mt-0.5">{dStr.slice(5)}</div>
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-ink-muted" />
            <input
              type="date"
              min={today}
              {...register('date')}
              className="text-xs font-medium text-ink bg-white border border-border rounded-md px-2.5 py-1.5 focus:border-primary outline-none"
            />
          </div>
          {errors.date && <p className="text-xs text-error mt-1">{errors.date.message}</p>}
        </div>

        {/* Time Slot Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-ink uppercase tracking-wider block">
              3. Available Time Slots
            </label>
            {loadingSlots && <span className="text-[11px] text-ink-muted">Checking slots...</span>}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1" data-lenis-prevent>
            {availableSlots.length === 0 ? (
              <div className="col-span-full py-4 text-center text-xs text-ink-muted">
                No slots available on this date. Please pick another date.
              </div>
            ) : (
              availableSlots.map(slot => {
                const isSelected = selectedTime === slot;
                return (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setValue('time', slot)}
                    className={`py-2 px-3 rounded-control border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary text-white shadow-sm font-bold'
                        : 'border-border bg-white text-ink hover:border-slate-300'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{slot}</span>
                  </button>
                );
              })
            )}
          </div>
          {errors.time && <p className="text-xs text-error mt-1">{errors.time.message}</p>}
        </div>

        {/* Notes (Optional) */}
        <div>
          <label className="text-xs font-bold text-ink uppercase tracking-wider block mb-1.5">
            4. Reason / Symptoms (Optional)
          </label>
          <textarea
            {...register('notes')}
            placeholder="Briefly describe your health symptoms, medical question, or medication refill request..."
            rows={2}
            className="w-full text-xs text-ink bg-white border border-border rounded-control p-2.5 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none resize-none placeholder:text-ink-muted/70"
          />
        </div>

        {/* Summary Footer */}
        <div className="pt-2 border-t border-border-light flex items-center justify-between">
          <div>
            <span className="text-[11px] text-ink-muted block">Total Consultation:</span>
            <span className="text-lg font-extrabold text-ink">₹{activeDoctor?.price || 600}.00</span>
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="md" onClick={closeBookingModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isSubmitting}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm Appointment
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
