// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { ChatRequestBody } from '@/types/chat';

// Inicializar el cliente del SDK con la clave del servidor
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('ADVERTENCIA: GEMINI_API_KEY no está configurada en .env.local');
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });


async function generateWithFallback(
  primaryModel: string,
  contents: object[],
  config: ChatRequestBody['config']
) {
  const modelsToTry = [
    ...new Set([config.modelName, 'gemini-3.8-flash'].filter(Boolean)),
  ] as string[];

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: config.systemInstruction || undefined,
          temperature: config.temperature,
          maxOutputTokens: config.maxOutputTokens,
          topP: config.topP,
          topK: config.topK,
        },
      });
      // Si tuvo éxito, retorna junto con el modelo que funcionó
      return { response, usedModel: model };
    } catch (err: unknown) {
      const status =
        typeof err === 'object' && err !== null && 'status' in err
          ? (err as { status: number }).status
          : null;

      // Solo reintenta con fallback si es error 503 (saturación) o 429 (rate limit)
      const isRetryable = status === 404 || status === 503 || status === 429;
      const isLastModel = model === modelsToTry[modelsToTry.length - 1];

      if (!isRetryable || isLastModel) throw err;

      console.warn(`Modelo ${model} no disponible (${status}), intentando con fallback...`);
    }
  }
  throw new Error('Todos los modelos están temporalmente saturados.');
}

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: 'La API Key de Gemini no está configurada en el servidor.' },
        { status: 500 }
      );
    }

    const body: ChatRequestBody = await req.json();
    const { messages, config } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'El historial de mensajes no puede estar vacío.' },
        { status: 400 }
      );
    }

    // Formatear el historial para el SDK de Gemini
    const contents = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    // Llama al modelo con fallback automático en caso de saturación
    const { response, usedModel } = await generateWithFallback(
      config.modelName || 'gemini-3.8-flash',
      contents,
      config
    );

    const replyText = response.text || 'Sin respuesta generada por el modelo.';

    return NextResponse.json({
      text: replyText,
      usedModel,
      usageMetadata: response.usageMetadata,
    });
  } catch (error: unknown) {
    console.error('Error en /api/chat:', error);

    // Detectar si es error 503/429 para dar mensaje amigable
    const status =
      typeof error === 'object' && error !== null && 'status' in error
        ? (error as { status: number }).status
        : 500;

    const errorMessage =
      status === 503 || status === 429
        ? 'El servicio de Gemini está temporalmente saturado. Por favor espera unos segundos y vuelve a intentarlo.'
        : error instanceof Error
          ? error.message
          : 'Ocurrió un error al procesar la solicitud con Gemini.';

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
