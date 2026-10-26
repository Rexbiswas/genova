import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FolderHeart, Plus, Search, ShieldCheck, Filter, FileText, Pill, ArrowRight } from 'lucide-react';
import { MedicalRecord, RecordCategory } from '../types/record';
import { medicalRecordService } from '../services/medicalRecordService';
import { MedicalRecordCard } from '../components/records/MedicalRecordCard';
import { ReportDetails } from '../components/records/ReportDetails';
import { ReportUploader } from '../components/records/ReportUploader';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { useApp } from '../contexts/AppContext';

export const HealthRecordsPage: React.FC = () => {
  const { showToast } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchParams.get('tab') === 'medications') {
      navigate('/medications', { replace: true });
      return;
    }
    loadRecords();
  }, [searchParams, navigate]);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await medicalRecordService.getRecords();
      setRecords(data);

      const targetId = searchParams.get('recordId');
      if (targetId) {
        const found = data.find(r => r.id === targetId);
        if (found) setSelectedRecord(found);
      } else if (data.length > 0 && !selectedRecord) {
        setSelectedRecord(data[0]);
      }
    } catch {
      // Ignored if offline
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(r => {
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesQuery = !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.facilityName && r.facilityName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const categories = [
    { id: 'all', label: 'All Documents' },
    { id: 'lab_report', label: 'Lab Reports' },
    { id: 'prescription', label: 'Prescriptions' },
    { id: 'imaging', label: 'Imaging & Scans' },
    { id: 'discharge_summary', label: 'Summaries' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-cyan text-white flex items-center justify-center shadow-md shadow-primary/25">
            <FolderHeart className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-ink tracking-tight flex items-center gap-2">
              <span>Digital Health Locker</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase border border-emerald-200">
                Encrypted Vault
              </span>
            </h1>
            <p className="text-xs text-ink-muted">
              Securely store, organize, and auto-explain medical reports with Genova AI.
            </p>
          </div>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-cyan text-white text-xs sm:text-sm font-bold shadow-md shadow-primary/20 hover:opacity-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Medical Record</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs" data-lenis-prevent>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white border border-border text-ink-muted hover:text-ink hover:bg-slate-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search records by title, clinic..."
            className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl bg-white border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Main Locker Grid */}
      {filteredRecords.length === 0 ? (
        <EmptyState
          title="No Medical Records in this Category"
          description="Upload your blood tests, pathology reports, or prescriptions to receive automated AI explanations and metric tracking."
          actionLabel="Upload First Report"
          onAction={() => setUploadModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Records Cards List */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block px-1">
              {filteredRecords.length} Documents in Locker
            </span>

            <div className="space-y-2.5">
              {filteredRecords.map(rec => (
                <MedicalRecordCard
                  key={rec.id}
                  record={rec}
                  isSelected={selectedRecord?.id === rec.id}
                  onSelect={() => setSelectedRecord(rec)}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Detailed Report & AI Explanation */}
          <div className="lg:col-span-7">
            {selectedRecord ? (
              <ReportDetails
                record={selectedRecord}
                onDeleteSuccess={() => {
                  loadRecords();
                  setSelectedRecord(null);
                }}
              />
            ) : (
              <div className="p-12 text-center text-xs text-ink-muted bg-white border border-border rounded-3xl">
                Select a document from the list to view extracted lab metrics and plain-language AI explanation.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Medical Document to Locker"
      >
        <ReportUploader
          onUploadSuccess={record => {
            setUploadModalOpen(false);
            loadRecords();
            setSelectedRecord(record);
          }}
          onCancel={() => setUploadModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default HealthRecordsPage;
