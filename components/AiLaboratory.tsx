
import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { ICONS } from '../constants';
import { getAI, blobToBase64, decodeAudioData, decodeBase64, ensureBillingKey } from '../lib/gemini';
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
        try {
          const pos = await new Promise<GeolocationPosition>((res, rej) => 
            navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
          );
          config.toolConfig = { retrievalConfig: { latLng: { latitude: pos.coords.latitude, longitude: pos.coords.longitude } } };
        } catch (geoErr) {
          console.warn("Geolocation failed, using default coords");
        }
      }
      
      if (useThinking && !useSearch) { // Thinking only available for pro model without search tool in some configs
        config.thinkingConfig = { thinkingBudget: 32768 };
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: userMsg,
        config
      });

      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      setChatHistory(prev => [...prev, { role: 'ai', text: response.text || 'Sin respuesta', sources }]);
    } catch (error: any) {
      console.error(error);
      let errorMsg = 'Error al procesar la solicitud.';
      if (error?.message?.includes('entity was not found')) {
        errorMsg = 'Error de autenticación. Por favor, selecciona tu llave de API de pago nuevamente.';
        await window.aistudio?.openSelectKey();
      }
      setChatHistory(prev => [...prev, { role: 'ai', text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    if (!imagePrompt) return;
    setLoading(true);
    setStatus('Autenticando para Imagen 3...');
    try {
      await ensureBillingKey();
      setStatus('Generando imagen de alta resolución...');
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
    } catch (e) { 
      console.error(e); 
      setStatus('Error en generación de imagen.');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const editImage = async () => {
    if (!generatedImage || !editPrompt) return;
    setLoading(true);
    setStatus('Editando con Gemini 2.5 Flash Image...');
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
    } catch (e) { 
      console.error(e); 
      setStatus('Error al editar.');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const generateVideo = async (fromImage = false) => {
    if (!videoPrompt && !fromImage) return;
    setLoading(true);
    setStatus('Verificando acceso a Veo 3.1...');
    try {
      await ensureBillingKey();
      setStatus('Iniciando generación de video Veo...');
      const ai = getAI();
      const config: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt: videoPrompt || 'Animate this legal visual professionally',
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
      };
      if (fromImage && generatedImage) {
        config.image = { imageBytes: generatedImage.split(',')[1], mimeType: 'image/png' };
      }

      let operation = await ai.models.generateVideos(config);
      
      const loadingMessages = [
        "Renderizando frames...",
        "Aplicando leyes de física visual...",
        "Codificando MP4...",
        "Finalizando texturas...",
        "Casi listo..."
      ];
      let msgIndex = 0;

      while (!operation.done) {
        setStatus(`Veo: ${loadingMessages[msgIndex % loadingMessages.length]}`);
        msgIndex++;
        await new Promise(r => setTimeout(r, 10000));
        operation = await ai.operations.getVideosOperation({ operation });
      }

      const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (uri) {
        const res = await fetch(`${uri}&key=${process.env.API_KEY}`);
        const blob = await res.blob();
        setGeneratedVideo(URL.createObjectURL(blob));
        setStatus('¡Video generado con éxito!');
      }
    } catch (e) { 
      console.error(e); 
      setStatus('La generación de video falló.');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(''), 5000);
    }
  };

  const handleTTS = async (text: string) => {
    setStatus('Generando audio profesional...');
    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Lee esto con tono profesional y calmado: ${text}` }] }],
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
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const base64 = await blobToBase64(blob);
        setLoading(true);
        setStatus('Transcribiendo audio con Gemini 3 Flash...');
        try {
          const ai = getAI();
          const res = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [
              { inlineData: { data: base64, mimeType: 'audio/webm' } },
              { text: 'Transcribe el audio exactamente, manteniendo cualquier terminología legal.' }
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
    } catch (e) {
      console.error("Mic access denied", e);
      setStatus("Error: Acceso al micrófono denegado.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
  };

  const analyzeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setStatus(`Analizando ${file.type.includes('video') ? 'video' : 'imagen'} con Gemini 3 Pro...`);
    try {
      const base64 = await blobToBase64(file);
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          { inlineData: { data: base64, mimeType: file.type } },
          { text: 'Actúa como perito legal. Analiza este contenido multimedia, identifica evidencias clave, sellos, firmas o rostros y evalúa el contexto procesal.' }
        ]
      });
      setAnalysisResult(response.text || '');
    } catch (e) { 
      console.error(e); 
      setStatus('Error en análisis profundo.');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden min-h-[700px] flex flex-col animate-in fade-in duration-700">
      <div className="bg-slate-900 p-6 flex items-center justify-between text-white">
        <div className="flex flex-col">
          <h2 className="font-bold text-xl flex items-center gap-3">
            <span className="text-indigo-400">⚡</span> Liti-jal AI Studio
          </h2>
          <span className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">Protocolo de Inteligencia Legal v3.1</span>
        </div>
        {status && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
            <div className="text-xs font-medium text-indigo-300 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">{status}</div>
          </div>
        )}
      </div>

      <div className="flex border-b border-slate-100 overflow-x-auto hide-scrollbar bg-slate-50/50">
        {[
          { id: 'chat', label: 'Consultoría IA', icon: '💬' },
          { id: 'multimedia', label: 'Laboratorio Visual', icon: '🖼️' },
          { id: 'audio', label: 'Dictamen de Audio', icon: '🎙️' },
          { id: 'analysis', label: 'Peritaje Pro', icon: '🔍' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as Tab)}
            className={`px-8 py-5 text-sm font-bold flex items-center gap-2 whitespace-nowrap border-b-2 transition-all ${activeTab === t.id ? 'border-indigo-600 text-indigo-600 bg-white shadow-[0_-4px_0_inset_rgba(79,70,229,0.1)]' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'}`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="flex-grow p-8 overflow-y-auto max-h-[700px] bg-white">
        {activeTab === 'chat' && (
          <div className="space-y-6 flex flex-col h-full max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-3 mb-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-[11px] font-bold text-slate-500 cursor-pointer hover:border-indigo-300 transition-colors">
                <input type="checkbox" checked={useSearch} onChange={e => setUseSearch(e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500" /> 
                <span className="flex items-center gap-1.5"><ICONS.Search /> Google Search</span>
              </label>
              <label className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-[11px] font-bold text-slate-500 cursor-pointer hover:border-indigo-300 transition-colors">
                <input type="checkbox" checked={useMaps} onChange={e => setUseMaps(e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500" /> 
                <span>📍 Google Maps</span>
              </label>
              <label className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-[11px] font-bold text-indigo-600 cursor-pointer hover:border-indigo-400 transition-colors">
                <input type="checkbox" checked={useThinking} onChange={e => setUseThinking(e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500" /> 
                <span>🧠 Thinking Mode (Pro)</span>
              </label>
            </div>
            
            <div className="flex-grow space-y-6 mb-6">
              {chatHistory.length === 0 && (
                <div className="text-center py-20 opacity-30 select-none">
                  <div className="text-6xl mb-4">⚖️</div>
                  <p className="font-bold">Inicie una consulta legal avanzada</p>
                  <p className="text-sm">Ej: "¿Cuáles son los términos de prescripción en materia mercantil en Jalisco?"</p>
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                  <div className={`max-w-[85%] p-5 rounded-3xl shadow-sm ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none'}`}>
                    <div className="prose prose-sm prose-slate leading-relaxed">
                      {msg.text.split('\n').map((para, pidx) => <p key={pidx} className="mb-2 last:mb-0">{para}</p>)}
                    </div>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-200/50">
                        <p className="text-[10px] font-black uppercase text-indigo-500 mb-2 flex items-center gap-2">
                          <ICONS.Check /> Referencias Externas Verificadas
                        </p>
                        <div className="grid gap-2">
                          {msg.sources.map((s: any, j: number) => {
                             const uri = s.web?.uri || s.maps?.uri;
                             const title = s.web?.title || s.maps?.title || 'Fuente legal externa';
                             if (!uri) return null;
                             return (
                               <a key={j} href={uri} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-white/50 rounded-lg text-[10px] font-medium text-indigo-600 border border-indigo-100 hover:bg-indigo-50 transition-colors truncate">
                                 <span className="opacity-50">🔗</span> {title}
                               </a>
                             );
                          })}
                        </div>
                      </div>
                    )}
                    {msg.role === 'ai' && (
                      <button onClick={() => handleTTS(msg.text)} className="mt-4 text-[10px] font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1.5 transition-colors">
                        🔊 Reproducir Dictamen por Voz
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-3 text-xs text-indigo-500 font-bold animate-pulse">
                  <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  Procesando jurisprudencia y datos...
                </div>
              )}
            </div>
            
            <div className="flex gap-3 items-end sticky bottom-0 bg-white pb-4">
              <div className="relative flex-grow">
                <textarea 
                  rows={1}
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)} 
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleChat();
                    }
                  }}
                  placeholder="Escriba su consulta jurídica..." 
                  className="w-full p-4 pr-12 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none shadow-inner"
                />
                <div className="absolute right-3 bottom-3 text-slate-300 text-[10px] font-bold">↵</div>
              </div>
              <Button size="lg" onClick={handleChat} disabled={loading} className="h-[52px] w-[52px] !p-0">
                <ICONS.ArrowRight />
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'multimedia' && (
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-bold text-slate-900 text-xl">Generador Visual Nano Banana Pro</h4>
                  <p className="text-slate-500 text-sm">Cree diagramas, visualizaciones de evidencia o recreaciones.</p>
                </div>
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg font-black text-[10px] uppercase">Model: Imagen 3</div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="col-span-2">
                  <input 
                    type="text" 
                    value={imagePrompt} 
                    onChange={e => setImagePrompt(e.target.value)} 
                    placeholder="Ej: Fotografía forense de alta calidad mostrando huellas de frenado en asfalto húmedo..." 
                    className="w-full p-4 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-grow">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Aspect Ratio</label>
                    <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-white font-bold outline-none">
                      {['1:1', '3:4', '4:3', '9:16', '16:9', '21:9', '2:3', '3:2'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="flex-grow">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Calidad / Tamaño</label>
                    <select value={imageSize} onChange={e => setImageSize(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-white font-bold outline-none">
                      {['1K', '2K', '4K'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-end">
                   <Button size="lg" fullWidth onClick={generateImage} disabled={loading}>Generar Visual</Button>
                </div>
              </div>
              
              {generatedImage && (
                <div className="space-y-6 animate-in zoom-in-95 duration-500">
                  <div className="group relative">
                    <img src={generatedImage} alt="Generated" className="w-full rounded-3xl shadow-2xl border border-slate-200" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 rounded-3xl">
                       <Button size="sm" variant="outline" className="bg-white" onClick={() => window.open(generatedImage)}>Abrir Original</Button>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h5 className="font-bold text-sm mb-4 flex items-center gap-2">
                      <span className="text-indigo-500">✨</span> Refinamiento con Gemini 2.5 Flash Image
                    </h5>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={editPrompt} 
                        onChange={e => setEditPrompt(e.target.value)} 
                        placeholder="Instrucción de edición: 'Añadir más iluminación', 'Quitar objetos distractores'..." 
                        className="flex-grow p-4 rounded-2xl border border-slate-200 text-sm outline-none"
                      />
                      <Button variant="secondary" onClick={editImage} disabled={loading}>Aplicar Edición</Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <Button variant="outline" className="gap-2 px-10 border-indigo-200 text-indigo-600 hover:bg-indigo-50" onClick={() => generateVideo(true)} disabled={loading}>
                       🎬 Animar Imagen con Veo 3.1 (9:16 / 16:9)
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl">📽️</div>
              <div className="relative z-10">
                <h4 className="font-bold text-2xl mb-2">Cinematografía Legal Veo 3.1</h4>
                <p className="text-slate-400 text-sm mb-8">Generación de video fotorrealista para reconstrucción de hechos.</p>
                
                <div className="flex gap-3 mb-6">
                  <input 
                    type="text" 
                    value={videoPrompt} 
                    onChange={e => setVideoPrompt(e.target.value)} 
                    placeholder="Describe la escena: 'Recreación de colisión vehicular en cruce urbano con semáforo en rojo'..." 
                    className="flex-grow p-4 rounded-2xl border border-slate-700 bg-slate-800 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg"
                  />
                  <Button variant="secondary" onClick={() => generateVideo(false)} disabled={loading} className="px-8">
                    Producir Video
                  </Button>
                </div>
                
                {generatedVideo && (
                  <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="bg-black/50 p-2 rounded-[2rem] border border-slate-700 shadow-2xl">
                       <video src={generatedVideo} controls className="w-full rounded-[1.5rem]" />
                    </div>
                    <div className="mt-4 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">
                      <span>Codec: H.264 / 720p</span>
                      <span>Rendered by Veo Engine 3.1-Fast</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="max-w-3xl mx-auto py-10">
            <div className="bg-indigo-600 p-12 rounded-[3.5rem] text-center text-white shadow-2xl shadow-indigo-500/30">
               <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
                 <div className="text-5xl">🎙️</div>
               </div>
               <h4 className="font-bold text-3xl mb-4">Dictado Profesional Gemini 3</h4>
               <p className="text-indigo-100 mb-10 opacity-80 leading-relaxed max-w-md mx-auto">
                 Capture testimonios, acuerdos o notas de audiencia con precisión milimétrica mediante nuestro motor de transcripción avanzada.
               </p>
               
               <div className="flex flex-col items-center gap-6">
                 <button 
                   onClick={isRecording ? stopRecording : startRecording}
                   className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 scale-110 shadow-[0_0_40px_rgba(239,68,68,0.5)]' : 'bg-white text-indigo-600 hover:scale-105 shadow-xl'} relative group`}
                 >
                   {isRecording ? (
                     <div className="flex items-center gap-1">
                       <div className="w-2 h-8 bg-white rounded-full animate-bounce"></div>
                       <div className="w-2 h-12 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                       <div className="w-2 h-8 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                     </div>
                   ) : <span className="text-4xl">●</span>}
                   {isRecording && <div className="absolute -bottom-10 text-[10px] font-black uppercase tracking-widest text-white/50">Grabando...</div>}
                 </button>
               </div>

               {transcription && (
                 <div className="mt-16 text-left bg-white rounded-[2rem] p-8 shadow-2xl animate-in zoom-in duration-500">
                    <div className="flex justify-between items-center mb-6">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">Transcripción Verificada</span>
                      <button onClick={() => setTranscription('')} className="text-slate-300 hover:text-red-400 transition-colors"><ICONS.X /></button>
                    </div>
                    <p className="text-slate-800 leading-relaxed font-medium mb-8 text-lg">"{transcription}"</p>
                    <div className="flex gap-4">
                      <Button variant="primary" size="sm" onClick={() => handleTTS(transcription)} className="gap-2">🔊 Leer Dictamen</Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setChatInput(`Analiza legalmente este testimonio: "${transcription}"`);
                        setActiveTab('chat');
                      }}>⚖️ Analizar en Chat</Button>
                    </div>
                 </div>
               )}
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="max-w-5xl mx-auto space-y-8">
            <div 
              className="border-4 border-dashed border-slate-100 rounded-[3rem] p-20 text-center hover:border-indigo-400 hover:bg-indigo-50/10 transition-all cursor-pointer group" 
              onClick={() => fileInputRef.current?.click()}
            >
               <input type="file" ref={fileInputRef} onChange={analyzeFile} className="hidden" accept="image/*,video/*" />
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-indigo-100 group-hover:scale-110 transition-all duration-500 shadow-inner">
                 <div className="text-5xl group-hover:animate-bounce">🔍</div>
               </div>
               <h4 className="font-bold text-2xl text-slate-900 mb-4">Peritaje de Evidencia Digital</h4>
               <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
                 Suba fotografías de documentos, videos de CCTV o capturas de pantalla para un análisis forense profundo con **Gemini 3 Pro**.
               </p>
               <div className="mt-8 inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-xs font-bold">
                  Seleccionar Archivo <ICONS.ArrowRight />
               </div>
            </div>

            {analysisResult && (
              <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-200">LJ</div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-lg">Informe de Peritaje IA</h5>
                      <p className="text-slate-400 text-xs font-mono uppercase">Ref: PER-G3-0942</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => window.print()}>Imprimir Reporte</Button>
                </div>
                
                <div className="space-y-6">
                   {analysisResult.split('\n').map((line, i) => {
                     if (line.startsWith('##') || line.startsWith('**')) {
                       return <h6 key={i} className="font-bold text-indigo-700 mt-6 first:mt-0">{line.replace(/[#*]/g, '')}</h6>;
                     }
                     return <p key={i} className="text-slate-600 leading-relaxed text-sm">{line}</p>;
                   })}
                </div>
                
                <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                   <div className="text-2xl">🤖</div>
                   <div className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                     Nota: Este reporte ha sido generado mediante visión computacional avanzada. No sustituye la revisión física por un perito calificado, pero proporciona una base analítica sólida para el litigio.
                   </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-slate-50 px-8 py-5 text-[10px] text-slate-400 font-bold uppercase tracking-widest border-t border-slate-100 flex justify-between items-center">
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> System Online</span>
          <span>Version: 2.5.4-STABLE</span>
        </div>
        <div className="flex gap-4">
          <span>GDPR / LFPDPPP Compliant</span>
          <span className="text-indigo-600">Encrypted via AES-256</span>
        </div>
      </div>
    </div>
  );
};
