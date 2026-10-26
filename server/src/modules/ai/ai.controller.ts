import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/authenticate.js';
import { AIService } from './ai.service.js';
import { ToolsService } from './tools.service.js';
import { Conversation } from '../../models/Conversation.js';
import { ChatMessage } from '../../models/ChatMessage.js';

export class AIController {
  static async chat(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { prompt, conversationId } = req.body;
      const user = req.user!;

      if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        res.status(400).json({ success: false, message: 'Prompt is required' });
        return;
      }

      const result = await AIService.handleChat({
        conversationId,
        userId: user._id,
        prompt: prompt.trim(),
      });

      res.status(200).json({
        success: true,
        conversationId: result.conversationId,
        userMessage: {
          id: result.userMessage._id.toString(),
          sender: result.userMessage.sender,
          content: result.userMessage.content,
          createdAt: result.userMessage.createdAt.toISOString(),
        },
        assistantMessage: {
          id: result.assistantMessage._id.toString(),
          sender: result.assistantMessage.sender,
          content: result.assistantMessage.content,
          sources: result.assistantMessage.sources,
          toolAction: result.assistantMessage.toolAction,
          safetyNote: result.assistantMessage.safetyNote,
          createdAt: result.assistantMessage.createdAt.toISOString(),
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getConversations(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      const conversations = await Conversation.find({ userId: user._id })
        .sort({ lastMessageAt: -1 })
        .limit(20);

      res.json(
        conversations.map(c => ({
          id: c._id.toString(),
          title: c.title,
          lastMessageAt: c.lastMessageAt.toISOString(),
          createdAt: c.createdAt.toISOString(),
        }))
      );
    } catch (err) {
      next(err);
    }
  }

  static async getConversationById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user!;

      const conversation = await Conversation.findOne({ _id: id, userId: user._id });
      if (!conversation) {
        res.status(404).json({ success: false, message: 'Conversation not found' });
        return;
      }

      const messages = await ChatMessage.find({ conversationId: id, userId: user._id }).sort({ createdAt: 1 });

      res.json({
        id: conversation._id.toString(),
        title: conversation.title,
        lastMessageAt: conversation.lastMessageAt.toISOString(),
        messages: messages.map(m => ({
          id: m._id.toString(),
          sender: m.sender,
          content: m.content,
          sources: m.sources,
          toolAction: m.toolAction,
          safetyNote: m.safetyNote,
          createdAt: m.createdAt.toISOString(),
        })),
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteConversation(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user!;

      const conv = await Conversation.findOneAndDelete({ _id: id, userId: user._id });
      if (!conv) {
        res.status(404).json({ success: false, message: 'Conversation not found' });
        return;
      }

      await ChatMessage.deleteMany({ conversationId: id });
      res.json({ success: true, message: 'Conversation deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async confirmToolAction(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { toolName, inputData } = req.body;
      const user = req.user!;

      if (toolName === 'prepareAppointment' || toolName === 'confirmAppointment') {
        const result = await ToolsService.confirmAppointment(inputData, user._id);
        res.json(result);
        return;
      }

      if (toolName === 'createReminder') {
        const result = await ToolsService.createReminder(inputData, user._id);
        res.json(result);
        return;
      }

      res.status(400).json({ success: false, message: `Unsupported tool confirmation: ${toolName}` });
    } catch (err) {
      next(err);
    }
  }
}
