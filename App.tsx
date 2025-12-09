import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Volume2, VolumeX, ChefHat, RotateCcw } from 'lucide-react';
import { Timer, TimerStatus, CreateTimerInput, Ingredient } from './types';
import { TimerCard } from './components/TimerCard';
import { CreateTimerModal } from './components/CreateTimerModal';
import { EditTimerModal } from './components/EditTimerModal';
import { MAX_TIMERS, PRESET_RECIPES, CARD_THEMES } from './constants';

const App: React.FC = () => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTimer, setEditingTimer] = useState<Timer | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize with Presets if empty
  useEffect(() => {
    if (timers.length === 0) {
      loadPresets();
    }
  }, []);

  const loadPresets = () => {
    const presetTimers: Timer[] = PRESET_RECIPES.map((recipe, index) => ({
      id: crypto.randomUUID(),
      name: recipe.name,
      theme: CARD_THEMES[index % CARD_THEMES.length],
      phases: recipe.phases.map(p => ({ ...p, id: crypto.randomUUID() })),
      currentPhaseIndex: 0,
      timeLeftInCurrentPhase: recipe.phases[0].durationSeconds,
      status: TimerStatus.IDLE,
      createdAt: Date.now(),
      multiplier: 1
    }));
    setTimers(presetTimers);
  };

  const initAudio = () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioCtx();
    }
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    setAudioEnabled(true);
  };

  const playBeep = useCallback(() => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    const now = ctx.currentTime;
    
    // Melodic chime (happier tone)
    osc.frequency.setValueAtTime(523.25, now); // C5
    gain.gain.setValueAtTime(0.5, now);
    
    osc.frequency.setValueAtTime(659.25, now + 0.2); // E5
    
    osc.frequency.setValueAtTime(783.99, now + 0.4); // G5
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    
    osc.start(now);
    osc.stop(now + 1.6);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(currentTimers => {
        let hasChanges = false;
        const nextTimers = currentTimers.map(timer => {
          if (timer.status !== TimerStatus.RUNNING) return timer;

          hasChanges = true;
          const newTimeLeft = timer.timeLeftInCurrentPhase - 1;

          if (newTimeLeft <= 0) {
            playBeep();
            const isLastPhase = timer.currentPhaseIndex >= timer.phases.length - 1;
            
            if (isLastPhase) {
               return {
                 ...timer,
                 timeLeftInCurrentPhase: 0,
                 status: TimerStatus.COMPLETED
               };
            } else {
               return {
                 ...timer,
                 timeLeftInCurrentPhase: 0,
                 status: TimerStatus.WAITING_FOR_ACTION
               };
            }
          }

          return {
            ...timer,
            timeLeftInCurrentPhase: newTimeLeft
          };
        });
        return hasChanges ? nextTimers : currentTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [playBeep]);

  // Actions
  const handleCreateTimer = (input: CreateTimerInput) => {
    if (timers.length >= MAX_TIMERS) return;
    initAudio();
    const newTimer: Timer = {
      id: crypto.randomUUID(),
      name: input.name,
      theme: CARD_THEMES[timers.length % CARD_THEMES.length],
      phases: input.phases.map(p => ({ ...p, id: crypto.randomUUID(), ingredients: p.ingredients || [] })),
      currentPhaseIndex: 0,
      timeLeftInCurrentPhase: input.phases[0].durationSeconds,
      status: TimerStatus.IDLE, 
      createdAt: Date.now(),
      multiplier: 1
    };
    setTimers(prev => [...prev, newTimer]);
  };

  const handleUpdateTimer = (updatedTimer: Timer) => {
    setTimers(prev => prev.map(t => {
      if (t.id !== updatedTimer.id) return t;
      
      const currentPhase = updatedTimer.phases[updatedTimer.currentPhaseIndex];
      const newDuration = currentPhase ? currentPhase.durationSeconds : 0;
      
      return {
        ...updatedTimer,
        timeLeftInCurrentPhase: t.status === TimerStatus.IDLE ? newDuration : t.timeLeftInCurrentPhase
      };
    }));
  };

  const deleteTimer = (id: string) => {
    setTimers(prev => prev.filter(t => t.id !== id));
  };

  const toggleTimer = (id: string) => {
    initAudio();
    setTimers(prev => prev.map(t => {
      if (t.id !== id) return t;
      if (t.status === TimerStatus.RUNNING) return { ...t, status: TimerStatus.PAUSED };
      if (t.status === TimerStatus.IDLE || t.status === TimerStatus.PAUSED) return { ...t, status: TimerStatus.RUNNING };
      return t;
    }));
  };

  const resetTimer = (id: string) => {
    setTimers(prev => prev.map(t => {
      if (t.id !== id) return t;
      return {
        ...t,
        currentPhaseIndex: 0,
        timeLeftInCurrentPhase: t.phases[0].durationSeconds,
        status: TimerStatus.IDLE
      };
    }));
  };

  const nextPhase = (id: string) => {
    setTimers(prev => prev.map(t => {
      if (t.id !== id) return t;
      
      const nextIndex = t.currentPhaseIndex + 1;
      if (nextIndex >= t.phases.length) {
         return { ...t, status: TimerStatus.COMPLETED, timeLeftInCurrentPhase: 0 };
      }
      
      return {
        ...t,
        currentPhaseIndex: nextIndex,
        timeLeftInCurrentPhase: t.phases[nextIndex].durationSeconds,
        status: TimerStatus.RUNNING // Auto-start next phase
      };
    }));
  };
  
  const updateMultiplier = (id: string, m: number) => {
    setTimers(prev => prev.map(t => t.id === id ? { ...t, multiplier: m } : t));
  };

  const resetAll = () => {
    if (window.confirm("确定要重置所有程序为默认食谱吗？这将删除所有自定义修改。")) {
      loadPresets();
    }
  };

  return (
    // Main Container - Light Mode
    <div className="flex flex-col h-full font-sans text-slate-800 relative bg-gradient-to-br from-pink-50 via-white to-blue-50">
      
      {/* Header */}
      <header className="flex-none px-6 py-5 flex justify-between items-center z-20 bg-white/60 backdrop-blur-md border-b border-white/50 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-pink-400 to-rose-400 text-white p-2.5 rounded-2xl shadow-lg shadow-pink-200">
             <ChefHat size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-black tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">
            Well Lyfe
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={resetAll}
            className="hidden md:flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-colors text-sm font-bold"
          >
            <RotateCcw size={16} /> 恢复默认
          </button>
          
          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          <button 
            onClick={initAudio}
            className={`p-2.5 rounded-xl transition-all ${audioEnabled ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-slate-100 text-slate-400'}`}
          >
             {audioEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
          </button>
          
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={timers.length >= MAX_TIMERS}
            className="flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2.5 rounded-xl font-bold transition-all shadow-xl shadow-slate-200"
          >
            <Plus size={20} strokeWidth={3} />
            <span className="hidden md:inline">新建</span>
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar z-10">
        {timers.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <button onClick={loadPresets} className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-xl shadow-pink-200 hover:scale-105 transition-transform animate-bounce">
              加载美味食谱
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-24">
            {timers.map(timer => (
              <TimerCard 
                key={timer.id}
                timer={timer}
                onDelete={deleteTimer}
                onToggle={toggleTimer}
                onReset={resetTimer}
                onNextPhase={nextPhase}
                onUpdateMultiplier={updateMultiplier}
                onEdit={(t) => setEditingTimer(t)}
              />
            ))}
          </div>
        )}
      </main>

      <CreateTimerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTimer}
      />
      
      <EditTimerModal
        isOpen={!!editingTimer}
        timer={editingTimer}
        onClose={() => setEditingTimer(null)}
        onSave={handleUpdateTimer}
      />
    </div>
  );
};

export default App;