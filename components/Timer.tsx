import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Solve } from '../types';
import { generateScramble } from '../utils/scramble';
import { TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export const Timer = () => {
  const [time, setTime] = useState(0);
  const [timerState, setTimerState] = useState<'IDLE' | 'HOLDING' | 'READY' | 'RUNNING'>('IDLE');
  const [solves, setSolves] = useState<Solve[]>([]);
  const [currentScramble, setCurrentScramble] = useState(generateScramble());
  
  const startTimeRef = useRef<number>(0);
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Timer Animation Loop
  // This effect manages the high-frequency updates when the timer is running.
  // It is separated from the event listeners to avoid closure staleness and unwanted cancellations.
  useEffect(() => {
    let animationFrameId: number;

    if (timerState === 'RUNNING') {
      const loop = () => {
        const now = Date.now();
        setTime(now - startTimeRef.current);
        animationFrameId = requestAnimationFrame(loop);
      };
      animationFrameId = requestAnimationFrame(loop);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [timerState]);

  // Stats
  const calculateAverage = (n: number) => {
    if (solves.length < n) return '-.--';
    const recent = solves.slice(0, n);
    // Standard cubing average: remove best and worst, avg the rest
    const times = recent.map(s => s.time).sort((a, b) => a - b);
    const trimmed = times.slice(1, -1);
    const avg = trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
    return formatTime(avg);
  };

  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(2);
  };

  const stopTimer = () => {
    setTimerState('IDLE');
    const finalTime = Date.now() - startTimeRef.current;
    setTime(finalTime);
    
    // Save solve
    const newSolve: Solve = {
      id: Date.now().toString(),
      time: finalTime,
      scramble: currentScramble,
      timestamp: Date.now()
    };
    setSolves([newSolve, ...solves]);
    setCurrentScramble(generateScramble());
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default scrolling for Space
    if (e.code === 'Space') {
        // If focusing on an input, don't trigger
        if (document.activeElement instanceof HTMLInputElement) return;
        e.preventDefault(); 
        
        if (timerState === 'RUNNING') {
          stopTimer();
          return;
        }

        if (timerState === 'IDLE') {
          setTimerState('HOLDING');
          setTime(0); // Reset display to 0.00
          
          // User must hold for 300ms to be "READY" (green)
          holdTimeoutRef.current = setTimeout(() => {
            setTimerState(prev => prev === 'HOLDING' ? 'READY' : prev);
          }, 300);
        }
    } else if (timerState === 'RUNNING') {
        // Pressing any other key while running stops the timer (Stackmat behavior)
        stopTimer();
    }
  }, [timerState, currentScramble, solves]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      if (timerState === 'READY') {
        // Start Timer
        startTimeRef.current = Date.now();
        setTimerState('RUNNING');
      } else if (timerState === 'HOLDING') {
        // Released too early
        setTimerState('IDLE');
        if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
      }
      
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    }
  }, [timerState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Color logic for timer display
  const getTimerColor = () => {
    if (timerState === 'HOLDING') return 'text-red-500';
    if (timerState === 'READY') return 'text-green-500';
    if (timerState === 'RUNNING') return 'text-slate-100'; 
    return 'text-white';
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0f172a] text-white p-6 overflow-hidden select-none outline-none" tabIndex={0}>
      {/* Scramble Display */}
      <div className="text-center mb-12">
        <div className="inline-block bg-slate-800/50 backdrop-blur-md px-8 py-4 rounded-xl border border-slate-700 shadow-xl">
          <p className="text-2xl font-mono tracking-wider text-emerald-400 font-medium select-text">
            {currentScramble}
          </p>
          <button 
            onClick={() => setCurrentScramble(generateScramble())}
            className="mt-2 text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 mx-auto"
          >
            <ArrowPathIcon className="w-3 h-3" /> New Scramble
          </button>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="flex-1 flex items-center justify-center pointer-events-none">
        <div className={`font-mono font-bold transition-colors duration-75 ${getTimerColor()}`} style={{ fontSize: '12rem', lineHeight: 1 }}>
          {formatTime(time)}
        </div>
      </div>

      {/* Helper Text */}
      <div className="text-center text-slate-500 mb-8 h-6 font-medium tracking-wide">
        {timerState === 'IDLE' && "Hold SPACE to prepare, Release to start"}
        {timerState === 'HOLDING' && "Wait for green..."}
        {timerState === 'READY' && "RELEASE TO SOLVE!"}
        {timerState === 'RUNNING' && "SOLVING..."}
      </div>

      {/* Stats & History Panel */}
      <div className="flex gap-6 h-64">
        {/* Stats */}
        <div className="w-1/3 bg-[#1e293b] rounded-xl p-4 border border-slate-700 flex flex-col justify-center gap-4 shadow-lg">
           <div className="text-center">
             <div className="text-slate-400 text-sm uppercase tracking-wide font-semibold">Ao5</div>
             <div className="text-4xl font-bold text-blue-400">{calculateAverage(5)}</div>
           </div>
           <div className="text-center">
             <div className="text-slate-400 text-sm uppercase tracking-wide font-semibold">Ao12</div>
             <div className="text-4xl font-bold text-purple-400">{calculateAverage(12)}</div>
           </div>
           <div className="text-center mt-2 border-t border-slate-700 pt-2">
             <div className="text-slate-500 text-xs">Total Solves: <span className="text-slate-300">{solves.length}</span></div>
           </div>
        </div>

        {/* History List */}
        <div className="flex-1 bg-[#1e293b] rounded-xl p-4 border border-slate-700 overflow-hidden flex flex-col shadow-lg">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-700">
            <h3 className="text-sm font-bold text-slate-300">Session History</h3>
            <button 
              onClick={() => {
                if(window.confirm('Clear all session history?')) setSolves([]);
              }} 
              className="px-2 py-1 rounded bg-slate-800 hover:bg-red-900/30 text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
            >
              <TrashIcon className="w-3 h-3" /> Clear
            </button>
          </div>
          <div className="overflow-y-auto flex-1 pr-2 space-y-1 custom-scrollbar">
            {solves.map((solve, idx) => (
              <div key={solve.id} className="flex justify-between items-center p-2.5 rounded bg-slate-800/50 text-sm border-l-2 border-transparent hover:border-blue-500 hover:bg-slate-800 transition-all group">
                <span className="text-slate-500 w-8 text-xs">#{solves.length - idx}</span>
                <span className="font-mono font-bold text-emerald-400 text-lg group-hover:scale-110 origin-left transition-transform">{formatTime(solve.time)}</span>
                <span className="text-slate-600 text-[10px] truncate max-w-[220px] font-mono opacity-50 group-hover:opacity-100">{solve.scramble}</span>
              </div>
            ))}
            {solves.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 italic">
                <span>No solves yet</span>
                <span className="text-xs opacity-60">Press Space to start</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="mt-4 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} CFOP Master &bull; Built by <a href="https://kjwlabs.com" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors hover:underline">KJW Labs</a>
      </div>
    </div>
  );
};