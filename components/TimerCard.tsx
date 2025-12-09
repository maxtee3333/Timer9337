import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Timer, TimerStatus, Ingredient } from '../types';
import { Play, Pause, Square, SkipForward, Trash2, CheckCircle, Clock, Settings, ChevronDown, ChevronRight, FastForward } from 'lucide-react';

interface TimerCardProps {
  timer: Timer;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onReset: (id: string) => void;
  onNextPhase: (id: string) => void;
  onUpdateMultiplier: (id: string, m: number) => void;
  onEdit: (timer: Timer) => void;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const TimerCard: React.FC<TimerCardProps> = ({ 
  timer, 
  onDelete, 
  onToggle, 
  onReset,
  onNextPhase,
  onUpdateMultiplier,
  onEdit
}) => {
  const isCompleted = timer.status === TimerStatus.COMPLETED;
  const isWaiting = timer.status === TimerStatus.WAITING_FOR_ACTION;
  const activePhaseRef = useRef<HTMLDivElement>(null);

  // Auto scroll to active phase
  useEffect(() => {
    if (activePhaseRef.current && timer.status === TimerStatus.RUNNING) {
      activePhaseRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [timer.currentPhaseIndex, timer.status]);

  return (
    <div className={`
      relative flex flex-col h-full min-h-[500px] transition-all duration-300
      rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-white/60
      ${timer.theme}
    `}>
      
      {/* Header - Glassy Light */}
      <div className="flex-none p-5 bg-white/40 backdrop-blur-md border-b border-white/40 z-20">
        <div className="flex justify-between items-start mb-3">
           <h3 className="text-xl font-black text-slate-800 truncate flex-1 mr-2 tracking-tight">
             {timer.name}
           </h3>
           <div className="flex gap-2">
             <button 
               onClick={() => onEdit(timer)}
               className="p-2 text-slate-500 hover:text-slate-800 bg-white/40 hover:bg-white/70 rounded-xl transition-colors"
               title="编辑设置"
             >
               <Settings size={18} />
             </button>
             <button 
               onClick={() => onDelete(timer.id)}
               className="p-2 text-slate-400 hover:text-rose-500 bg-white/40 hover:bg-white/70 rounded-xl transition-colors"
             >
               <Trash2 size={18} />
             </button>
           </div>
        </div>
        
        {/* Multiplier Toggles - Pill Shape */}
        <div className="flex bg-white/40 rounded-full p-1 w-max shadow-sm border border-white/50">
          {[1, 2, 3].map(m => (
            <button
              key={m}
              onClick={() => onUpdateMultiplier(timer.id, m)}
              className={`
                px-3 py-1 text-xs font-bold rounded-full transition-all
                ${timer.multiplier === m 
                  ? 'bg-white text-slate-800 shadow-sm scale-105' 
                  : 'text-slate-500 hover:text-slate-700'}
              `}
            >
              {m*3}包
            </button>
          ))}
        </div>
      </div>

      {/* Main Framework View (Scrollable List) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative p-4 space-y-3">
        {timer.phases.map((phase, idx) => {
          const isActive = idx === timer.currentPhaseIndex && !isCompleted;
          const isPast = idx < timer.currentPhaseIndex || isCompleted;
          const isFuture = idx > timer.currentPhaseIndex && !isCompleted;

          return (
            <div 
              key={phase.id}
              ref={isActive ? activePhaseRef : null}
              className={`
                relative rounded-2xl border transition-all duration-500 overflow-hidden
                ${isActive 
                  ? 'bg-white/80 border-white shadow-lg scale-[1.02] z-10' 
                  : isPast 
                    ? 'bg-slate-100/50 border-transparent opacity-60' 
                    : 'bg-white/30 border-white/20'
                }
              `}
            >
              {/* Progress Bar Background for Active Phase */}
              {isActive && (
                <div 
                  className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-pink-400 to-rose-400 transition-all duration-1000 ease-linear"
                  style={{ width: `${(1 - timer.timeLeftInCurrentPhase / phase.durationSeconds) * 100}%` }}
                />
              )}

              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    {/* Status Icon */}
                    <div className={`
                      flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shadow-sm
                      ${isActive 
                        ? 'bg-rose-500 text-white animate-bounce' 
                        : isPast 
                          ? 'bg-emerald-100 text-emerald-600' 
                          : 'bg-white/50 text-slate-400'}
                    `}>
                      {isPast ? <CheckCircle size={16} /> : idx + 1}
                    </div>
                    <span className={`font-bold ${isActive ? 'text-slate-800 text-lg' : 'text-slate-500'}`}>
                      {phase.name}
                    </span>
                  </div>
                  
                  {/* Phase Timer Display */}
                  <div className="text-right">
                    {isActive ? (
                      <span className="font-mono text-3xl font-bold tracking-tight text-slate-800 tabular-nums block drop-shadow-sm">
                        {formatTime(timer.timeLeftInCurrentPhase)}
                      </span>
                    ) : (
                      <span className="font-mono text-sm text-slate-400 flex items-center justify-end gap-1">
                        <Clock size={12} /> {Math.round(phase.durationSeconds / 60)}m
                      </span>
                    )}
                  </div>
                </div>

                {/* Ingredients List - Enhanced Visibility */}
                {(isActive || isFuture) && phase.ingredients && phase.ingredients.length > 0 && (
                  <div className={`
                    mt-3 pl-10 transition-all
                    ${isActive ? 'opacity-100' : 'opacity-90'}
                  `}>
                    <div className="flex flex-wrap gap-2">
                      {phase.ingredients.map((ing, i) => (
                        <span key={i} className={`
                          rounded-lg border flex items-center gap-1.5 shadow-sm transition-all
                          ${isActive 
                            ? 'px-3 py-1.5 text-base font-extrabold bg-rose-100 border-rose-200 text-rose-800' 
                            : 'px-2.5 py-1 text-sm font-bold bg-white/70 border-white/50 text-slate-600'}
                        `}>
                          {ing.name} 
                          <span className={`font-black ml-0.5 ${isActive ? 'text-rose-600' : 'text-slate-500'}`}>
                            {Number((ing.amount * timer.multiplier).toFixed(1))}{ing.unit}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {isActive && isWaiting && (
                   <div className="mt-3 pl-10 text-amber-600 text-sm font-bold flex items-center gap-2 animate-pulse bg-amber-50 border border-amber-100 p-2 rounded-lg w-fit shadow-sm">
                     ⚠️ 阶段完成，请加入食材后继续
                   </div>
                )}
              </div>
            </div>
          );
        })}

        {isCompleted && (
           <div className="flex flex-col items-center justify-center py-8 text-emerald-500 animate-in zoom-in duration-300">
             <div className="bg-white p-4 rounded-full shadow-lg mb-2 ring-4 ring-emerald-50">
                <CheckCircle size={48} className="text-emerald-400" />
             </div>
             <span className="text-xl font-black text-slate-700">烹饪完成! ✨</span>
           </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex-none p-4 bg-white/40 backdrop-blur-md border-t border-white/40 z-20">
         <div className="flex gap-2">
            {isWaiting ? (
              <button
                onClick={() => onNextPhase(timer.id)}
                className="flex-1 bg-amber-400 hover:bg-amber-300 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-200"
              >
                <SkipForward size={20} fill="currentColor" /> 进入下一阶段
              </button>
            ) : isCompleted ? (
              <button
                onClick={() => onReset(timer.id)}
                className="flex-1 bg-white hover:bg-slate-50 text-slate-700 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Square size={18} fill="currentColor" /> 再做一次
              </button>
            ) : (
              <>
                <button
                  onClick={() => onToggle(timer.id)}
                  className={`flex-[2] py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg
                    ${timer.status === TimerStatus.RUNNING 
                      ? 'bg-white text-slate-800 hover:bg-slate-50' 
                      : 'bg-slate-800 text-white hover:bg-slate-700'}
                  `}
                >
                  {timer.status === TimerStatus.RUNNING ? (
                    <> <Pause size={20} fill="currentColor" /> 暂停 </>
                  ) : (
                    <> <Play size={20} fill="currentColor" /> 开始 </>
                  )}
                </button>
                
                <button
                  onClick={() => onNextPhase(timer.id)}
                  className="flex-none w-12 bg-white/60 hover:bg-white text-slate-500 hover:text-slate-800 rounded-2xl flex items-center justify-center transition-all border border-white/50"
                  title="跳过当前步骤"
                >
                  <FastForward size={20} />
                </button>

                <button
                  onClick={() => onReset(timer.id)}
                  className="flex-none w-12 bg-white/60 hover:bg-rose-100 text-slate-400 hover:text-rose-500 rounded-2xl flex items-center justify-center transition-all border border-white/50"
                  title="重置"
                >
                  <Square size={18} />
                </button>
              </>
            )}
         </div>
      </div>
    </div>
  );
};