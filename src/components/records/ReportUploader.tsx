import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { medicalRecordService } from '../../services/medicalRecordService';
import { RecordCategory, MedicalRecord } from '../../types/record';
import { useApp } from '../../contexts/AppContext';

interface ReportUploaderProps {
  onUploadSuccess: (record: MedicalRecord) => void;
  onCancel?: () => void;
}

export const ReportUploader: React.FC<ReportUploaderProps> = ({ onUploadSuccess, onCancel }) => {
  const { showToast } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RecordCategory>('lab_report');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [facilityName, setFacilityName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (f: File) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(f.type)) {
      showToast('Only PDF, JPG, PNG, and WebP medical reports are supported.', 'error');
      return;
    }
    if (f.size > 15 * 1024 * 1024) {
      showToast('File size must be under 15MB.', 'error');
      return;
    }
    setFile(f);
    if (!title) {
      setTitle(f.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      showToast('Please select a medical report file to upload', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title || file.name);
      formData.append('category', category);
      formData.append('recordDate', recordDate);
      if (facilityName) formData.append('facilityName', facilityName);
      if (doctorName) formData.append('doctorName', doctorName);

      const res = await medicalRecordService.uploadRecord(formData);
      showToast('Medical document uploaded & analyzed by Genova AI!', 'success');
      onUploadSuccess(res.record);
    } catch (err: any) {
      showToast(err.message || 'Failed to upload medical report', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Dropzone */}
      <div
        onDragOver={e => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-primary bg-primary-light/40 scale-[1.01]'
            : file
            ? 'border-emerald-500 bg-emerald-50/40'
            : 'border-border hover:border-primary/50 bg-slate-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/png,image/jpeg,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {file ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold text-ink truncate max-w-xs">{file.name}</span>
              <span className="block text-[11px] text-ink-muted">
                {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for AI extraction
              </span>
            </div>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setFile(null);
              }}
              className="p-1 rounded-full text-ink-muted hover:text-error hover:bg-red-50 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-cyan/10 text-primary flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-ink">
                Click to upload or drag & drop medical document
              </p>
              <p className="text-[11px] text-ink-muted mt-0.5">
                PDF, JPG, PNG, or WebP up to 15MB. Encrypted in private health locker.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Metadata fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block font-bold text-ink mb-1">Document Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., Annual Lipid Panel, ECG Report"
            className="w-full px-3 py-2 rounded-xl border border-border bg-white text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block font-bold text-ink mb-1">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as RecordCategory)}
            className="w-full px-3 py-2 rounded-xl border border-border bg-white text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          >
            <option value="lab_report">Lab Report / Pathology</option>
            <option value="prescription">Prescription / Medication</option>
            <option value="imaging">Imaging (X-Ray, MRI, CT)</option>
            <option value="discharge_summary">Discharge Summary</option>
            <option value="vaccination">Vaccination Record</option>
            <option value="other">Other Clinical Document</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-ink mb-1">Report Date</label>
          <input
            type="date"
            value={recordDate}
            onChange={e => setRecordDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border bg-white text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block font-bold text-ink mb-1">Facility / Lab Name</label>
          <input
            type="text"
            value={facilityName}
            onChange={e => setFacilityName(e.target.value)}
            placeholder="e.g., Central Diagnostic Labs"
            className="w-full px-3 py-2 rounded-xl border border-border bg-white text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="p-3 bg-slate-50 border border-border-light rounded-xl flex items-center gap-2 text-[11px] text-ink-muted">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>End-to-end encrypted storage. Your health records are never exposed publicly.</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isUploading}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!file || isUploading}
          className="bg-gradient-to-r from-primary to-cyan shadow-md shadow-primary/20"
        >
          {isUploading ? 'Extracting Lab Metrics...' : 'Upload & Process with AI'}
        </Button>
      </div>
    </form>
  );
};
