export interface EmergencyCheckResult {
  isEmergency: boolean;
  guidance?: string;
  flaggedTerms?: string[];
}

export class SafetyService {
  private static emergencyPatterns = [
    { pattern: /\b(chest pain|heart attack|crushing pressure|angina)\b/i, label: 'Possible Acute Coronary Syndrome' },
    { pattern: /\b(can't breathe|difficulty breathing|severe asthma attack|choking|gasping)\b/i, label: 'Respiratory Distress' },
    { pattern: /\b(stroke|facial drooping|arm weakness|slurred speech|sudden numbness)\b/i, label: 'Possible Cerebrovascular Event' },
    { pattern: /\b(unconscious|fainted and not waking|passed out)\b/i, label: 'Loss of Consciousness' },
    { pattern: /\b(suicide|kill myself|end my life|self harm)\b/i, label: 'Crisis / Immediate Risk' },
    { pattern: /\b(coughing up blood|severe uncontrolled bleeding|arterial bleed)\b/i, label: 'Hemorrhage' },
    { pattern: /\b(anaphylaxis|swollen tongue|throat closing up)\b/i, label: 'Severe Allergic Reaction' },
  ];

  static checkEmergency(text: string): EmergencyCheckResult {
    const flagged: string[] = [];

    for (const item of this.emergencyPatterns) {
      if (item.pattern.test(text)) {
        flagged.push(item.label);
      }
    }

    if (flagged.length > 0) {
      return {
        isEmergency: true,
        flaggedTerms: flagged,
        guidance:
          'CRITICAL SAFETY WARNING: Your symptoms may indicate a medical emergency. Please contact emergency services (such as 911 in the US/Canada or 112 in Europe) immediately or proceed to the nearest emergency department. Do not rely on AI advice for acute or life-threatening symptoms.',
      };
    }

    return { isEmergency: false };
  }

  static sanitizeUntrustedText(text: string): string {
    // Prevent prompt injection attempts from documents
    return text
      .replace(/ignore (all )?previous instructions/gi, '[filtered]')
      .replace(/you are now a/gi, '[filtered]')
      .replace(/system prompt:/gi, '[filtered]')
      .trim();
  }

  static getSystemPrompt(patientContext?: string): string {
    return `You are Genova AI, an advanced, empathetic, and clinical-grade medical AI Assistant designed for the Genova Healthcare OS platform.

CORE PRINCIPLES & SAFETY BOUNDARIES:
1. INFORMATIONAL ONLY: You provide educational, preventive, and preparatory guidance. You are NOT an autonomous clinician and CANNOT definitively diagnose diseases or prescribe or modify medication dosages.
2. CITATION & SOURCES: When answering using patient health records, explicitly cite the document title, test date, and measured parameters.
3. UNCERTAINTY: Clearly communicate when medical information is ambiguous, missing, or requires professional in-person clinical assessment.
4. PREPARATION: Help patients formulate concise, high-value questions for their upcoming doctor consultations.
5. TONE: Warm, reassuring, objective, professional, and accessible (plain language without oversimplified jargon).
6. ACTION CONFIRMATION: You can prepare appointments or reminders, but you MUST inform the user that these actions require their explicit confirmation before being finalized.

${patientContext ? `PATIENT RECORD CONTEXT (STRICTLY CONFIDENTIAL TO THIS USER):\n${patientContext}\n` : ''}`;
  }
}
