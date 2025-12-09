import React, { useState, useEffect } from 'react';
import { Timer, TimerPhase, Ingredient } from '../types';
import { X, Save, Plus, Trash2, Clock, ChefHat, Settings } from 'lucide-react';

interface EditTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTimer: Timer) => void;
  timer: Timer | null;
}

export const EditTimerModal: React.FC<EditTimerModalProps> = ({ isOpen, onClose, onSave, timer }) => {
  const [editedTimer, setEditedTimer] = useState<Timer | null>(null);

  useEffect(() => {
    if (timer) {
      setEditedTimer(JSON.parse(JSON.stringify(timer))); // Deep copy
    }
  }, [timer]);

  if (!isOpen || !editedTimer) return null;

  const handlePhaseChange = (idx: number, field: keyof TimerPhase, value: any) => {
    const newPhases = [...editedTimer.phases];
    newPhases[idx] = { ...newPhases[idx], [field]: value };
    setEditedTimer({ ...editedTimer, phases: newPhases });
  };

  const updateIngredient = (phaseIdx: number, ingIdx: number, field: keyof Ingredient, value: any) => {
    const newPhases = [...editedTimer.phases];
    const newIngredients = [...newPhases[phaseIdx].ingredients];
    newIngredients[ingIdx] = { ...newIngredients[ingIdx], [field]: value };
    newPhases[phaseIdx].ingredients = newIngredients;
    setEditedTimer({ ...editedTimer, phases: newPhases });
  };

  const addIngredient = (phaseIdx: number) => {
    const newPhases = [...editedTimer.phases];
    if (!newPhases[phaseIdx].ingredients) newPhases[phaseIdx].ingredients = [];
    newPhases[phaseIdx].ingredients.push({ name: '', amount: 0, unit: 'g' });
    setEditedTimer({ ...editedTimer, phases: newPhases });
  };

  const removeIngredient = (phaseIdx: number, ingIdx: number) => {
    const newPhases = [...editedTimer.phases];
    newPhases[phaseIdx].ingredients = newPhases[phaseIdx].ingredients.filter((_, i) => i !== ingIdx);
    setEditedTimer({ ...editedTimer, phases: newPhases });
  };

  const addPhase = () => {
    setEditedTimer({
      ...editedTimer,
      phases: [
        ...editedTimer.phases,
        { id: crypto.randomUUID(), name: '新步骤', durationSeconds: 300, ingredients: [] }
      ]
    });
  };

  const removePhase = (idx: number) => {
    setEditedTimer({
      ...editedTimer,
      phases: editedTimer.phases.filter((_, i) => i !== idx)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-50 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-white rounded-t-3xl">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings size={20} className="text-pink-500" /> 编辑: {editedTimer.name}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase">程序名称</label>
            <input 
              type="text" 
              value={editedTimer.name}
              onChange={(e) => setEditedTimer({...editedTimer, name: e.target.value})}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:border-pink-400 outline-none shadow-sm"
            />
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-center pb-2 border-b border-slate-200">
               <label className="text-sm font-bold text-slate-500 uppercase">步骤详情</label>
               <button onClick={addPhase} className="text-sm text-pink-600 hover:text-pink-500 flex items-center gap-1 font-bold bg-pink-50 px-3 py-1 rounded-full">
                 <Plus size={16} /> 添加步骤
               </button>
             </div>

             {editedTimer.phases.map((phase, pIdx) => (
               <div key={phase.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex gap-3 mb-4">
                    <div className="flex-1">
                      <label className="text-xs text-slate-400 mb-1 block">步骤名称</label>
                      <input 
                        type="text" 
                        value={phase.name}
                        onChange={(e) => handlePhaseChange(pIdx, 'name', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-pink-400"
                      />
                    </div>
                    <div className="w-28">
                      <label className="text-xs text-slate-400 mb-1 block">时长 (分钟)</label>
                      <input 
                        type="number" 
                        value={Math.floor(phase.durationSeconds / 60)}
                        onChange={(e) => handlePhaseChange(pIdx, 'durationSeconds', parseInt(e.target.value) * 60)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-pink-400 text-right"
                      />
                    </div>
                    {editedTimer.phases.length > 1 && (
                      <button onClick={() => removePhase(pIdx)} className="mt-5 p-2 text-slate-300 hover:text-rose-400">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  {/* Ingredients per phase */}
                  <div className="pl-4 border-l-2 border-pink-100">
                    <div className="flex items-center gap-2 mb-2">
                       <ChefHat size={14} className="text-slate-400"/>
                       <span className="text-xs font-bold text-slate-400 uppercase">该步骤加入的食材</span>
                    </div>
                    
                    {phase.ingredients && phase.ingredients.map((ing, iIdx) => (
                      <div key={iIdx} className="flex gap-2 mb-2 items-center">
                         <input 
                           placeholder="食材名"
                           value={ing.name}
                           onChange={(e) => updateIngredient(pIdx, iIdx, 'name', e.target.value)}
                           className="flex-1 bg-slate-50 border border-slate-100 rounded px-2 py-1 text-sm text-slate-700 outline-none focus:border-pink-300"
                         />
                         <input 
                           type="number"
                           placeholder="量"
                           value={ing.amount}
                           onChange={(e) => updateIngredient(pIdx, iIdx, 'amount', parseFloat(e.target.value))}
                           className="w-16 bg-slate-50 border border-slate-100 rounded px-2 py-1 text-sm text-slate-700 outline-none focus:border-pink-300 text-right"
                         />
                         <input 
                           placeholder="单位"
                           value={ing.unit}
                           onChange={(e) => updateIngredient(pIdx, iIdx, 'unit', e.target.value)}
                           className="w-12 bg-slate-50 border border-slate-100 rounded px-2 py-1 text-sm text-slate-700 outline-none focus:border-pink-300 text-center"
                         />
                         <button onClick={() => removeIngredient(pIdx, iIdx)} className="text-slate-300 hover:text-rose-400">
                            <X size={14} />
                         </button>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => addIngredient(pIdx)}
                      className="text-xs text-pink-500 hover:text-pink-400 flex items-center gap-1 mt-2 font-medium"
                    >
                      <Plus size={12} /> 添加食材
                    </button>
                  </div>
               </div>
             ))}
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 flex justify-end gap-3 bg-white rounded-b-3xl">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
          >
            取消
          </button>
          <button 
            onClick={() => { onSave(editedTimer); onClose(); }}
            className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 flex items-center gap-2"
          >
            <Save size={20} /> 保存修改
          </button>
        </div>
      </div>
    </div>
  );
};