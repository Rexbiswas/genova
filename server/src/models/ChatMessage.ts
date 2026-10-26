import mongoose, { Document, Schema } from 'mongoose';

export type MessageSender = 'user' | 'assistant' | 'system';

export interface IMessageSource {
  title: string;
  recordId?: string;
  date?: string;
  snippet?: string;
}

export interface IToolAction {
  toolName: string;
  input: Record<string, any>;
  output?: Record<string, any>;
  status?: 'pending_confirmation' | 'confirmed' | 'cancelled' | 'executed' | 'failed';
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

export interface IChatMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  sender: MessageSender;
  content: string;
  sources?: IMessageSource[];
  toolAction?: IToolAction;
  safetyNote?: string;
  isError?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sender: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    sources: [
      {
        title: { type: String, required: true },
        recordId: { type: String },
        date: { type: String },
        snippet: { type: String },
      },
    ],
    toolAction: {
      toolName: { type: String },
      input: { type: Schema.Types.Mixed },
      output: { type: Schema.Types.Mixed },
      status: {
        type: String,
        enum: ['pending_confirmation', 'confirmed', 'cancelled', 'executed', 'failed'],
      },
      requiresConfirmation: { type: Boolean, default: false },
      confirmationMessage: { type: String },
    },
    safetyNote: { type: String },
    isError: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
