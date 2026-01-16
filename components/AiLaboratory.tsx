
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { ICONS } from '../constants';
import { getAI, blobToBase64, decodeAudioData, decodeBase64 } from '../lib/gemini';
import { Modality } from '@google/genai';

type Tab = 'chat' | 'multimedia' | 'audio' | 'analysis';

export const AiLaboratory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  
  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string, sources?: any[]}[]>([]);
  const [useSearch, setUseSearch] = useState(false);
  const [useMaps, setUseMaps] = useState(false);
  const [useThinking, setUseThinking] = useState(false);

  // Multimedia State
  const [imagePrompt, setImagePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageSize, setImageSize] = useState('1K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

  // Audio State
  const [transcription, setTranscription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Analysis State
  const [analysisResult, setAnalysisResult] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = getAI();
      const modelName = useThinking ? 'gemini-3-pro-preview' : (useSearch ? 'gemini-3-flash-preview' : 'gemini-2.5-flash-lite');
      
      const config: any = {};
      if (useSearch) config.tools = [{ googleSearch: {} }];
      if (useMaps) {
        config.tools = [...(config.tools || []), { googleMaps: {} }];
        const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
        config.toolConfig = { retrievalConfig: { latLng: { latitude: pos.coords.latitude, longitude: pos.coords.longitude } } };
      }
      if (useThinking) {
        config.thinkingConfig = { thinkingBudget: 32768 };
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: userMsg,
        config
      });

      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      setChatHistory(prev => [...prev, { role: 'ai', text: response.text || 'Sin respuesta', sources }]);
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { role: 'ai', text: 'Error al procesar la solicitud.' }]);
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    if (!imagePrompt) return;
    setLoading(true);
    setStatus('Generando imagen premium...');
    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: imagePrompt,
        config: { imageConfig: { aspectRatio, imageSize: imageSize as any } }
      });
      const part = response.candidates[0].content.parts.find(p => p.inlineData);
      if (part?.inlineData) {
        setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
    setStatus('');
  };

  const editImage = async () => {
    if (!generatedImage || !editPrompt) return;
    setLoading(true);
    setStatus('Editando imagen con Flash Image...');
    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [
          { inlineData: { data: generatedImage.split(',')[1], mimeType: 'image/png' } },
          { text: editPrompt }
        ]
      });
      const part = response.candidates[0].content.parts.find(p => p.inlineData);
      if (part?.inlineData) setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
    } catch (e) { console.error(e); }
    setLoading(false);
    setStatus('');
  };

  const generateVideo = async (fromImage = false) => {
    if (!videoPrompt && !fromImage) return;
    setLoading(true);
    setStatus('Iniciando Veo 3.1 (esto puede tardar unos minutos)...');
    try {
      const ai = getAI();
      const config: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt: videoPrompt || 'Animate this legal visual',
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
      };
      if (fromImage && generatedImage) {
        config.image = { imageBytes: generatedImage.split(',')[1], mimeType: 'image/png' };
      }

      let operation = await ai.models.generateVideos(config);
      while (!operation.done) {
        await new Promise(r => setTimeout(r, 10000));
        setStatus('Procesando video Veo... Polling en curso.');
        operation = await ai.operations.getVideosOperation({ operation });
      }
      const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (uri) {
        const res = await fetch(`${uri}&key=${process.env.API_KEY}`);
        const blob = await res.blob();
        setGeneratedVideo(URL.createObjectURL(blob));
      }
    } catch (e) { console.error(e); }
    setLoading(false);
    setStatus('');
  };

  const handleTTS = async (text: string) => {
    setStatus('Generando audio...');
    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say professionally: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
        }
      });
      const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const buffer = await decodeAudioData(decodeBase64(base64), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (e) { console.error(e); }
    setStatus('');
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const base64 = await blobToBase64(blob);
      setLoading(true);
      setStatus('Transcribiendo audio...');
      try {
        const ai = getAI();
        const res = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [
            { inlineData: { data: base64, mimeType: 'audio/webm' } },
            { text: 'Transcribe el audio exactamente.' }
          ]
        });
        setTranscription(res.text || '');
      } catch (e) { console.error(e); }
      setLoading(false);
      setStatus('');
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const analyzeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setStatus('Analizando archivo multimedia con Gemini Pro...');
    try {
      const base64 = await blobToBase64(file);
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          { inlineData: { data: base64, mimeType: file.type } },
          { text: 'Analiza este contenido legalmente. Identifica actores, fechas clave y posibles riesgos.' }
        ]
      });
      setAnalysisResult(response.text || '');
    } catch (e) { console.error(e); }
    setLoading(false);
    setStatus('');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
      <div className="bg-slate-900 p-6 flex items-center justify-between text-white">
        <h2 className="font-bold text-xl flex items-center gap-3">
          <span className="text-indigo-400">⚡</span> Laboratorio Liti-jal IA
        </h2>
        {status && <div className="text-xs font-medium animate-pulse text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">{status}</div>}
      </div>

      <div className="flex border-b border-slate-100 overflow-x-auto hide-scrollbar">
        {[
          { id: 'chat', label: 'Chat Inteligente', icon: '💬' },
          { id: 'multimedia', label: 'Multimedia', icon: '🖼️' },
          { id: 'audio', label: 'Audio & TTS', icon: '🎙️' },
          { id: 'analysis', label: 'Análisis Pro', icon: '🔍' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as Tab)}
            className={`px-6 py-4 text-sm font-bold flex items-center gap-2 whitespace-nowrap border-b-2 transition-all ${activeTab === t.id ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="flex-grow p-8 overflow-y-auto max-h-[600px]">
        {activeTab === 'chat' && (
          <div className="space-y-6 flex flex-col h-full">
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer">
                <input type="checkbox" checked={useSearch} onChange={e => setUseSearch(e.target.checked)} className="rounded" /> Búsqueda
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer">
                <input type="checkbox" checked={useMaps} onChange={e => setUseMaps(e.target.checked)} className="rounded" /> Mapas
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer text-indigo-600">
                <input type="checkbox" checked={useThinking} onChange={e => setUseThinking(e.target.checked)} className="rounded" /> Thinking Mode
              </label>
            </div>
            <div className="flex-grow space-y-4 mb-4">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'}`}>
                    <p className="text-sm">{msg.text}</p>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-200/50">
                        <p className="text-[10px] font-bold uppercase opacity-50 mb-1">Fuentes:</p>
                        {msg.sources.map((s: any, j: number) => (
                          <a key={j} href={s.web?.uri || s.maps?.uri} target="_blank" rel="noreferrer" className="block text-[10px] underline truncate hover:opacity-80">
                            {s.web?.title || s.maps?.title || 'Fuente externa'}
                          </a>
                        ))}
                      </div>
                    )}
                    {msg.role === 'ai' && (
                      <button onClick={() => handleTTS(msg.text)} className="mt-2 text-[10px] font-bold opacity-50 hover:opacity-100 flex items-center gap-1">
                        🔊 Escuchar respuesta
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {loading && <div className="text-xs text-slate-400 italic">Gemini está pensando...</div>}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                onKeyPress={e => e.key === 'Enter' && handleChat()}
                placeholder="Pregunta lo que sea..." 
                className="flex-grow p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <Button onClick={handleChat} disabled={loading}><ICONS.ArrowRight /></Button>
            </div>
          </div>
        )}

        {activeTab === 'multimedia' && (
          <div className="space-y-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h4 className="font-bold text-slate-700 mb-4">Generador de Gráficos Legales (Nano Banana Pro)</h4>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input 
                  type="text" 
                  value={imagePrompt} 
                  onChange={e => setImagePrompt(e.target.value)} 
                  placeholder="Ej: Diagrama de flujo de un juicio mercantil en México..." 
                  className="p-3 rounded-xl border border-slate-200 text-sm outline-none"
                />
                <div className="flex gap-2">
                  <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} className="p-2 border rounded-xl text-xs bg-white">
                    {['1:1', '3:4', '4:3', '9:16', '16:9'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <select value={imageSize} onChange={e => setImageSize(e.target.value)} className="p-2 border rounded-xl text-xs bg-white">
                    {['1K', '2K', '4K'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <Button size="sm" onClick={generateImage} disabled={loading}>Generar</Button>
                </div>
              </div>
              {generatedImage && (
                <div className="space-y-4">
                  <img src={generatedImage} alt="Generated" className="w-full rounded-2xl shadow-lg border border-slate-200" />
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={editPrompt} 
                      onChange={e => setEditPrompt(e.target.value)} 
                      placeholder="Editar imagen: 'Añadir filtro retro', 'Quitar fondo'..." 
                      className="flex-grow p-3 rounded-xl border border-slate-200 text-sm"
                    />
                    <Button size="sm" variant="secondary" onClick={editImage} disabled={loading}>Editar</Button>
                    <Button size="sm" variant="outline" onClick={() => generateVideo(true)} disabled={loading}>Animar con Veo</Button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h4 className="font-bold text-slate-700 mb-4">Veo 3.1: Video de Alto Impacto</h4>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={videoPrompt} 
                  onChange={e => setVideoPrompt(e.target.value)} 
                  placeholder="Prompt para video: 'Abogado caminando por Reforma'..." 
                  className="flex-grow p-3 rounded-xl border border-slate-200 text-sm"
                />
                <Button onClick={() => generateVideo(false)} disabled={loading}>Crear Video</Button>
              </div>
              {generatedVideo && (
                <div className="mt-4">
                   <video src={generatedVideo} controls className="w-full rounded-2xl border border-slate-200" />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="space-y-8">
            <div className="bg-indigo-50 p-8 rounded-[2rem] text-center border border-indigo-100">
               <h4 className="font-bold text-indigo-900 mb-4 text-xl">Dictado & Transcripción Judicial</h4>
               <p className="text-indigo-600 text-sm mb-8">Usa gemini-3-flash para convertir audio en texto procesable.</p>
               <button 
                 onClick={isRecording ? stopRecording : startRecording}
                 className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-indigo-600 hover:scale-105'} text-white shadow-xl shadow-indigo-500/20`}
               >
                 {isRecording ? <span className="text-2xl font-black">■</span> : <span className="text-3xl">🎙️</span>}
               </button>
               {transcription && (
                 <div className="mt-8 text-left bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                   <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Transcripción Detectada</div>
                   <p className="text-slate-700 leading-relaxed">{transcription}</p>
                   <Button size="sm" variant="ghost" className="mt-4" onClick={() => handleTTS(transcription)}>Leer en voz alta</Button>
                 </div>
               )}
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:border-indigo-400 hover:bg-indigo-50/10 transition-all cursor-pointer" onClick={() => fileInputRef.current?.click()}>
               <input type="file" ref={fileInputRef} onChange={analyzeFile} className="hidden" accept="image/*,video/*" />
               <div className="text-5xl mb-4">📂</div>
               <h4 className="font-bold text-slate-800">Cargar Evidencia (Foto/Video)</h4>
               <p className="text-slate-500 text-sm">Gemini Pro analizará el contenido visual buscando riesgos legales.</p>
            </div>
            {analysisResult && (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">✓</div>
                  <h5 className="font-bold text-slate-900">Análisis Estructurado</h5>
                </div>
                <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed">
                  {analysisResult.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-slate-50 px-8 py-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest border-t border-slate-100 flex justify-between">
        <span>Modelos: gemini-3-pro | gemini-2.5-flash | veo-3.1</span>
        <span>Liti-jal Core Protocol 2.5</span>
      </div>
    </div>
  );
};
