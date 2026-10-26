import mongoose from 'mongoose';
import { MedicalRecord, IMedicalRecord } from '../../models/MedicalRecord.js';
import { IMessageSource } from '../../models/ChatMessage.js';

export class RetrievalService {
  static async getPatientContext(userId: string | mongoose.Types.ObjectId): Promise<{
    contextText: string;
    sources: IMessageSource[];
  }> {
    const records = await MedicalRecord.find({
      userId,
      status: 'completed',
    })
      .sort({ recordDate: -1 })
      .limit(10);

    if (records.length === 0) {
      return { contextText: 'No uploaded medical records found for this patient.', sources: [] };
    }

    const sources: IMessageSource[] = [];
    const sections: string[] = [];

    for (const rec of records) {
      sources.push({
        title: rec.title,
        recordId: rec._id.toString(),
        date: rec.recordDate,
        snippet: rec.aiSummary ? rec.aiSummary.slice(0, 150) + '...' : `${rec.metrics.length} metrics recorded`,
      });

      let recText = `### Document: ${rec.title} (Date: ${rec.recordDate}, Category: ${rec.category})\n`;
      if (rec.aiSummary) {
        recText += `Summary: ${rec.aiSummary}\n`;
      }

      if (rec.metrics && rec.metrics.length > 0) {
        recText += `Metrics:\n`;
        for (const m of rec.metrics) {
          recText += ` - ${m.name}: ${m.value} ${m.unit || ''} (Ref Range: ${m.referenceRange || 'N/A'}, Status: ${m.interpretation || 'normal'})\n`;
        }
      }

      if (rec.aiKeyFindings && rec.aiKeyFindings.length > 0) {
        recText += `Key Findings: ${rec.aiKeyFindings.join('; ')}\n`;
      }

      sections.push(recText);
    }

    return {
      contextText: sections.join('\n\n'),
      sources,
    };
  }
}
