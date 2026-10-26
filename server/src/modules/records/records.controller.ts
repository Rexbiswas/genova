import { Response, NextFunction } from 'express';
import fs from 'fs';
import { AuthenticatedRequest } from '../../middleware/authenticate.js';
import { RecordsService } from './records.service.js';
import { AuditEvent } from '../../models/AuditEvent.js';

export class RecordsController {
  static async uploadRecord(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file;
      const user = req.user!;

      if (!file) {
        res.status(400).json({ success: false, message: 'Please provide a medical report file (PDF or image).' });
        return;
      }

      const { title, category, recordDate, facilityName, doctorName } = req.body;

      const record = await RecordsService.uploadRecord(
        file,
        {
          userId: user._id,
          title: title || file.originalname,
          category,
          recordDate,
          facilityName,
          doctorName,
        },
        req.ip,
        req.headers['user-agent']
      );

      res.status(201).json({
        success: true,
        message: 'Medical report uploaded and queued for AI analysis',
        record: {
          id: record._id.toString(),
          title: record.title,
          category: record.category,
          recordDate: record.recordDate,
          facilityName: record.facilityName,
          doctorName: record.doctorName,
          status: record.status,
          fileSizeBytes: record.fileSizeBytes,
          mimeType: record.mimeType,
          metrics: record.metrics,
          aiSummary: record.aiSummary,
          aiKeyFindings: record.aiKeyFindings,
          aiQuestionsForDoctor: record.aiQuestionsForDoctor,
          aiFollowUpRecommendations: record.aiFollowUpRecommendations,
          ambiguousValues: record.ambiguousValues,
          createdAt: record.createdAt.toISOString(),
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getRecords(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      const records = await RecordsService.getRecords(user._id);

      res.json(
        records.map(r => ({
          id: r._id.toString(),
          title: r.title,
          category: r.category,
          recordDate: r.recordDate,
          facilityName: r.facilityName,
          doctorName: r.doctorName,
          status: r.status,
          fileSizeBytes: r.fileSizeBytes,
          mimeType: r.mimeType,
          metrics: r.metrics,
          aiSummary: r.aiSummary,
          aiKeyFindings: r.aiKeyFindings,
          aiQuestionsForDoctor: r.aiQuestionsForDoctor,
          aiFollowUpRecommendations: r.aiFollowUpRecommendations,
          ambiguousValues: r.ambiguousValues,
          createdAt: r.createdAt.toISOString(),
        }))
      );
    } catch (err) {
      next(err);
    }
  }

  static async getRecordById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const user = req.user!;

      const record = await RecordsService.getRecordById(id, user._id);
      if (!record) {
        res.status(404).json({ success: false, message: 'Medical record not found' });
        return;
      }

      await AuditEvent.create({
        userId: user._id,
        action: 'record_view',
        resourceType: 'MedicalRecord',
        resourceId: id,
        status: 'success',
      });

      res.json({
        id: record._id.toString(),
        title: record.title,
        category: record.category,
        recordDate: record.recordDate,
        facilityName: record.facilityName,
        doctorName: record.doctorName,
        status: record.status,
        fileSizeBytes: record.fileSizeBytes,
        mimeType: record.mimeType,
        metrics: record.metrics,
        aiSummary: record.aiSummary,
        aiKeyFindings: record.aiKeyFindings,
        aiQuestionsForDoctor: record.aiQuestionsForDoctor,
        aiFollowUpRecommendations: record.aiFollowUpRecommendations,
        ambiguousValues: record.ambiguousValues,
        createdAt: record.createdAt.toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  static async downloadRecordFile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const user = req.user!;

      const record = await RecordsService.getRecordById(id, user._id);
      if (!record) {
        res.status(404).json({ success: false, message: 'Medical record not found' });
        return;
      }

      if (!fs.existsSync(record.storagePath)) {
        res.status(404).json({ success: false, message: 'Original file attachment is missing on server' });
        return;
      }

      await AuditEvent.create({
        userId: user._id,
        action: 'record_download',
        resourceType: 'MedicalRecord',
        resourceId: id,
        status: 'success',
      });

      res.setHeader('Content-Type', record.mimeType);
      res.download(record.storagePath, record.originalFileName);
    } catch (err) {
      next(err);
    }
  }

  static async explainRecord(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const user = req.user!;

      const record = await RecordsService.getRecordById(id, user._id);
      if (!record) {
        res.status(404).json({ success: false, message: 'Medical record not found' });
        return;
      }

      await AuditEvent.create({
        userId: user._id,
        action: 'record_explain',
        resourceType: 'MedicalRecord',
        resourceId: id,
        status: 'success',
      });

      res.json({
        id: record._id.toString(),
        title: record.title,
        status: record.status,
        metrics: record.metrics,
        aiSummary: record.aiSummary,
        aiKeyFindings: record.aiKeyFindings,
        aiQuestionsForDoctor: record.aiQuestionsForDoctor,
        aiFollowUpRecommendations: record.aiFollowUpRecommendations,
        ambiguousValues: record.ambiguousValues,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteRecord(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const user = req.user!;

      const success = await RecordsService.deleteRecord(id, user._id);
      if (!success) {
        res.status(404).json({ success: false, message: 'Medical record not found' });
        return;
      }

      res.json({ success: true, message: 'Medical record deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}
