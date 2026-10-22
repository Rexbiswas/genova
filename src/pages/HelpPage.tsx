import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supportTicketSchema, SupportTicketFormData } from '../utils/validation';
import { supportService } from '../services/supportService';
import {
  ChevronLeft,
  Search,
  ChevronDown,
  Calendar,
  CreditCard,
  User,
  Shield,
  MessageSquare,
  Send,
  X,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const HelpPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupportTicketFormData>({
    resolver: zodResolver(supportTicketSchema),
    defaultValues: {
      subject: '',
      priority: 'normal',
      message: '',
    },
  });

  const popularTopics = [
    { title: 'Appointments', icon: Calendar, color: 'text-primary bg-primary/10' },
    { title: 'Payments', icon: CreditCard, color: 'text-cyan bg-cyan/15' },
    { title: 'Account', icon: User, color: 'text-indigo-600 bg-indigo-50' },
    { title: 'Privacy', icon: Shield, color: 'text-emerald-600 bg-emerald-50' },
  ];

  const faqs = [
    {
      q: 'How to book an appointment?',
      a: 'Navigate to Find Doctors or click the Consultation Shortcuts on the home screen. Select your physician, choose an available time slot, confirm consultation type (video or in-clinic), and complete your booking in 4 easy steps.',
    },
    {
      q: 'How to reschedule or cancel?',
      a: 'Go to "My Appointments" via the bottom navigation bar. Find your appointment card, select the details and choose "Reschedule" to pick a new date or "Cancel" if you cannot attend.',
    },
    {
      q: 'Is online consultation safe?',
      a: 'Yes, 100%. All Genova video and audio consultations are end-to-end encrypted and fully HIPAA-compliant. Only you and your certified doctor have access to the session.',
    },
    {
      q: 'How do I update my profile?',
      a: 'Tap "Profile" on the bottom navigation bar. You can edit your legal name, email, phone number, location, and click "Save Changes".',
    },
  ];

  const filteredFaqs = faqs.filter(
    f =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onSubmit = async (data: SupportTicketFormData) => {
    try {
      await supportService.submitTicket(data);
      showToast('Support ticket submitted successfully (Demo)!', 'success');
      reset();
      setSupportModalOpen(false);
    } catch {
      showToast('Failed to submit ticket', 'error');
    }
  };

  return (
    <div className="space-y-5 pb-12 max-w-lg mx-auto">
      {/* Top Header (Screen 9) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 -ml-1.5 text-ink-muted hover:text-ink rounded-lg transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 text-ink" />
          </button>
          <h1 className="text-xl font-extrabold text-ink tracking-tight">Help Center</h1>
        </div>
      </div>

      {/* Search Input Bar (Screen 9) */}
      <div className="relative flex items-center bg-white border border-border rounded-xl px-3.5 py-2.5 shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
        <Search className="w-4 h-4 text-ink-muted shrink-0 mr-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search for help..."
          className="w-full text-xs sm:text-sm font-medium text-ink bg-transparent outline-none placeholder:text-ink-muted/70"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-ink-muted hover:text-ink p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Popular Topics 2x2 Grid (Screen 9) */}
      <div className="space-y-2.5">
        <h2 className="text-sm font-bold text-ink">Popular Topics</h2>
        <div className="grid grid-cols-2 gap-3">
          {popularTopics.map(topic => {
            const Icon = topic.icon;
            return (
              <div
                key={topic.title}
                onClick={() => setSearchQuery(topic.title)}
                className="bg-white rounded-2xl border border-border p-3.5 flex items-center gap-3 shadow-xs hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${topic.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-ink group-hover:text-primary transition-colors">
                  {topic.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Frequently Asked Questions (Screen 9) */}
      <div className="space-y-2.5 pt-1">
        <h2 className="text-sm font-bold text-ink">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-border overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-3.5 text-left text-xs sm:text-sm font-bold text-ink hover:text-primary transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-ink-muted shrink-0 transition-transform duration-200 ml-2 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-3.5 pt-0 text-xs text-ink-muted leading-relaxed border-t border-border-light/60 bg-slate-50/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Support Fixed/Bottom Action Button (Screen 9) */}
      <div className="pt-2">
        <button
          onClick={() => setSupportModalOpen(true)}
          className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Contact Support</span>
        </button>
      </div>

      {/* Contact Support Modal */}
      {supportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-base font-extrabold text-ink">Clinical Support Desk</h3>
              <button
                onClick={() => setSupportModalOpen(false)}
                className="p-1 text-ink-muted hover:text-ink cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-ink uppercase tracking-wider block mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  {...register('subject')}
                  placeholder="e.g. Appointment change, Billing query"
                  className="w-full text-xs font-semibold text-ink bg-slate-50 border border-border rounded-xl p-3 focus:border-primary focus:bg-white outline-none"
                />
                {errors.subject && <p className="text-xs text-error mt-0.5">{errors.subject.message}</p>}
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink uppercase tracking-wider block mb-1">
                  Message
                </label>
                <textarea
                  {...register('message')}
                  rows={4}
                  placeholder="Explain how we can help you..."
                  className="w-full text-xs font-semibold text-ink bg-slate-50 border border-border rounded-xl p-3 focus:border-primary focus:bg-white outline-none resize-none"
                />
                {errors.message && <p className="text-xs text-error mt-0.5">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-md shadow-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpPage;

