import React, { useState } from 'react';
import { CreateTimerInput } from '../types';
import { X, Plus, Sparkles, Loader2, ArrowRight, Minus } from 'lucide-react';
import { generateTimerFromPrompt } from '../services/geminiService';
import { DEFAULT_SUGGESTIONS } from '../constants';

interface CreateTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateTimerInput) => void;
}

export const CreateTimerModal: React.FC<CreateTimerModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manual Form State
  const [manualName, setManualName] = useState('');
  const [manualIngredients, setManualIngredients] = useState('');
  const [manualPhases, setManualPhases] = useState<{ name: string; duration: string }[]>([
    { name: '', duration: '' }
  ]);

  if (!isOpen) return null;

  const handleAiGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateTimerFromPrompt(prompt);
      onCreate(result);
      onClose();
    } catch (e) {
      setError("生成失败，请重试或使用手动模式。");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualSubmit = () => {
    if (!manualName.trim()) {
      setError("请输入名称");
      return;
    }
    const validPhases = manualPhases
      .map(p => ({ 
        name: p.name.trim(), 
        durationSeconds: parseInt(p.duration) * 60,
        ingredients: [] 
      })) 
      .filter(p => p.name && !isNaN(p.durationSeconds) && p.durationSeconds > 0);

    if (validPhases.length === 0) {
      setError("请至少添加一个有效的步骤");
      return;
    }

    onCreate({ 
      name: manualName, 
      phases: validPhases 
    });
    onClose();
  };

  const addPhase = () => setManualPhases([...manualPhases, { name: '', duration: '' }]);
  const removePhase = (idx: number) => setManualPhases(manualPhases.filter((_, i) => i !== idx));
  const updatePhase = (idx: number, field: 'name' | 'duration', value: string) => {
    const newPhases = [...manualPhases];
    newPhases[idx] = { ...newPhases[idx], [field]: value };
    setManualPhases(newPhases);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            {mode === 'ai' ? <Sparkles size={24} className="text-pink-500"/> : <Plus size={24} className="text-purple-500"/>}
            {mode === 'ai' ? 'AI 智能生成' : '手动创建'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-4 gap-4 bg-white">
          <button 
            onClick={() => setMode('ai')} 
            className={`flex-1 py-3 rounded-2xl text-lg font-bold transition-all border
              ${mode === 'ai' 
                ? 'bg-pink-100 text-pink-600 border-pink-200 shadow-sm' 
                : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
          >
            AI 生成
          </button>
          <button 
            onClick={() => setMode('manual')}
            className={`flex-1 py-3 rounded-2xl text-lg font-bold transition-all border
              ${mode === 'manual' 
                ? 'bg-purple-100 text-purple-600 border-purple-200 shadow-sm' 
                : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
          >
            手动设定
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold">
              {error}
            </div>
          )}

          {mode === 'ai' ? (
            <div className="space-y-6">
               <div>
                  <label className="block text-lg font-bold text-slate-700 mb-2">您想要制作什么？</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="例如：炖牛肉，泡茶..."
                      className="flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:border-pink-400 outline-none text-lg transition-all shadow-sm focus:ring-2 focus:ring-pink-100"
                      onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
                    />
                    <button 
                      onClick={handleAiGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      className="bg-pink-500 disabled:bg-slate-300 hover:bg-pink-400 text-white font-bold px-6 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-pink-200"
                    >
                      {isGenerating ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                    </button>
                  </div>
               </div>
               
               <div>
                 <p className="text-sm font-bold text-slate-400 mb-3">试试这些灵感</p>
                 <div className="flex flex-wrap gap-2">
                   {DEFAULT_SUGGESTIONS.map(s => (
                     <button 
                        key={s}
                        onClick={() => setPrompt(s)}
                        className="px-4 py-2 rounded-full border border-slate-200 hover:border-pink-300 text-slate-500 hover:text-pink-500 bg-white transition-all text-sm font-medium hover:shadow-sm"
                     >
                       {s}
                     </button>
                   ))}
                 </div>
               </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase mb-2">程序名称</label>
                <input 
                  type="text" 
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:border-purple-400 outline-none text-lg focus:ring-2 focus:ring-purple-50"
                  placeholder="例如：我的特制炖汤"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                   <label className="text-sm font-bold text-slate-500 uppercase">步骤设置</label>
                   <button onClick={addPhase} className="text-sm text-purple-600 hover:text-purple-500 flex items-center gap-1 font-bold bg-purple-50 px-3 py-1 rounded-full">
                     <Plus size={16} /> 添加步骤
                   </button>
                </div>
                
                {manualPhases.map((phase, idx) => (
                  <div key={idx} className="flex gap-3 items-center group bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                     <span className="text-slate-400 font-mono text-sm w-6 font-bold">{idx + 1}.</span>
                     <div className="flex-1">
                        <input 
                            type="text" 
                            placeholder="步骤名称 (如: 加红枣)"
                            value={phase.name}
                            onChange={(e) => updatePhase(idx, 'name', e.target.value)}
                            className="w-full bg-transparent border-b border-slate-100 focus:border-purple-300 px-2 py-1 text-slate-800 outline-none placeholder:text-slate-300"
                        />
                     </div>
                     <div className="w-24 relative">
                        <input 
                            type="number" 
                            placeholder="0"
                            value={phase.duration}
                            onChange={(e) => updatePhase(idx, 'duration', e.target.value)}
                            className="w-full bg-slate-50 rounded-lg px-2 py-2 text-slate-800 outline-none text-right pr-8 font-mono"
                        />
                        <span className="absolute right-2 top-2.5 text-slate-400 text-xs font-bold">m</span>
                     </div>

                     {manualPhases.length > 1 && (
                       <button onClick={() => removePhase(idx)} className="text-slate-300 hover:text-rose-400 p-2">
                         <Minus size={20} />
                       </button>
                     )}
                  </div>
                ))}
              </div>
              
              <button 
                onClick={handleManualSubmit}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl mt-8 text-lg transition-transform active:scale-[0.98] shadow-lg shadow-slate-300"
              >
                完成创建
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};