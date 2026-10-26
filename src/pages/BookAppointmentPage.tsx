import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Video,
  Phone,
  MessageSquare,
  Building2,
  Calendar as CalendarIcon,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  User,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { generateDynamicDate } from '../utils/dates';
import { Doctor } from '../types/doctor';

export const BookAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { doctors, bookAppointment, showToast } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<string>(searchParams.get('type') || 'video');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(() => {
    const docId = searchParams.get('doctor');
    return (docId ? doctors.find(d => d.id === docId) : doctors[0]) || doctors[0];
  });
  const [selectedDate, setSelectedDate] = useState<string>(generateDynamicDate(1));
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const docId = searchParams.get('doctor');
    if (docId) {
      const found = doctors.find(d => d.id === docId);
      if (found) setSelectedDoctor(found);
    }
  }, [searchParams, doctors]);

  const consultationTypes = [
    {
      id: 'video',
      title: 'Video Consultation',
      desc: 'Talk to doctor online via encrypted HD video',
      icon: Video,
      color: 'text-primary bg-primary-light/60',
    },
    {
      id: 'audio',
      title: 'Audio Consultation',
      desc: 'Voice call only for quick follow-ups',
      icon: Phone,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'chat',
      title: 'Chat Consultation',
      desc: 'Text chat and file upload with doctor',
      icon: MessageSquare,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: 'in-person',
      title: 'In-Clinic Appointment',
      desc: 'Visit the clinic in person',
      icon: Building2,
      color: 'text-indigo-600 bg-indigo-50',
    },
  ];

  const availableDates = [
    generateDynamicDate(1),
    generateDynamicDate(2),
    generateDynamicDate(3),
    generateDynamicDate(4),
    generateDynamicDate(5),
  ];

  const availableSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '03:30 PM',
    '04:30 PM',
    '06:00 PM',
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  const handleConfirm = async () => {
    if (!selectedDoctor) return;
    try {
      setIsSubmitting(true);
      await bookAppointment({
        doctorId: selectedDoctor.id,
        date: selectedDate,
        time: selectedTime,
        consultationType: selectedType as any,
        notes,
      });
      setIsSuccess(true);
    } catch (e) {
      console.error(e);
      showToast('Booking failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto py-10 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-ink">Appointment Confirmed!</h2>
        <p className="text-xs text-ink-muted leading-relaxed">
          Your consultation with <strong>{selectedDoctor?.name}</strong> has been scheduled for{' '}
          <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong>.
        </p>
        <div className="pt-4 flex flex-col gap-2.5">
          <button
            onClick={() => navigate('/appointments')}
            className="w-full py-3 rounded-control bg-primary text-white font-bold text-sm shadow-md"
          >
            View My Appointments
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-2.5 rounded-control bg-white border border-border text-ink font-bold text-xs"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto pb-20 pt-2 px-1">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={handleBack}
          className="p-2 rounded-xl bg-white border border-border text-ink-muted hover:text-ink shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-extrabold text-ink">Book Appointment</h1>
        <div className="w-9" />
      </div>

      {/* 4-Step Stepper */}
      <div className="flex items-center justify-between px-4 mb-6">
        {[
          { num: 1, label: 'Type' },
          { num: 2, label: 'Date' },
          { num: 3, label: 'Time' },
          { num: 4, label: 'Details' },
        ].map((s, idx) => (
          <React.Fragment key={s.num}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-primary text-white shadow-md shadow-primary/30 ring-4 ring-primary/20'
                    : step > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-ink-muted'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <span
                className={`text-[10px] font-bold mt-1 ${
                  step >= s.num ? 'text-primary' : 'text-ink-muted'
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < 3 && (
              <div
                className={`flex-1 h-0.5 mx-2 -mt-4 transition-colors ${
                  step > idx + 1 ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* STEP 1: CONSULTATION TYPE */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <h2 className="text-base font-extrabold text-ink">Select Consultation Type</h2>
          <div className="space-y-3">
            {consultationTypes.map(item => {
              const Icon = item.icon;
              const isSelected = selectedType === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedType(item.id)}
                  className={`p-4 rounded-card border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-primary bg-primary-light/20 ring-1 ring-primary shadow-xs'
                      : 'border-border hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-ink">{item.title}</h3>
                      <p className="text-xs text-ink-muted mt-0.5">{item.desc}</p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-primary bg-primary text-white' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 fill-white text-primary" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: DATE SELECTOR */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <h2 className="text-base font-extrabold text-ink">Select Date</h2>
          <div className="space-y-2.5">
            {availableDates.map(dateStr => {
              const d = new Date(dateStr);
              const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
              const monthName = d.toLocaleDateString('en-US', { month: 'short' });
              const dayNum = d.getDate();
              const isSelected = selectedDate === dateStr;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary-light/25 ring-1 ring-primary shadow-xs'
                      : 'border-border bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-ink'
                      }`}
                    >
                      <span className="text-[10px] uppercase">{dayName}</span>
                      <span className="text-base font-extrabold">{dayNum}</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink">
                        {dayName}, {dayNum} {monthName}
                      </h4>
                      <span className="text-[11px] text-emerald-600 font-medium">Available for booking</span>
                    </div>
                  </div>
                  <CalendarIcon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-ink-muted'}`} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: TIME SELECTOR */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <h2 className="text-base font-extrabold text-ink">Select Time Slot</h2>
          <p className="text-xs text-ink-muted">Available slots for {selectedDate}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {availableSlots.map(timeStr => {
              const isSelected = selectedTime === timeStr;
              return (
                <button
                  key={timeStr}
                  type="button"
                  onClick={() => setSelectedTime(timeStr)}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[1.02]'
                      : 'bg-white border-border text-ink hover:border-primary/40'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{timeStr}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & DETAILS */}
      {step === 4 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <h2 className="text-base font-extrabold text-ink">Confirm Consultation</h2>

          {/* Doctor Card */}
          <div className="p-4 rounded-card border border-border bg-white shadow-xs flex items-center gap-3">
            <img
              src={selectedDoctor?.image}
              alt={selectedDoctor?.name}
              className="w-14 h-14 rounded-2xl object-cover shrink-0 ring-1 ring-border"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-primary uppercase block">{selectedDoctor?.specialty}</span>
              <h3 className="text-sm font-extrabold text-ink truncate">{selectedDoctor?.name}</h3>
              <p className="text-xs text-ink-muted truncate">{selectedDoctor?.role}</p>
            </div>
          </div>

          {/* Appointment Details Box */}
          <div className="p-4 rounded-card border border-border bg-slate-50/70 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">Consultation Mode:</span>
              <span className="font-bold text-ink uppercase text-[11px]">{selectedType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">Date & Time:</span>
              <span className="font-bold text-ink">
                {selectedDate} at {selectedTime}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">Consultation Fee:</span>
              <span className="font-extrabold text-primary text-sm">₹{selectedDoctor?.price}</span>
            </div>
          </div>

          {/* Symptoms or Notes */}
          <div>
            <label className="text-xs font-bold text-ink block mb-1">Reason for Visit / Symptoms</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Briefly describe your symptoms or reason for consulting the doctor..."
              rows={3}
              className="w-full text-xs p-3 rounded-xl border border-border bg-white text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-6">
        {step < 4 ? (
          <button
            onClick={handleNext}
            className="w-full py-3.5 rounded-control bg-primary hover:bg-primary-hover active:bg-primary-hover/90 text-white font-bold text-sm shadow-md shadow-primary/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-control bg-gradient-to-r from-primary to-cyan text-white font-bold text-sm shadow-md shadow-cyan/25 hover:shadow-cyan/40 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Scheduling...' : 'Confirm Appointment'}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookAppointmentPage;
