import mongoose from 'mongoose';
import { Conversation } from '../../models/Conversation.js';
import { ChatMessage, IChatMessage, IMessageSource, IToolAction } from '../../models/ChatMessage.js';
import { SafetyService } from './safety.service.js';
import { RetrievalService } from './retrieval.service.js';
import { ToolsService } from './tools.service.js';
import { getAIProvider, AIMessage } from '../../config/aiProvider.js';
import { AuditEvent } from '../../models/AuditEvent.js';

export interface ChatServiceInput {
  conversationId?: string;
  userId: string | mongoose.Types.ObjectId;
  prompt: string;
}

export interface ChatServiceOutput {
  conversationId: string;
  userMessage: IChatMessage;
  assistantMessage: IChatMessage;
}

export class AIService {
  static async handleChat(input: ChatServiceInput): Promise<ChatServiceOutput> {
    const { userId, prompt } = input;

    // 1. Get or create conversation
    let conv = input.conversationId
      ? await Conversation.findOne({ _id: input.conversationId, userId })
      : null;

    if (!conv) {
      conv = await Conversation.create({
        userId,
        title: prompt.slice(0, 36) + (prompt.length > 36 ? '...' : ''),
        lastMessageAt: new Date(),
      });
    } else {
      conv.lastMessageAt = new Date();
      await conv.save();
    }

    // 2. Save User Message
    const userMsg = await ChatMessage.create({
      conversationId: conv._id,
      userId,
      sender: 'user',
      content: prompt,
    });

    // 3. Safety Check: Emergency detection
    const emergency = SafetyService.checkEmergency(prompt);
    if (emergency.isEmergency) {
      const assistantMsg = await ChatMessage.create({
        conversationId: conv._id,
        userId,
        sender: 'assistant',
        content: `🚨 **IMMEDIATE ATTENTION REQUIRED**\n\n${emergency.guidance}\n\n**Detected urgent symptoms:** ${emergency.flaggedTerms?.join(', ')}.\n\n*Please seek immediate emergency medical care or call your local emergency service right now.*`,
        safetyNote: 'Emergency symptoms detected. Escalated to emergency protocol.',
      });

      return {
        conversationId: conv._id.toString(),
        userMessage: userMsg,
        assistantMessage: assistantMsg,
      };
    }

    // 4. Retrieve patient records context
    const { contextText, sources } = await RetrievalService.getPatientContext(userId);

    // 5. Check for Care Coordination Tool Triggers
    let toolAction: IToolAction | undefined = undefined;
    const lowerPrompt = prompt.toLowerCase();

    // Tool: Book / Prepare Appointment
    if ((lowerPrompt.includes('book') || lowerPrompt.includes('schedule')) && (lowerPrompt.includes('appointment') || lowerPrompt.includes('doctor') || lowerPrompt.includes('consultation') || lowerPrompt.includes('cardiologist'))) {
      const res = await ToolsService.prepareAppointment(
        {
          doctorId: 'doc-1',
          date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          time: '10:00 AM',
          consultationType: lowerPrompt.includes('video') ? 'video' : 'in-person',
          notes: prompt,
        },
        userId
      );

      if (res.success) {
        toolAction = {
          toolName: 'prepareAppointment',
          input: res.data,
          requiresConfirmation: true,
          confirmationMessage: res.confirmationMessage,
          status: 'pending_confirmation',
        };
      }
    }
    // Tool: View My Appointments
    else if (lowerPrompt.includes('my appointment') || lowerPrompt.includes('upcoming consultation') || lowerPrompt.includes('when is my appointment')) {
      const res = await ToolsService.getMyAppointments(userId);
      toolAction = {
        toolName: 'getMyAppointments',
        input: {},
        output: res.data,
        status: 'executed',
      };
    }
    // Tool: Doctor Search
    else if (lowerPrompt.includes('find doctor') || lowerPrompt.includes('search doctor') || lowerPrompt.includes('cardiologist') || lowerPrompt.includes('pediatrician') || lowerPrompt.includes('dermatologist')) {
      let specialty = '';
      if (lowerPrompt.includes('cardio')) specialty = 'Cardiology';
      else if (lowerPrompt.includes('pediatric')) specialty = 'Pediatrics';
      else if (lowerPrompt.includes('derm')) specialty = 'Dermatology';
      else if (lowerPrompt.includes('gastro')) specialty = 'Gastroenterology';

      const res = await ToolsService.searchDoctors({ specialty, query: prompt });
      if (res.success && res.data?.length > 0) {
        toolAction = {
          toolName: 'searchDoctors',
          input: { specialty, query: prompt },
          output: res.data,
          status: 'executed',
        };
      }
    }

    // 6. Generate Response (LLM or Clinical Assistant)
    let replyText = '';
    const provider = getAIProvider();

    if (provider) {
      try {
        // Fetch recent messages for conversational context
        const pastMessages = await ChatMessage.find({ conversationId: conv._id })
          .sort({ createdAt: -1 })
          .limit(6);
        pastMessages.reverse();

        const messages: AIMessage[] = pastMessages.map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.content,
        }));

