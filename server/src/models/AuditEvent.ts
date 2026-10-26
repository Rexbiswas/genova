import mongoose, { Document, Schema } from 'mongoose';

export type AuditAction =
  | 'user_login'
  | 'user_logout'
  | 'user_register'
  | 'record_upload'
  | 'record_view'
  | 'record_download'
  | 'record_explain'
  | 'record_delete'
  | 'consent_grant'
  | 'consent_revoke'
  | 'appointment_create'
  | 'appointment_cancel'
  | 'appointment_reschedule'
  | 'ai_query'
  | 'ai_tool_executed'
  | 'unauthorized_access_attempt';

export interface IAuditEvent extends Document {
  userId?: mongoose.Types.ObjectId;
  actorRole?: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  status: 'success' | 'failure' | 'blocked';
  timestamp: Date;
}

const AuditEventSchema = new Schema<IAuditEvent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    actorRole: { type: String },
    action: { type: String, required: true, index: true },
    resourceType: { type: String, required: true, index: true },
    resourceId: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    details: { type: Schema.Types.Mixed },
    status: { type: String, enum: ['success', 'failure', 'blocked'], default: 'success' },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export const AuditEvent = mongoose.model<IAuditEvent>('AuditEvent', AuditEventSchema);
