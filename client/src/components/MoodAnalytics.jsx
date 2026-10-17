import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { TrendingUp, Activity, BarChart3, AlertCircle } from 'lucide-react';

export default function MoodAnalytics({ analytics }) {
  if (!analytics || !analytics.timeline || analytics.timeline.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-slate-100 shadow-sm text-center">
        <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-700 mb-1">No Mood History Yet</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Complete your first daily check-in to unlock longitudinal wellness analytics, burnout trend graphs, and personalized mood patterns.
        </p>
      </div>
    );
  }

  const {
    totalEntries = 0,
    averageMood = 0,
    averageBurnout = 0,
    timeline = [],
    distribution = {},
    commonTags = []
  } = analytics;

  const distributionData = [
    { name: 'Awful (😭)', count: distribution.awful || 0, fill: '#f43f5e' },
    { name: 'Bad (😔)', count: distribution.bad || 0, fill: '#818cf8' },
    { name: 'Meh (😐)', count: distribution.meh || 0, fill: '#38bdf8' },
    { name: 'Good (😊)', count: distribution.good || 0, fill: '#34d399' },
    { name: 'Rad (🤩)', count: distribution.rad || 0, fill: '#fbbf24' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Check-Ins</span>
          <div className="text-3xl font-extrabold text-slate-800 mt-2">{totalEntries}</div>
          <span className="text-xs text-emerald-600 font-medium">Logged anonymously</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Mood Score</span>
          <div className="text-3xl font-extrabold text-teal-600 mt-2">{averageMood} / 5.0</div>
          <span className="text-xs text-slate-500">Scale of 1 (Awful) to 5 (Rad)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Burnout Risk</span>
          <div className={`text-3xl font-extrabold mt-2 ${averageBurnout >= 50 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {averageBurnout}%
          </div>
          <span className="text-xs text-slate-500">Evaluated by Gemini AI</span>
        </div>
      </div>

      {/* Main Graph: Mood & Burnout Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Longitudinal Mood & Burnout Progression</h3>
            <p className="text-xs text-slate-400">Weekly and monthly trend lines mapped across your check-ins</p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-teal-600">
              <span className="w-3 h-3 rounded-full bg-teal-500 inline-block" /> Mood Score (1-5)
            </span>
            <span className="flex items-center gap-1.5 text-rose-500">
              <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" /> Burnout % (0-100)
            </span>
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="burnoutGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" domain={[1, 5]} stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} hide />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="moodScore"
                name="Mood Score"
                stroke="#0d9488"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#moodGradient)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="burnout"
                name="Burnout %"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#burnoutGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Graphs: Distribution & Frequent Triggers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Mood Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="font-bold text-slate-800 text-sm mb-1">Mood Distribution Breakdown</h4>
          <p className="text-xs text-slate-400 mb-4">Frequency of each emotional state logged</p>
          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e2e8f0' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Frequent Context Tags */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1">Top Academic & Life Influences</h4>
            <p className="text-xs text-slate-400 mb-4">Most frequently tagged factors affecting your mental space</p>
            
            {commonTags.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No tags selected yet.</p>
            ) : (
              <div className="space-y-3">
                {commonTags.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                      #{item.tag}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, (item.count / totalEntries) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{item.count}x</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 mt-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-teal-600 shrink-0" />
            <p className="text-xs text-teal-800">
              Pattern notice: Staying mindful of repeated tags helps predict and prevent exam burnout early.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
