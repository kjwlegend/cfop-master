import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { algorithms, parseNotation } from './data/algorithms';
import Cube3D, { CubeRef } from './components/Cube3D';
import { Algorithm } from './types';
import { getAICoachingTip } from './services/geminiService';
import { Timer } from './components/Timer';
import { 
  PlayIcon, 
  PauseIcon, 
  ArrowPathIcon, 
  ChevronRightIcon, 
  SparklesIcon,
  CubeIcon,
  ClockIcon,
  AcademicCapIcon
} from '@heroicons/react/24/solid';

const App = () => {
  const [appMode, setAppMode] = useState<'LEARN' | 'TIMER'>('LEARN');
  const [selectedAlgo, setSelectedAlgo] = useState<Algorithm>(algorithms[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [moves, setMoves] = useState<string[]>([]);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PLL' | 'OLL' | 'F2L' | 'Cross'>('ALL');

  const cubeRef = useRef<CubeRef>(null);
  
  const isPlayingRef = useRef(false);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  // Helper to invert a move for setup
  const invertMove = (move: string) => {
    if (move.includes('2')) return move; // R2 is its own inverse
    if (move.endsWith("'")) return move.slice(0, -1); // R' -> R
    return move + "'"; // R -> R'
  };

  // 1. When Algo Changes: Calculate moves, Inverse them, and Setup the Cube
  useEffect(() => {
    if (appMode !== 'LEARN') return;

    // 1. Get solving moves
    const parsedMoves = parseNotation(selectedAlgo.notation);
    setMoves(parsedMoves);
    
    // 2. Reset state
    setCurrentMoveIndex(-1);
    setIsPlaying(false);
    setAiTip(null);
    
    // 3. Calculate Setup moves (Inverse of algorithm)
    // We reverse the order and invert each move
    const setupMoves = [...parsedMoves].reverse().map(invertMove);

    // 4. Apply to Cube (Small delay to ensure ref is ready)
    setTimeout(() => {
      if (cubeRef.current) {
        cubeRef.current.jumpTo(setupMoves);
      }
    }, 50);

  }, [selectedAlgo, appMode]);

  // Main playback loop (Executes the Solving Moves)
  useEffect(() => {
    if (!isPlaying) return;

    const runSequence = async () => {
      let index = currentMoveIndex + 1;
      
      // If we finished, restart
      if (index >= moves.length) {
        // To restart, we must re-apply the setup!
        const setupMoves = [...moves].reverse().map(invertMove);
        cubeRef.current?.jumpTo(setupMoves);
        setCurrentMoveIndex(-1);
        await new Promise(r => setTimeout(r, 400));
        index = 0;
      }

      while (index < moves.length && isPlayingRef.current) {
        setCurrentMoveIndex(index);
        await cubeRef.current?.performMove(moves[index], 350); 
        
        if (isPlayingRef.current) {
             await new Promise(r => setTimeout(r, 150)); 
        }
        index++;
      }

      if (isPlayingRef.current) {
        setIsPlaying(false);
      }
    };

    runSequence();
  }, [isPlaying, moves]); 

  const handleStepForward = async () => {
    if (currentMoveIndex < moves.length - 1) {
      const nextIndex = currentMoveIndex + 1;
      setCurrentMoveIndex(nextIndex);
      await cubeRef.current?.performMove(moves[nextIndex]);
    }
  };

  // Reset now means: Go back to the Scrambled (Setup) state
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentMoveIndex(-1);
    
    const setupMoves = [...moves].reverse().map(invertMove);
    cubeRef.current?.jumpTo(setupMoves);
  };

  const handleAskAI = async () => {
    if (!selectedAlgo) return;
    setLoadingAi(true);
    const tip = await getAICoachingTip(selectedAlgo);
    setAiTip(tip);
    setLoadingAi(false);
  };

  const filteredAlgorithms = algorithms.filter(algo => 
    filter === 'ALL' ? true : algo.category === filter
  );

  const getCategoryCount = (cat: string) => {
    if (cat === 'ALL') return algorithms.length;
    return algorithms.filter(a => a.category === cat).length;
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#0f172a] text-slate-100 overflow-hidden font-inter">
      
      {/* Top Navigation Bar */}
      <div className="h-16 border-b border-slate-700 bg-[#1e293b] flex items-center justify-between px-6 z-20 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <CubeIcon className="w-8 h-8 text-emerald-400" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            CFOP Master 3D
          </span>
        </div>
        
        <div className="flex bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setAppMode('LEARN')}
            className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition-all ${
              appMode === 'LEARN' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <AcademicCapIcon className="w-4 h-4" />
            Learn Algorithms
          </button>
          <button
            onClick={() => setAppMode('TIMER')}
            className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition-all ${
              appMode === 'TIMER' 
              ? 'bg-emerald-600 text-white shadow-lg' 
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <ClockIcon className="w-4 h-4" />
            Speed Timer
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {appMode === 'TIMER' ? (
          <Timer />
        ) : (
          /* LEARN MODE LAYOUT */
          <>
            {/* Sidebar: Algorithms List */}
            <div className="w-full md:w-80 lg:w-96 flex flex-col border-r border-slate-800 bg-[#1e293b] z-10 shadow-xl">
              {/* Filter Tabs */}
              <div className="flex p-2 gap-1 overflow-x-auto border-b border-slate-700">
                {['ALL', 'PLL', 'OLL', 'F2L'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat as any)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                      filter === cat 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {cat} <span className={`ml-1 opacity-70 ${filter === cat ? 'text-blue-200' : 'text-slate-500'}`}>({getCategoryCount(cat)})</span>
                  </button>
                ))}
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                {filteredAlgorithms.map((algo) => (
                  <button
                    key={algo.id}
                    onClick={() => setSelectedAlgo(algo)}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                      selectedAlgo.id === algo.id
                        ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                        : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-slate-100">{algo.name}</span>
                      <span className="text-[10px] uppercase tracking-wider bg-slate-900 px-1.5 py-0.5 rounded text-slate-400">
                        {algo.category}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-emerald-400 truncate opacity-90">
                      {algo.notation}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* AI Section */}
              <div className="p-4 border-t border-slate-700 bg-[#1e293b]">
                {!aiTip ? (
                  <button
                    onClick={handleAskAI}
                    disabled={loadingAi}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loadingAi ? (
                      <span className="animate-pulse">Asking Gemini...</span>
                    ) : (
                      <>
                        <SparklesIcon className="w-5 h-5" />
                        Ask AI Coach
                      </>
                    )}
                  </button>
                ) : (
                  <div className="bg-slate-800 rounded-lg p-3 text-sm border border-purple-500/30 relative animate-in fade-in slide-in-from-bottom-2">
                     <button 
                      onClick={() => setAiTip(null)}
                      className="absolute top-2 right-2 text-slate-500 hover:text-white"
                     >
                       ✕
                     </button>
                     <h3 className="font-bold text-purple-400 flex items-center gap-1 mb-2">
                       <SparklesIcon className="w-4 h-4" /> Gemini Tips
                     </h3>
                     <div className="prose prose-invert prose-sm max-h-40 overflow-y-auto text-slate-300 leading-relaxed text-xs">
                       {aiTip.split('\n').map((line, i) => (
                         <p key={i} className="mb-1">{line}</p>
                       ))}
                     </div>
                  </div>
                )}
              </div>

              {/* Copyright Footer */}
              <div className="p-3 bg-[#0f172a] border-t border-slate-800 text-center text-xs text-slate-500">
                &copy; {new Date().getFullYear()} CFOP Master &bull; Built by <a href="https://kjwlabs.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">KJW Labs</a>
              </div>
            </div>

            {/* Main Viewport: 3D Cube */}
            <div className="flex-1 relative bg-[#0f172a] flex flex-col">
              
              {/* Top Header overlay */}
              <div className="absolute top-0 left-0 right-0 p-6 z-10 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto">
                   <h2 className="text-3xl font-bold text-white drop-shadow-md">{selectedAlgo.name}</h2>
                   <p className="text-xl font-mono text-emerald-400 mt-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg inline-block border border-white/10 shadow-lg">
                      {moves.map((m, i) => (
                        <span key={i} className={`mr-3 transition-all duration-100 ${i === currentMoveIndex ? 'text-white underline decoration-2 decoration-blue-500 scale-125 inline-block font-black text-shadow-glow' : 'opacity-70'}`}>
                          {m}
                        </span>
                      ))}
                   </p>
                </div>
              </div>

              {/* 3D Canvas */}
              <div className="flex-1 cursor-move">
                <Canvas camera={{ position: [4, 4, 4], fov: 45 }}>
                  <color attach="background" args={['#0f172a']} />
                  <ambientLight intensity={0.6} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} />
                  
                  <Cube3D ref={cubeRef} />
                  
                  <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
                  <Environment preset="city" />
                  <OrbitControls 
                    makeDefault
                    enablePan={false} 
                    minDistance={3} 
                    maxDistance={15} 
                    minPolarAngle={0} 
                    maxPolarAngle={Math.PI} 
                  />
                </Canvas>
              </div>

              {/* Controls Bar */}
              <div className="h-24 bg-[#1e293b] border-t border-slate-700 flex items-center justify-center gap-6 z-10 shadow-lg">
                
                <button 
                  onClick={handleReset}
                  className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-all hover:scale-105 active:scale-95"
                  title="Reset to Setup State"
                >
                  <ArrowPathIcon className="w-6 h-6" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-4 rounded-full text-white shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center ${
                      isPlaying 
                      ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/30' 
                      : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                  }`}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <PauseIcon className="w-8 h-8" />
                  ) : (
                    <PlayIcon className="w-8 h-8 pl-1" />
                  )}
                </button>

                <button 
                  onClick={handleStepForward}
                  disabled={isPlaying || currentMoveIndex >= moves.length - 1}
                  className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Step Forward"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;