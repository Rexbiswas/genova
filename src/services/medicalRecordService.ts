import { apiFetch, API_BASE_URL } from './apiClient';
import { MedicalRecord } from '../types/record';

export const medicalRecordService = {
  async getRecords(): Promise<MedicalRecord[]> {
    return apiFetch<MedicalRecord[]>('/records');
  },

  async getRecordById(id: string): Promise<MedicalRecord> {
    return apiFetch<MedicalRecord>(`/records/${id}`);
  },

  async uploadRecord(formData: FormData): Promise<{ success: boolean; record: MedicalRecord }> {
    return apiFetch<{ success: boolean; record: MedicalRecord }>('/records/upload', {
      method: 'POST',
      body: formData,
    });
  },

  async explainRecord(id: string): Promise<Partial<MedicalRecord>> {
    return apiFetch<Partial<MedicalRecord>>(`/records/${id}/explain`, {
      method: 'POST',
    });
  },

  async deleteRecord(id: string): Promise<void> {
    await apiFetch(`/records/${id}`, {
      method: 'DELETE',
    });
  },

  getDownloadUrl(id: string): string {
    return `${API_BASE_URL}/records/${id}/download`;
  },
};
