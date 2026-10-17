import React from 'react';
import { Bot, Flame, Wind, Footprints, Headphones, Coffee, CheckCircle2 } from 'lucide-react';

const getActivityIcon = (type) => {
  switch (type) {
    case 'breathing':
      return <Wind className="w-5 h-5 text-teal-600" />;
    case 'walk':
      return <Footprints className="w-5 h-5 text-emerald-600" />;
    case 'music':
      return <Headphones className="w-5 h-5 text-indigo-600" />;
    case 'study-break':
    default:
      return <Coffee className="w-5 h-5 text-amber-600" />;
  }
};

export default function AIInsightCard({ analysis, onStartActivity }) {
  if (!analysis) return null;

  const { burnoutScore = 20, stressLevel = 'Low', sentiment = 'Steady', primaryTriggers = [], summary = '', copingRecommendations = [] } = analysis;

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-rose-600 bg-rose-50 border-rose-200';
    if (score >= 45) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  };

  const getMeterColor = (score) => {
    if (score >= 70) return 'bg-rose-500';
    if (score >= 45) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-gradient-to-br from-white via-teal-50/10 to-emerald-50/20 rounded-2xl p-6 shadow-sm border border-emerald-100 mt-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-emerald-100/70 rounded-xl text-emerald-700">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-base">Gemini Wellness Analysis</h3>
            <p className="text-xs text-slate-400">Personalized mental load & coping assessment</p>
          </div>
        </div>

        {/* Stress Badge */}
        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getScoreColor(burnoutScore)} flex items-center gap-1.5`}>
          <Flame className="w-3.5 h-3.5" />
          <span>{stressLevel} Stress ({burnoutScore}%)</span>
        </div>
      </div>

      {/* Burnout Meter Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Burnout & Cognitive Exhaustion Index</span>
          <span className="font-semibold text-slate-700">{burnoutScore}/100</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-700 rounded-full ${getMeterColor(burnoutScore)}`}
            style={{ width: `${burnoutScore}%` }}
          />
        </div>
      </div>

      {/* Empathetic Summary */}
      <div className="mt-4 p-4 rounded-xl bg-slate-50/80 border border-slate-200/60">
        <p className="text-sm text-slate-700 leading-relaxed italic">
          "{summary}"
        </p>
      </div>

      {/* Detected Triggers */}
      {primaryTriggers.length > 0 && (
        <div className="mt-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">
            Identified Triggers & Themes:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {primaryTriggers.map((trig, idx) => (
              <span
                key={idx}
                className="text-xs bg-white text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs font-medium"
              >
                🎯 {trig}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Coping Activities */}
      {copingRecommendations.length > 0 && (
        <div className="mt-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Suggested Coping Exercises for Right Now:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {copingRecommendations.map((act, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-slate-50">
                        {getActivityIcon(act.type)}
                      </div>
                      <span className="text-sm font-semibold text-slate-800">{act.title}</span>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                      {act.duration}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-normal mb-3">
                    {act.instruction}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onStartActivity(act)}
                  className="w-full text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Start Exercise
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
