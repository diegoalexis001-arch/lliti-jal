
import { GoogleGenAI } from "@google/genai";

/**
 * Crea una instancia de GoogleGenAI asegurando que siempre use la llave más reciente
 * del contexto de ejecución (especialmente relevante tras el diálogo de openSelectKey).
 */
export const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Verifica si el usuario tiene una llave seleccionada para modelos que requieren facturación (Veo/Imagen).
 * Si no la tiene, abre el diálogo de selección.
 */
export const ensureBillingKey = async (): Promise<boolean> => {
  if (typeof window.aistudio?.hasSelectedApiKey !== 'function') return true;
  
  const hasKey = await window.aistudio.hasSelectedApiKey();
  if (!hasKey) {
    await window.aistudio.openSelectKey();
    // Asumimos éxito tras el trigger según directrices para evitar bloqueos por race condition
    return true; 
  }
  return true;
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

export const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const encodeBase64 = (bytes: Uint8Array) => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};
