import React from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';

const QUICK_PROMPTS = [
  "Stressed about tomorrow's presentation...",
  "Studied for 6 hours straight and brain is mush.",
  "Had a good conversation with friends and feel lighter.",
  "Feeling overwhelmed by multiple assignment deadlines."
];

export default function JournalEditor({
  journalText,
  onChangeText,
  onAnalyze,
  isAnalyzing,
  selectedMood
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Journal Your Thoughts <span className="text-xs text-slate-400 font-normal">(Optional)</span>
          </h2>
          <p className="text-sm text-slate-500">
            Write anything freely. Gemini AI analyzes stress and burnout patterns with zero judgment.
          </p>
        </div>
        <div className="text-xs text-slate-400">
          {journalText.length} characters
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="text-xs text-slate-400 self-center mr-1">Quick ideas:</span>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onChangeText(prompt)}
            className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200/60 transition-colors"
          >
            "{prompt}"
          </button>
        ))}
      </div>

      {/* Text Area */}
      <div className="relative mb-4">
        <textarea
          rows={4}
          value={journalText}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="What's sitting on your mind right now? Any impending deadlines, anxiety, or small wins you had today?..."
          className="w-full rounded-xl border border-slate-200 p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all resize-y"
        />
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 italic">
          💡 Entries are saved locally & anonymously.
        </span>

        <button
          type="button"
          disabled={!selectedMood || isAnalyzing}
          onClick={onAnalyze}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2 transition-all ${
            !selectedMood || isAnalyzing
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 active:scale-95'
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing with Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Log & Analyze Mood</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
