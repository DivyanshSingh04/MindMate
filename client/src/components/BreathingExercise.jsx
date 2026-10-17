import React, { useState, useEffect } from 'react';
import { Wind, X, Play, Pause, RotateCcw } from 'lucide-react';

export default function BreathingExercise({ onClose }) {
  const [phase, setPhase] = useState('Inhale'); // Inhale (4s), Hold (7s), Exhale (8s)
  const [countdown, setCountdown] = useState(4);
  const [isRunning, setIsRunning] = useState(true);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Cycle transition: Inhale (4s) -> Hold (7s) -> Exhale (8s) -> Inhale
        if (phase === 'Inhale') {
          setPhase('Hold');
          return 7;
        } else if (phase === 'Hold') {
          setPhase('Exhale');
          return 8;
        } else {
          setPhase('Inhale');
          setCycleCount(c => c + 1);
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isRunning]);

  const getScaleClass = () => {
    if (phase === 'Inhale') return 'scale-125 bg-emerald-400/40 text-emerald-800';
    if (phase === 'Hold') return 'scale-125 bg-teal-400/50 text-teal-900';
    return 'scale-90 bg-sky-300/30 text-sky-800';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col items-center relative text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-emerald-600 mb-2">
          <Wind className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">4-7-8 De-escalation Breathing</span>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-6">
          Reset Your Nervous System
        </h3>

        {/* Breathing Animation Circle */}
        <div className="relative w-64 h-64 flex items-center justify-center my-4">
          {/* Outer Ripple */}
          <div
            className={`absolute w-56 h-56 rounded-full transition-all duration-1000 ease-in-out border-4 border-emerald-200/60 ${getScaleClass()}`}
          />
          {/* Core Circle */}
          <div className="z-10 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-slate-800 mb-1 tracking-tight">
              {phase}
            </span>
            <span className="text-5xl font-mono font-bold text-emerald-600">
              {countdown}s
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-6 max-w-xs">
          {phase === 'Inhale' && 'Slowly breathe in deep through your nose...'}
          {phase === 'Hold' && 'Hold gently. Let your heart rate stabilize...'}
          {phase === 'Exhale' && 'Exhale all breath smoothly through your mouth...'}
        </p>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-semibold hover:bg-slate-900 transition-colors"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Pause' : 'Resume'}</span>
          </button>
          <button
            onClick={() => {
              setPhase('Inhale');
              setCountdown(4);
              setCycleCount(0);
            }}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 mt-4">
          Cycles completed: {cycleCount}
        </span>
      </div>
    </div>
  );
}
