import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import MoodCheckIn, { MOODS } from './components/MoodCheckIn';
import JournalEditor from './components/JournalEditor';
import AIInsightCard from './components/AIInsightCard';
import BreathingExercise from './components/BreathingExercise';
import CopingToolkit from './components/CopingToolkit';
import MoodAnalytics from './components/MoodAnalytics';
import PastEntries from './components/PastEntries';
import {
  getAnonymousId,
  resetAnonymousId,
  analyzeJournalWithAI,
  saveMoodCheckIn,
  fetchPastEntries,
  fetchAnalytics
} from './services/api';

export default function App() {
  const [anonymousId, setAnonymousId] = useState('');
  const [activeTab, setActiveTab] = useState('checkin'); // 'checkin' | 'analytics' | 'toolkit'

  // Current Check-In State
  const [selectedMood, setSelectedMood] = useState(MOODS[2]); // Default 'Meh'
  const [selectedTags, setSelectedTags] = useState([]);
  const [journalText, setJournalText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentInsight, setCurrentInsight] = useState(null);

  // History & Analytics State
  const [pastEntries, setPastEntries] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Modal State
  const [showBreathing, setShowBreathing] = useState(false);

  // Initialize Anonymous Session
  useEffect(() => {
    const id = getAnonymousId();
    setAnonymousId(id);
    loadData(id);
  }, []);

  const loadData = async (id) => {
    try {
      const [historyRes, analyticsRes] = await Promise.all([
        fetchPastEntries(id).catch(() => ({ data: [] })),
        fetchAnalytics(id).catch(() => ({ data: null }))
      ]);

      if (historyRes.data) setPastEntries(historyRes.data);
      if (analyticsRes.data) setAnalytics(analyticsRes.data);
    } catch (err) {
      console.warn('Initial data load notice:', err);
    }
  };

  const handleResetSession = () => {
    if (window.confirm('Reset anonymous session? This will give you a fresh anonymous key.')) {
      const newId = resetAnonymousId();
      setAnonymousId(newId);
      setCurrentInsight(null);
      loadData(newId);
    }
  };

  const handleToggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitCheckIn = async () => {
    if (!selectedMood) return;

    setIsAnalyzing(true);
    try {
      // 1. Analyze with Gemini AI
      const aiResponse = await analyzeJournalWithAI({
        journalText,
        mood: selectedMood.id,
        moodScore: selectedMood.score
      });

      const analysisData = aiResponse.analysis;
      setCurrentInsight(analysisData);

      // 2. Save entry to backend / MongoDB
      const savePayload = {
        anonymousId,
        mood: selectedMood.id,
        moodScore: selectedMood.score,
        tags: selectedTags,
        journalText,
        aiAnalysis: analysisData
      };

      await saveMoodCheckIn(savePayload);

      // Uplifting Confetti celebration!
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.8 }
      });

      // Reload history & analytics
      await loadData(anonymousId);
    } catch (error) {
      console.error('Error during check-in analysis:', error);
      alert('Could not complete analysis. Check server connection or logs.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartActivity = (activity) => {
    if (activity.type === 'breathing') {
      setShowBreathing(true);
    } else {
      setActiveTab('toolkit');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation Bar */}
      <Navbar
        anonymousId={anonymousId}
        onResetId={handleResetSession}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* TAB 1: DAILY CHECK-IN */}
        {activeTab === 'checkin' && (
          <div className="space-y-6">
            <div className="text-center sm:text-left mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                Welcome to your safe haven 🌱
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Zero judgment, 100% anonymous mental wellness tracking for university life.
              </p>
            </div>

            {/* Step 1: Emoji Mood Selector & Context Tags */}
            <MoodCheckIn
              selectedMood={selectedMood}
              onSelectMood={setSelectedMood}
              selectedTags={selectedTags}
              onToggleTag={handleToggleTag}
            />

            {/* Step 2: Journal Editor & Gemini AI Action */}
            <JournalEditor
              journalText={journalText}
              onChangeText={setJournalText}
              onAnalyze={handleSubmitCheckIn}
              isAnalyzing={isAnalyzing}
              selectedMood={selectedMood}
            />

            {/* Step 3: Real-time Gemini AI Analysis & Coping Recommendations */}
            {currentInsight && (
              <AIInsightCard
                analysis={currentInsight}
                onStartActivity={handleStartActivity}
              />
            )}

            {/* Past Entries Log */}
            <PastEntries entries={pastEntries} />
          </div>
        )}

        {/* TAB 2: MOOD ANALYTICS & TRENDS */}
        {activeTab === 'analytics' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Your Wellness Journey Over Time</h2>
              <p className="text-sm text-slate-500">
                Visualizing trends, burnout indicators, and recurring stress triggers across your college sessions.
              </p>
            </div>
            <MoodAnalytics analytics={analytics} />
          </div>
        )}

        {/* TAB 3: COPING TOOLKIT */}
        {activeTab === 'toolkit' && (
          <CopingToolkit onOpenBreathing={() => setShowBreathing(true)} />
        )}

      </main>

      {/* Breathing Guide Modal */}
      {showBreathing && (
        <BreathingExercise onClose={() => setShowBreathing(false)} />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-white/50 py-6 text-center text-xs text-slate-400">
        <p>MindMate – Capstone Project #9 | Built with React, Express, MongoDB & Google Gemini AI</p>
        <p className="mt-1">Designed for university students | 100% Anonymous & Judgment-Free</p>
      </footer>
    </div>
  );
}