        replyText = await provider.generateText({
          messages,
          systemInstruction: SafetyService.getSystemPrompt(contextText),
          temperature: 0.3,
        });
      } catch (err) {
        console.warn('[AIService] Provider call failed, utilizing clinical assistant fallback:', err);
        replyText = this.generateClinicalFallback(prompt, contextText, toolAction);
      }
    } else {
      replyText = this.generateClinicalFallback(prompt, contextText, toolAction);
    }

    // 7. Save Assistant Message
    const assistantMsg = await ChatMessage.create({
      conversationId: conv._id,
      userId,
      sender: 'assistant',
      content: replyText,
      sources: sources.length > 0 ? sources : undefined,
      toolAction,
      safetyNote: 'Genova AI provides clinical information for educational & coordination purposes and is not a substitute for professional medical diagnosis.',
    });

    await AuditEvent.create({
      userId,
      action: 'ai_query',
      resourceType: 'Conversation',
      resourceId: conv._id.toString(),
      details: { promptLength: prompt.length, toolUsed: toolAction?.toolName },
      status: 'success',
    });

    return {
      conversationId: conv._id.toString(),
      userMessage: userMsg,
      assistantMessage: assistantMsg,
    };
  }

  private static generateClinicalFallback(prompt: string, contextText: string, toolAction?: IToolAction): string {
    const p = prompt.toLowerCase();

    if (toolAction?.toolName === 'prepareAppointment') {
      return `I have prepared your appointment request with **${toolAction.input.doctorName}** (${toolAction.input.doctorSpecialty}).\n\n- **Date:** ${toolAction.input.date}\n- **Time:** ${toolAction.input.time}\n- **Consultation Type:** ${toolAction.input.consultationType}\n- **Fee:** $${toolAction.input.price}\n\n⚠️ **Action Confirmation Required:** Please review the details above and click **"Confirm Booking"** below to finalize this appointment on the hospital scheduling system.`;
    }

    if (toolAction?.toolName === 'getMyAppointments') {
      const apts = toolAction.output || [];
      if (apts.length === 0) {
        return `You currently have no scheduled appointments. Would you like me to help you find a doctor or book a consultation?`;
      }
      return `Here are your scheduled appointments from your Genova record:\n\n` +
        apts.map((a: any) => `• **${a.doctorName}** (${a.doctorSpecialty}) on **${a.date}** at **${a.time}** [${a.status.toUpperCase()}]`).join('\n') +
        `\n\nWould you like me to prepare questions for your consultation or schedule a reminder?`;
    }

    if (toolAction?.toolName === 'searchDoctors') {
      const docs = toolAction.output || [];
      return `I found verified specialists available on the Genova network:\n\n` +
        docs.map((d: any) => `• **${d.name}** — ${d.role} (${d.city}) • Rating: ★ ${d.rating} • Fee: $${d.price}`).join('\n') +
        `\n\nWould you like me to check open time slots or prepare a booking with any of these physicians?`;
    }

    if (p.includes('cholesterol') || p.includes('lipid') || p.includes('hdl') || p.includes('ldl')) {
      return `### Understanding Lipid & Cholesterol Levels\n\nLipids are fatty substances essential for cellular function, but maintaining optimal balances is key for cardiovascular protection:\n\n1. **LDL (Low-Density Lipoprotein):** Often termed "bad" cholesterol because elevated levels can accumulate along arterial walls. Desirable: < 100 mg/dL.\n2. **HDL (High-Density Lipoprotein):** The "protective" cholesterol that transports lipids back to the liver. Desirable: > 50 mg/dL.\n3. **Triglycerides:** Fats stored in adipose tissue used for energy. Optimal: < 150 mg/dL.\n\n**Questions to ask your doctor:**\n• "Are my current lipid markers aligned with my personal cardiovascular risk profile?"\n• "Would dietary modifications (such as Mediterranean-style nutrition) or a statin be recommended for me?"\n\n*Note: This information is educational. Please review your personalized lab report with your cardiologist.*`;
    }

    if (p.includes('blood pressure') || p.includes('hypertension')) {
      return `### Blood Pressure Overview\n\nBlood pressure readings are expressed as two numbers:\n- **Systolic (top number):** Pressure when the heart contracts (Normal: < 120 mmHg).\n- **Diastolic (bottom number):** Pressure when the heart rests between beats (Normal: < 80 mmHg).\n\n**Preventive measures:** Regular aerobic exercise, limiting sodium to under 2,000 mg/day, managing stress, and maintaining consistent hydration.\n\n**Recommended questions for your physician:**\n• "What is my target resting blood pressure based on my age and medical history?"\n• "Should I log daily home readings prior to our next visit?"`;
    }

    if (p.includes('prepare questions') || p.includes('questions for doctor') || p.includes('doctor visit')) {
      return `### High-Yield Questions to Prepare for Your Doctor\n\nTo maximize the value of your upcoming consultation, consider asking:\n\n1. **Diagnosis & Symptoms:** "What are the most likely causes of the symptoms I have been experiencing?"\n2. **Diagnostic Tests:** "Are there specific blood tests or imaging required, and how should I prepare?"\n3. **Treatment Options:** "What are the treatment options, including lifestyle modifications versus medications?"\n4. **Risks & Benefits:** "What are the common side effects of any proposed therapy?"\n5. **Follow-Up:** "What timeline should I expect for symptom improvement, and when should I schedule a follow-up?"\n\nWould you like to customize these questions based on a specific symptom or your uploaded lab records?`;
    }

    return `Hello! I am your **Genova AI Health Assistant**. I can help you understand your medical reports, prepare questions for your physician consultations, coordinate appointments with verified doctors, and explore preventive health insights.\n\nHow can I support your health journey today? Feel free to ask about:\n• Explaining medical lab terms (e.g., CBC, lipid panel, HbA1c)\n• Finding a physician in a specific specialty\n• Preparing questions for an upcoming consultation\n• Reviewing your scheduled appointments`;
  }
}
