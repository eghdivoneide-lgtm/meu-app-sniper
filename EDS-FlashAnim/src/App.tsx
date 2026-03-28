import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Image as ImageIcon, Download, Video, Loader2, AlertTriangle, Clapperboard, Settings2 } from 'lucide-react';

const DEFAULT_PROMPT = `EDS FlashAnim Engine v1.0 — Geração de Animação Cinematográfica\n\n[STYLE: CINEMATIC] — Cena Natural\nUma paisagem urbana futurista ao entardecer com arranha-céus iluminados por neon dourado e azul. Partículas de luz flutuam pelo ar como vaga-lumes digitais. A câmera faz um zoom suave de 1x para 1.15x com leve panorâmica horizontal revelando a cidade. Resolução 1080p, 30fps, iluminação cinematográfica com bokeh suave. Desenvolvido pela EDS Soluções Inteligentes — EDS FlashAnim App.`;

function App() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setVideoUrl(null);
    
    try {
      const response = await axios.post('/api/generate-video', {
        prompt,
        imageBase64: image
      });
      
      if (response.data.success && response.data.videos.length > 0) {
        const video = response.data.videos[0];
        
        if (video.videoBase64) {
          // Converter base64 para Blob URL (suporta vídeos grandes >2MB que data URIs não suportam)
          const byteCharacters = atob(video.videoBase64);
          const byteNumbers = new Uint8Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const blob = new Blob([byteNumbers], { type: video.mimeType || 'video/mp4' });
          const blobUrl = URL.createObjectURL(blob);
          setVideoUrl(blobUrl);
        } else if (video.uri) {
          setVideoUrl(video.uri);
        } else {
          throw new Error("Nenhuma URL ou dados de vídeo retornados");
        }
      } else {
        throw new Error("Nenhum vídeo retornado pelo servidor");
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || "Erro desconhecido";
      if (err.response?.status === 429 || errorMsg.includes("429") || errorMsg.includes("quota")) {
        setError("⏱️ Limites de Cota da API Veo 2.0 excedidos (429). O tráfego de geração de vídeo está intenso. Tente novamente em alguns minutos.");
      } else if (errorMsg.includes("raiMediaFilter") || errorMsg.includes("63236870") || errorMsg.includes("safety settings") || errorMsg.includes("filtro de segurança")) {
        setError("🚫 Prompt bloqueado pelo filtro de segurança Google Veo: personagens ou rostos humanos detectados no prompt. Remova referências a pessoas, expressões faciais ou personagens do roteiro e tente novamente.");
      } else {
        setError(`Falha ao renderizar: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-[#c9a84c] selection:text-black flex flex-col">
      {/* Header Premium */}
      <header className="px-8 py-6 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#7a6428] flex items-center justify-center shadow-[0_0_20px_rgba(201,168,76,0.3)]">
                <Clapperboard className="text-black w-7 h-7" />
            </div>
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    EDS Flash<span className="text-[#c9a84c]">Anim</span> Pro
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-widest uppercase mt-0.5">Inteligência Cinematográfica Veo 2.0</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="hidden sm:flex px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold tracking-wide items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                ENGINE ONLINE
            </div>
            <button className="p-2.5 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white border border-transparent hover:border-white/10">
                <Settings2 className="w-5 h-5" />
            </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 md:p-8 grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
        
        {/* Painel Esquerdo: Ferramentas de Direção */}
        <aside className="xl:col-span-4 flex flex-col gap-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-30"></div>
            
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
               <ImageIcon className="w-4 h-4 text-[#c9a84c]" />
               1. Keyframe Referência
            </h2>
            
            <div className="relative border-2 border-dashed border-gray-700/60 hover:border-[#c9a84c]/50 rounded-xl p-8 flex flex-col items-center justify-center bg-black/40 transition-all cursor-pointer group-hover:bg-white/[0.02]">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {image ? (
                <img src={image} alt="Upload" className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-80 transition-opacity group-hover:opacity-100" />
              ) : (
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-4 border border-gray-700/50 group-hover:border-[#c9a84c]/50 transition-colors">
                        <ImageIcon className="w-8 h-8 text-gray-500 group-hover:text-[#c9a84c] transition-colors" />
                    </div>
                    <span className="text-sm text-gray-300 font-medium">Faça upload da imagem inicial</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG ou WEBP (Max 10MB)</span>
                </div>
              )}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-2xl">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
               <Settings2 className="w-4 h-4 text-[#c9a84c]" />
               2. Roteiro Operacional
            </h2>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-[220px] bg-[#0a0a0a] border border-gray-800 rounded-xl p-5 text-gray-300 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/50 text-sm leading-relaxed resize-none transition-all placeholder-gray-600 custom-scrollbar shadow-inner"
              placeholder="Descreva a ação, o estilo visual e os movimentos de câmera da sua cena..."
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:ring-offset-2 focus:ring-offset-[#050505] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(201,168,76,0.15)] hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#b09138] via-[#f1df8b] to-[#b09138] rounded-xl opacity-70 group-hover:opacity-100 transition-opacity"></span>
            <div className="relative bg-[#111] backdrop-blur-sm rounded-xl px-6 py-4 flex items-center justify-center gap-3 transition-colors group-hover:bg-[#1a1a1a]">
                {loading ? (
                    <>
                        <Loader2 className="w-6 h-6 text-[#c9a84c] animate-spin" />
                        <span className="font-bold text-white tracking-wider text-sm">COMPILANDO CENA...</span>
                    </>
                ) : (
                    <>
                        <Sparkles className="w-6 h-6 text-[#c9a84c] group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-white tracking-wider text-sm">RENDERIZAR ANIMAÇÃO</span>
                    </>
                )}
            </div>
          </button>

          {error && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-3 backdrop-blur-sm animate-in fade-in">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-200 leading-relaxed">{error}</p>
            </div>
          )}
        </aside>

        {/* Painel Direito: Viewport */}
        <section className="xl:col-span-8 flex flex-col min-h-[500px] xl:min-h-0">
            <div className={`glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden relative transition-all duration-700 bg-[#0a0a0a] border ${videoUrl ? 'border-[#c9a84c]/20 shadow-[0_0_50px_rgba(201,168,76,0.08)]' : 'border-white/5'}`}>
                
                {/* Viewport Top Bar */}
                <div className="h-10 border-b border-white/5 bg-[#111] flex items-center px-4 justify-between absolute top-0 left-0 w-full z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/30"></div>
                        <span className="ml-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Output Viewport</span>
                    </div>
                    {videoUrl && (
                        <div className="px-2 py-0.5 rounded border border-[#c9a84c]/30 text-[#c9a84c] text-[9px] font-bold tracking-widest uppercase">
                            1080p • 30fps • SDR
                        </div>
                    )}
                </div>

                {/* Viewport Content */}
                <div className="flex-1 w-full bg-[#050505] flex items-center justify-center pt-10 relative overflow-hidden">
                    {/* Background Grid Pattern when empty */}
                    {!videoUrl && !loading && (
                        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                    )}

                    {loading && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl">
                            <div className="relative w-36 h-36 flex items-center justify-center mb-6">
                                {/* Outer ring */}
                                <div className="absolute inset-0 border-[3px] border-t-transparent border-r-transparent border-b-[#c9a84c]/80 border-l-[#c9a84c]/80 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
                                {/* Inner ring */}
                                <div className="absolute inset-4 border-[2px] border-t-[#c9a84c]/40 border-r-[#c9a84c]/40 border-b-transparent border-l-transparent rounded-full animate-spin flex-reverse" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                                {/* Center Icon */}
                                <div className="bg-[#111] w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(201,168,76,0.2)]">
                                    <Video className="w-7 h-7 text-[#c9a84c] animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-white tracking-[0.2em] uppercase">Sintetizando Frames</h3>
                            <p className="text-gray-400 mt-3 text-sm text-center max-w-sm px-4">
                                Conectado ao cluster Google Veo 2.0. O processamento de física e luz pode levar entre 45s a 2 minutos.
                            </p>
                            
                            <div className="w-64 h-1.5 bg-gray-900 rounded-full mt-8 overflow-hidden border border-white/5 relative">
                                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#b09138] to-[#c9a84c] w-full origin-left animate-progress shadow-[0_0_10px_rgba(201,168,76,0.5)]"></div>
                            </div>
                        </div>
                    )}

                    {videoUrl ? (
                        <div className="w-full h-full p-4 sm:p-8 flex items-center justify-center bg-black/40">
                            <video 
                                src={videoUrl} 
                                controls 
                                autoPlay 
                                loop 
                                className="max-w-full max-h-full object-contain rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/5"
                            />
                        </div>
                    ) : (
                        !loading && (
                            <div className="text-center flex flex-col items-center p-8 z-10">
                                <div className="w-24 h-24 rounded-full bg-gray-900/50 border border-white/5 flex items-center justify-center mb-6 shadow-inner">
                                    <Video className="w-10 h-10 text-gray-700" />
                                </div>
                                <h3 className="text-xl font-light text-gray-300 tracking-wide">Cena Vazia</h3>
                                <p className="text-gray-500 mt-3 max-w-sm text-sm leading-relaxed">
                                    Aguardando as instruções do roteiro e mídia de referência para iniciar a síntese da Inteligência Artificial.
                                </p>
                            </div>
                        )
                    )}
                </div>

                {/* Viewport Bottom Bar / Actions */}
                {videoUrl && (
                    <div className="p-4 border-t border-white/5 bg-[#0a0a0a] flex justify-end">
                        <button 
                            onClick={() => {
                                const a = document.createElement('a');
                                a.href = videoUrl;
                                a.download = `EDS_FlashAnim_Veo_${Date.now()}.mp4`;
                                a.click();
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c9a84c] text-black font-bold hover:bg-[#eac55e] transition-colors text-sm shadow-[0_0_15px_rgba(201,168,76,0.2)]"
                        >
                            <Download className="w-4 h-4" />
                            EXPORTAR ALTA RESOLUÇÃO
                        </button>
                    </div>
                )}
            </div>
        </section>

      </main>
    </div>
  );
}

export default App;
