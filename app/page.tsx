// app/page.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Message, ModelConfig } from '@/types/chat';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { ConfigPanel } from '@/components/ConfigPanel';
import { Bot, Trash2, SlidersHorizontal, X } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false); // Para mobile
  const [config, setConfig] = useState<ModelConfig>({
    modelName: 'gemini-2.5-flash',
    systemInstruction:
      'Eres un tutor amigable y experto en ingeniería de software y programación. Explicas conceptos de forma clara, con ejemplos prácticos y en español.',
    temperature: 0.7,
    maxOutputTokens: 1024,
    topP: 0.95,
    topK: 40,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mensaje de bienvenida: se inserta en el cliente (no en prerender)
  // para evitar el error de Next.js 16 con new Date() en Client Components.
  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'model',
        content:
          '¡Hola! Soy tu asistente basado en Gemini. Puedes ajustar mi contexto, longitud de respuesta y temperatura en el panel lateral. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date(),
      },
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Filtrar sólo turnos de usuario y modelo para el backend
      const payloadMessages = newMessages
        .filter((m) => m.role === 'user' || m.role === 'model')
        .map((m) => ({
          role: m.role as 'user' | 'model',
          content: m.content,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          config: config,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al comunicarse con el servidor');
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : 'Error desconocido';
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: `⚠️ Error: ${errorMsg}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-slate-950 overflow-hidden font-sans">
      {/* Área Principal de Chat */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/70 px-4 lg:px-6 flex items-center justify-between backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl ring-1 ring-indigo-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-sm lg:text-base leading-tight">
                Gemini Software Dev Bot
              </h1>
              <p className="text-xs text-slate-500 leading-tight">
                Next.js 15 &middot; Google GenAI SDK &middot; App Router
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle panel en mobile */}
            <button
              onClick={() => setShowConfig((v) => !v)}
              title="Configuración del modelo"
              className="lg:hidden text-slate-400 hover:text-indigo-400 p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              {showConfig ? (
                <X className="w-4 h-4" />
              ) : (
                <SlidersHorizontal className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={handleClearHistory}
              title="Limpiar Conversación"
              className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Lista de Mensajes */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-12 py-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 opacity-40">
              <div className="p-4 bg-indigo-600/10 rounded-full">
                <Bot className="w-10 h-10 text-indigo-400" />
              </div>
              <div>
                <p className="text-slate-300 font-medium">La conversación está vacía</p>
                <p className="text-slate-500 text-sm mt-1">Escribe algo para comenzar</p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {/* Indicador de escritura */}
          {isLoading && (
            <div className="flex gap-3 my-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/30 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-800 border border-slate-700/60 rounded-2xl rounded-tl-none px-4 py-3">
                <p className="text-xs font-semibold text-indigo-400 mb-2">Gemini AI</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </main>

        {/* Barra de Entrada */}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      {/* Panel Lateral de Parámetros — siempre visible en desktop, toggle en mobile */}
      <div
        className={`${
          showConfig ? 'flex' : 'hidden'
        } lg:flex flex-col lg:relative absolute inset-0 z-10 bg-slate-950/80 lg:bg-transparent`}
        onClick={(e) => {
          // Cerrar al tocar el fondo en mobile
          if (e.target === e.currentTarget) setShowConfig(false);
        }}
      >
        <ConfigPanel config={config} onChange={setConfig} />
      </div>
    </div>
  );
}
