import React from 'react';

export const MOODS = [
  { id: 'rad', emoji: '🤩', label: 'Rad', score: 5, color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50 border-amber-300' },
  { id: 'good', emoji: '😊', label: 'Good', score: 4, color: 'from-emerald-400 to-green-500', bg: 'bg-emerald-50 border-emerald-300' },
  { id: 'meh', emoji: '😐', label: 'Meh', score: 3, color: 'from-sky-400 to-blue-500', bg: 'bg-sky-50 border-sky-300' },
  { id: 'bad', emoji: '😔', label: 'Bad', score: 2, color: 'from-indigo-400 to-purple-500', bg: 'bg-indigo-50 border-indigo-300' },
  { id: 'awful', emoji: '😭', label: 'Awful', score: 1, color: 'from-rose-400 to-red-500', bg: 'bg-rose-50 border-rose-300' },
];

export const AVAILABLE_TAGS = [
  'Upcoming Exams',
  'Project Submission',
  'Sleep Deprivation',
  'Social Battery Drained',
  'Internship & Career',
  'Campus Life',
  'Family Pressure',
  'Productive Day',
  'Self-Care'
];

export default function MoodCheckIn({ selectedMood, onSelectMood, selectedTags, onToggleTag }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">
        How are you feeling right now?
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Select the emoji that best captures your current mental state. Completely private.
      </p>

      {/* Mood Selector Cards */}
      <div className="grid grid-cols-5 gap-2 sm:gap-4 mb-6">
        {MOODS.map((m) => {
          const isSelected = selectedMood?.id === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMood(m)}
              type="button"
              className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 transition-all transform hover:scale-105 active:scale-95 ${
                isSelected
                  ? `${m.bg} shadow-md scale-105 border-current ring-2 ring-emerald-400/50`
                  : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
              }`}
            >
              <span className="text-3xl sm:text-4xl mb-1 filter drop-shadow-sm">{m.emoji}</span>
              <span className="text-xs sm:text-sm font-medium text-slate-700">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tags Section */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          What influenced your state today? (Select all that apply)
        </label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_TAGS.map((tag) => {
            const isTagActive = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleTag(tag)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  isTagActive
                    ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
