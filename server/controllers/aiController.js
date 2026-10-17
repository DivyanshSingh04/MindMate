import { GoogleGenAI } from '@google/genai';

/**
 * Intelligent fallback generator in case API key is missing or quota is exhausted.
 * Ensures the student demo always works seamlessly!
 */
const generateFallbackAnalysis = (journalText, moodScore) => {
  const lower = journalText.toLowerCase();
  const triggers = [];
  let burnoutScore = 25;
  let stressLevel = 'Low';

  if (lower.includes('exam') || lower.includes('test') || lower.includes('assignment') || lower.includes('submission')) {
    triggers.push('Academic deadlines & exams');
    burnoutScore += 35;
  }
  if (lower.includes('tired') || lower.includes('sleep') || lower.includes('exhausted') || lower.includes('drained')) {
    triggers.push('Sleep deficit & physical fatigue');
    burnoutScore += 25;
  }
  if (lower.includes('alone') || lower.includes('lonely') || lower.includes('friend') || lower.includes('fight')) {
    triggers.push('Interpersonal & social dynamics');
    burnoutScore += 20;
  }
  if (moodScore <= 2) {
    burnoutScore = Math.min(95, burnoutScore + 20);
  }

  if (burnoutScore >= 75) stressLevel = 'Severe';
  else if (burnoutScore >= 50) stressLevel = 'High';
  else if (burnoutScore >= 30) stressLevel = 'Moderate';

  return {
    burnoutScore: Math.min(100, burnoutScore),
    stressLevel,
    sentiment: moodScore <= 2 ? 'Anxious & Overburdened' : moodScore === 3 ? 'Reflective / Steady' : 'Positive & Optimistic',
    primaryTriggers: triggers.length > 0 ? triggers : ['General academic routine'],
    summary: journalText.length > 0
      ? `Your thoughts indicate you are managing several responsibilities. Noticeable emphasis on ${triggers[0] || 'daily schedule'}. Taking structured micro-breaks will help reset your cognitive bandwidth.`
      : 'Quick check-in recorded. Remember to stay hydrated and take a pause when tension builds up.',
    copingRecommendations: [
      {
        type: 'breathing',
        title: '4-7-8 Parasympathetic Reset',
        duration: '3 mins',
        instruction: 'Inhale through nose for 4 seconds, hold gently for 7 seconds, exhale audibly through mouth for 8 seconds. Repeat 4 times.'
      },
      {
        type: 'study-break',
        title: '20-20-20 Visual Refresh',
        duration: '5 mins',
        instruction: 'Every 20 minutes, look at an object at least 20 feet away for 20 seconds. Stand up and roll your shoulders.'
      },
      {
        type: 'walk',
        title: 'Unplugged Mindful Stroll',
        duration: '10 mins',
        instruction: 'Take a short lap around your campus or room without checking your phone. Pay attention to 3 things you hear and 3 colors you see.'
      },
      {
        type: 'music',
        title: 'Binaural Alpha Waves / Lo-Fi Focus',
        duration: '15 mins',
        instruction: 'Listen to 60 BPM ambient or lo-fi beats to synchronize brainwaves to a calm, focused flow state.'
      }
    ]
  };
};

/**
 * Controller to analyze journal entries with Gemini AI
 */
export const analyzeJournalEntry = async (req, res) => {
  try {
    const { journalText = '', mood = 'meh', moodScore = 3 } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key or empty journal, use safe intelligent fallback
    if (!apiKey || apiKey === 'your_gemini_api_key_here' || !journalText.trim()) {
      const fallbackResult = generateFallbackAnalysis(journalText, moodScore);
      return res.status(200).json({
        success: true,
        source: apiKey ? 'heuristic' : 'fallback-mode',
        analysis: fallbackResult
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
You are MindMate, an empathetic, supportive, clinical-psychologist-reviewed AI assistant for college and university students.
Analyze this student's daily mood log and optional journal entry with 100% judgment-free empathy.

Input Data:
- Selected Mood: "${mood}" (Score 1 to 5, where 1 is Awful and 5 is Rad)
- Student's Journal / Thoughts: "${journalText}"

Task:
Perform a structured analysis identifying burnout signals, anxiety indicators, and academic stress patterns.
Suggest personalized, evidence-based coping activities specifically suitable for a student (e.g. breathing exercises, walks, lo-fi music, study breaks, grounding).

Respond ONLY with valid JSON with this exact schema:
{
  "burnoutScore": <integer between 0 and 100>,
  "stressLevel": <"Low" | "Moderate" | "High" | "Severe">,
  "sentiment": <short descriptive phrase like "Overwhelmed with deadlines" or "Calm & Focused">,
  "primaryTriggers": [<array of short strings identifying triggers, e.g. "Exams", "Sleep deprivation">],
  "summary": <compassionate 2-3 sentence validation of their state and encouragement>,
  "copingRecommendations": [
    {
      "type": <"breathing" | "walk" | "music" | "study-break" | "grounding">,
      "title": <catchy action title>,
      "duration": <e.g. "3 mins", "10 mins">,
      "instruction": <concise, step-by-step guidance>
    }
  ]
}
Do not include markdown backticks or any preamble. Output pure JSON only.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt
      });

      const rawText = response.text || '';
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedAnalysis = JSON.parse(cleanJson);

      return res.status(200).json({
        success: true,
        source: 'gemini-ai',
        analysis: parsedAnalysis
      });
    } catch (geminiError) {
      console.warn('Gemini API call failed or timed out, utilizing fallback:', geminiError.message);
      const fallbackResult = generateFallbackAnalysis(journalText, moodScore);
      return res.status(200).json({
        success: true,
        source: 'fallback-after-error',
        analysis: fallbackResult
      });
    }
  } catch (error) {
    console.error('Error in analyzeJournalEntry:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process journal analysis',
      error: error.message
    });
  }
};
