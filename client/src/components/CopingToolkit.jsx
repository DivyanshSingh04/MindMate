import React, { useState } from 'react';
import { Wind, Coffee, Volume2, Eye, HelpCircle, VolumeX } from 'lucide-react';

export default function CopingToolkit({ onOpenBreathing }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Web Audio API ambient brown noise generator (no external files needed!)
  const toggleCalmAudio = () => {
    if (isPlayingAudio) {
      if (window._mindmateAudioSource) {
        window._mindmateAudioSource.stop();
        window._mindmateAudioSource.disconnect();
      }
      setIsPlayingAudio(false);
    } else {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const bufferSize = audioCtx.sampleRate * 2;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);

        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5; // Gain
        }

        const brownNoise = audioCtx.createBufferSource();
        brownNoise.buffer = buffer;
        brownNoise.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        brownNoise.connect(filter);
        filter.connect(audioCtx.destination);
        brownNoise.start();

        window._mindmateAudioSource = brownNoise;
        setIsPlayingAudio(true);
      } catch (e) {
        console.error('Audio init failed', e);
      }
    }
  };

  const groundingSteps = [
    { count: '5', label: 'Things you can see around your room', hint: 'Notice colors, patterns, light reflections' },
    { count: '4', label: 'Things you can physically touch', hint: 'The texture of your desk, your shirt sleeve, a pen' },
    { count: '3', label: 'Things you can hear', hint: 'Hum of the fan, distant birds, your own breath' },
    { count: '2', label: 'Things you can smell', hint: 'Coffee, fresh paper, laundry detergent' },
    { count: '1', label: 'Thing you like about yourself', hint: 'A strength, kindness, or your perseverance today' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-1">
          Student Emergency Coping Kit
        </h2>
        <p className="text-sm text-slate-500">
          Immediate, non-pharmacological tools to regulate nervous system arousal before exams or during anxiety spikes.
        </p>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Tool 1: 4-7-8 Breathing */}
        <div className="bg-white rounded-2xl p-6 border border-teal-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                <Wind className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">4-7-8 Deep Breathing</h3>
                <span className="text-xs text-teal-600 font-medium">Clinically Proven Parasympathetic Activator</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Calm panic, reduce exam butterflies, and regulate your heart rate in under 3 minutes with guided visual cadence.
            </p>
          </div>
          <button
            onClick={onOpenBreathing}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm transition-colors shadow-sm"
          >
            Launch Breathing Guide
          </button>
        </div>

        {/* Tool 2: Ambient Sound Synthesizer */}
        <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Volume2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Ambient Brown Noise Generator</h3>
                <span className="text-xs text-indigo-600 font-medium">Deep Focus & Anxiety Dampener</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Low-frequency brown noise masks sudden library sounds, quietens looping thoughts, and promotes deep flow.
            </p>
          </div>
          <button
            onClick={toggleCalmAudio}
            className={`w-full py-2.5 font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2 ${
              isPlayingAudio
                ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4" /> Stop Ambient Noise
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" /> Play Calming Noise
              </>
            )}
          </button>
        </div>

        {/* Tool 3: 5-4-3-2-1 Grounding Guide */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm md:col-span-2">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">5-4-3-2-1 Sensory Grounding Technique</h3>
              <p className="text-xs text-slate-500">Pulls your mind out of spiraling thoughts back into physical reality.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-4">
            {groundingSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  activeStep === idx
                    ? 'border-amber-400 bg-amber-50/50 shadow-xs ring-1 ring-amber-300'
                    : 'border-slate-100 bg-slate-50 hover:bg-white'
                }`}
              >
                <span className="text-2xl font-black text-amber-600 block mb-1">{step.count}</span>
                <span className="text-xs font-semibold text-slate-700 block">{step.label}</span>
              </button>
            ))}
          </div>

          <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-100">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
              Step {groundingSteps[activeStep].count} Guidance:
            </span>
            <p className="text-sm text-slate-700 mt-1">
              Look around your environment right now and focus on: <strong>{groundingSteps[activeStep].label}</strong>. {groundingSteps[activeStep].hint}.
            </p>
          </div>
        </div>

      </div>

      {/* Student Helpline Resources */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex items-start space-x-3">
        <HelpCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <span className="font-bold text-slate-700">Need Immediate Human Support?</span> If you or a fellow student are experiencing severe emotional distress or crisis, please reach out to trusted resources:
          National Tele-MANAS (India): <strong className="text-slate-800">14416</strong> or <strong className="text-slate-800">1800-891-4416</strong> (24x7 toll-free), or your campus counseling center. MindMate is an AI support companion, not a replacement for medical therapy.
        </div>
      </div>

    </div>
  );
}
