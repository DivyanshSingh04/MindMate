import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Bot, Sparkles } from 'lucide-react';
import { MOODS } from './MoodCheckIn';

export default function PastEntries({ entries = [] }) {
  const [expandedId, setExpandedId] = useState(null);

  if (entries.length === 0) {
    return null;
  }

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const getMoodEmoji = (moodId) => {
    const found = MOODS.find(m => m.id === moodId);
    return found ? found.emoji : '😐';
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Your Recent Anonymous Check-Ins</h3>
          <p className="text-xs text-slate-400">Stored safely in your private session</p>
        </div>
        <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-mono">
          {entries.length} Entries
        </span>
      </div>

      <div className="space-y-3">
        {entries.map((entry) => {
          const isExpanded = expandedId === (entry._id || entry.createdAt);
          const date = new Date(entry.createdAt).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div
              key={entry._id || entry.createdAt}
              className="border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition-all bg-slate-50/40"
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(entry._id || entry.createdAt)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold capitalize text-slate-800">
                        {entry.mood}
                      </span>
                      {entry.aiAnalysis?.stressLevel && (
                        <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-200/80 px-2 py-0.5 rounded-full font-medium">
                          {entry.aiAnalysis.stressLevel} Stress
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" /> {date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="hidden sm:flex gap-1">
                      {entry.tags.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="text-[11px] bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3">
                  {entry.journalText && (
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Journal Thought:
                      </span>
                      <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200/60 leading-relaxed">
                        "{entry.journalText}"
                      </p>
                    </div>
                  )}

                  {entry.aiAnalysis?.summary && (
                    <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                      <div className="flex items-center space-x-1 text-emerald-800 text-xs font-bold mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Gemini AI Feedback:</span>
                      </div>
                      <p className="text-xs text-emerald-900 leading-relaxed italic">
                        {entry.aiAnalysis.summary}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
