// components/ConfigPanel.tsx
'use client';

import { ModelConfig } from '@/types/chat';
import { Settings, SlidersHorizontal, Sparkles, BookOpen, ChevronDown } from 'lucide-react';

interface ConfigPanelProps {
  config: ModelConfig;
  onChange: (newConfig: ModelConfig) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChange }) => {
  const handleChange = (key: keyof ModelConfig, value: string | number) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <aside className="w-full lg:w-80 bg-slate-900 border-l border-slate-700/50 p-5 flex flex-col gap-5 text-slate-200 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-700/50">
        <div className="p-1.5 bg-indigo-500/10 rounded-lg">
          <Settings className="w-4 h-4 text-indigo-400" />
        </div>
        <h2 className="font-semibold text-base text-white">Parámetros del Modelo</h2>
      </div>

      {/* Selector de Modelo */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Modelo LLM
        </label>
        <div className="relative">
          <select
            value={config.modelName}
            onChange={(e) => handleChange('modelName', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 pr-8 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none appearance-none cursor-pointer"
          >
            <option value="gemini-2.5-flash">Gemini 2.5 Flash (Más reciente)</option>
            <option value="gemini-2.0-flash">Gemini 2.0 Flash (Estable)</option>
            <option value="gemini-2.0-flash-lite">Gemini 2.0 Flash Lite (Ligero)</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Contexto / System Instruction */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 text-slate-400">
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          System Prompt (Contexto)
        </label>
        <p className="text-xs text-slate-500 leading-relaxed">
          Define el rol, tono y restricciones del asistente antes de la conversación.
        </p>
        <textarea
          rows={4}
          value={config.systemInstruction}
          onChange={(e) => handleChange('systemInstruction', e.target.value)}
          placeholder="Ej: Eres un tutor universitario de desarrollo de software especializado en TypeScript..."
          className="bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none placeholder:text-slate-600 leading-relaxed"
        />
      </div>

      <div className="border-t border-slate-700/50 pt-1">
        <div className="flex items-center gap-1.5 mb-4">
          <SlidersHorizontal className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Hiperparámetros
          </span>
        </div>

        {/* Temperatura */}
        <div className="flex flex-col gap-2 mb-5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-300">
              Temperatura
              <span className="text-xs text-slate-500 ml-1">(Creatividad)</span>
            </label>
            <span className="font-mono text-xs bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md text-indigo-300">
              {config.temperature.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min="0.0"
            max="2.0"
            step="0.1"
            value={config.temperature}
            onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
            className="accent-indigo-500 w-full cursor-pointer h-1.5 rounded-full"
          />
          <div className="flex justify-between text-[10px] text-slate-600">
            <span>0.0 Preciso</span>
            <span>1.0 Balanceado</span>
            <span>2.0 Creativo</span>
          </div>
        </div>

        {/* Max Tokens de Salida */}
        <div className="flex flex-col gap-2 mb-5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-300">
              Límite de Tokens
              <span className="text-xs text-slate-500 ml-1">(Salida)</span>
            </label>
            <span className="font-mono text-xs bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md text-indigo-300">
              {config.maxOutputTokens}
            </span>
          </div>
          <input
            type="range"
            min="64"
            max="4096"
            step="64"
            value={config.maxOutputTokens}
            onChange={(e) => handleChange('maxOutputTokens', parseInt(e.target.value, 10))}
            className="accent-indigo-500 w-full cursor-pointer h-1.5 rounded-full"
          />
          <div className="flex justify-between text-[10px] text-slate-600">
            <span>64 Corto</span>
            <span>2048 Medio</span>
            <span>4096 Extenso</span>
          </div>
        </div>

        {/* Top-P */}
        <div className="flex flex-col gap-2 mb-5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-300">
              Top-P
              <span className="text-xs text-slate-500 ml-1">(Nucleus Sampling)</span>
            </label>
            <span className="font-mono text-xs bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md text-indigo-300">
              {config.topP.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={config.topP}
            onChange={(e) => handleChange('topP', parseFloat(e.target.value))}
            className="accent-indigo-500 w-full cursor-pointer h-1.5 rounded-full"
          />
          <div className="flex justify-between text-[10px] text-slate-600">
            <span>0.0 Restrictivo</span>
            <span>1.0 Abierto</span>
          </div>
        </div>

        {/* Top-K */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-300">
              Top-K
              <span className="text-xs text-slate-500 ml-1">(Vocabulario)</span>
            </label>
            <span className="font-mono text-xs bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md text-indigo-300">
              {config.topK}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={config.topK}
            onChange={(e) => handleChange('topK', parseInt(e.target.value, 10))}
            className="accent-indigo-500 w-full cursor-pointer h-1.5 rounded-full"
          />
          <div className="flex justify-between text-[10px] text-slate-600">
            <span>1 Limitado</span>
            <span>100 Amplio</span>
          </div>
        </div>
      </div>

      {/* Info footer */}
      <div className="mt-auto pt-3 border-t border-slate-700/50">
        <p className="text-[10px] text-slate-600 leading-relaxed text-center">
          Los parámetros se aplican en la próxima consulta enviada al modelo.
        </p>
      </div>
    </aside>
  );
};
