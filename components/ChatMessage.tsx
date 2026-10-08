// components/ChatMessage.tsx
import { Message } from '@/types/chat';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar del Bot */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/30">
          <Bot className="w-4 h-4" />
        </div>
      )}

      {/* Burbuja de mensaje */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-none shadow-indigo-900/30'
            : 'bg-slate-800 text-slate-100 border border-slate-700/60 rounded-tl-none'
        }`}
      >
        {/* Etiqueta del remitente */}
        <p className={`text-xs font-semibold mb-1.5 ${isUser ? 'text-indigo-200' : 'text-indigo-400'}`}>
          {isUser ? 'Tú (Estudiante)' : 'Gemini AI'}
        </p>

        {/* Contenido del mensaje */}
        <div className="text-sm whitespace-pre-wrap leading-relaxed">
          {message.content}
        </div>

        {/* Timestamp */}
        <span className={`block text-[10px] mt-2 text-right ${isUser ? 'text-indigo-300/70' : 'text-slate-500'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      {/* Avatar del Usuario */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center flex-shrink-0 text-slate-200 ring-1 ring-slate-600/30">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
