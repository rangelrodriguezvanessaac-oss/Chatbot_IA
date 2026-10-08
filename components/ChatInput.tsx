// components/ChatInput.tsx
'use client';

import React, { useState, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-slate-900/80 backdrop-blur border-t border-slate-700/50 flex items-end gap-3">
      <div className="flex-1 relative">
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu consulta aquí... (Shift + Enter para salto de línea)"
          disabled={isLoading}
          className="w-full bg-slate-800 text-slate-100 border border-slate-700/60 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none disabled:opacity-50 placeholder:text-slate-600 leading-relaxed transition-all"
        />
        {/* Contador de caracteres */}
        {input.length > 0 && (
          <span className="absolute bottom-2.5 right-3 text-[10px] text-slate-600">
            {input.length} chars
          </span>
        )}
      </div>

      <button
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
        title="Enviar mensaje (Enter)"
        className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:border disabled:border-slate-700 text-white p-3 rounded-xl transition-all duration-200 flex items-center justify-center h-12 w-12 flex-shrink-0 shadow-lg shadow-indigo-900/30 hover:shadow-indigo-900/50 active:scale-95"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};
