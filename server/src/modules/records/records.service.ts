import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { MedicalRecord, IMedicalRecord, RecordCategory } from '../../models/MedicalRecord.js';
import { ReportExtractor } from './extractor.js';
import { AuditEvent } from '../../models/AuditEvent.js';
import { Notification } from '../../models/Notification.js';
import { env } from '../../config/env.js';

export class RecordsService {
  static async uploadRecord(
    file: Express.Multer.File,
    data: {
      userId: string | mongoose.Types.ObjectId;
      title: string;
      category?: RecordCategory;
      recordDate?: string;
      facilityName?: string;
      doctorName?: string;
    },
    ip?: string,
    userAgent?: string
  ): Promise<IMedicalRecord> {
    const record = await MedicalRecord.create({
      userId: data.userId,
      title: data.title || file.originalname,
      category: data.category || 'lab_report',
      recordDate: data.recordDate || new Date().toISOString().split('T')[0],
      facilityName: data.facilityName || 'Genova Diagnostic Center',
      doctorName: data.doctorName,
      status: 'processing',
      fileName: file.filename,
      originalFileName: file.originalname,
      mimeType: file.mimetype,
      fileSizeBytes: file.size,
      storagePath: file.path,
    });

    // Run extraction asynchronously
    try {
      const extracted = await ReportExtractor.extractAndAnalyze(file.path, file.mimetype, record.title);

      record.status = 'completed';
      record.extractedText = extracted.extractedText;
      record.metrics = extracted.metrics;
      record.aiSummary = extracted.aiSummary;
      record.aiKeyFindings = extracted.aiKeyFindings;
      record.aiQuestionsForDoctor = extracted.aiQuestionsForDoctor;
      record.aiFollowUpRecommendations = extracted.aiFollowUpRecommendations;
      record.ambiguousValues = extracted.ambiguousValues;
      await record.save();

      await Notification.create({
        userId: data.userId,
        title: 'Report Processed by Genova AI',
        message: `Your medical document "${record.title}" has been indexed and analyzed with plain-language metrics.`,
        type: 'record',
        actionUrl: '/records',
      });
    } catch (extractErr) {
      console.error('[RecordsService] Extraction failure:', extractErr);
      record.status = 'failed';
      await record.save();
    }

    await AuditEvent.create({
      userId: data.userId,
      action: 'record_upload',
      resourceType: 'MedicalRecord',
      resourceId: record._id.toString(),
      ipAddress: ip,
      userAgent,
      status: 'success',
    });

    return record;
  }

  static async getRecords(userId: string | mongoose.Types.ObjectId): Promise<IMedicalRecord[]> {
    return MedicalRecord.find({ userId }).sort({ recordDate: -1, createdAt: -1 });
  }

  static async getRecordById(id: string, userId: string | mongoose.Types.ObjectId): Promise<IMedicalRecord | null> {
    const record = await MedicalRecord.findById(id);
    if (!record) return null;

    if (record.userId.toString() !== userId.toString()) {
      throw { statusCode: 403, message: 'Forbidden. You do not own this medical record.' };
    }

    return record;
  }

  static async deleteRecord(id: string, userId: string | mongoose.Types.ObjectId): Promise<boolean> {
    const record = await MedicalRecord.findById(id);
    if (!record) return false;

    if (record.userId.toString() !== userId.toString()) {
      throw { statusCode: 403, message: 'Forbidden. You do not own this medical record.' };
    }

    // Remove file from disk if present
    try {
      if (fs.existsSync(record.storagePath)) {
        fs.unlinkSync(record.storagePath);
      }
    } catch (e) {
      console.warn('[RecordsService] Error removing file on delete:', e);
    }

    await MedicalRecord.findByIdAndDelete(id);

    await AuditEvent.create({
      userId,
      action: 'record_delete',
      resourceType: 'MedicalRecord',
      resourceId: id,
      status: 'success',
    });

    return true;
  }
}
