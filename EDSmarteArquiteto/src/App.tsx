import React, { useState, useRef } from 'react';
import { Upload, Home, PaintBucket, Camera, Settings, Sparkles, Image as ImageIcon, Video, ArrowRight, CheckCircle2, Loader2, X } from 'lucide-react';
import { CompareSlider } from './components/CompareSlider';
import { extractFrameFromVideo, resizeImage } from './utils/mediaUtils';
import { generateArchitecturalDesign } from './services/aiService';

function App() {
  const [dragActive, setDragActive] = useState(false);
  
  // Estados de IA e Mídia
  const [file, setFile] = useState<File | null>(null);
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Preferências
  const [selectedStyle, setSelectedStyle] = useState('Contemporâneo');
  const [prompt, setPrompt] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setGeneratedImage(null);
    try {
      if (selectedFile.type.startsWith('video/')) {
        const frame = await extractFrameFromVideo(selectedFile);
        setBaseImage(frame);
      } else if (selectedFile.type.startsWith('image/')) {
        const resized = await resizeImage(selectedFile);
        setBaseImage(resized);
      } else {
        alert("Formato não suportado. Envie Foto ou Vídeo.");
      }
    } catch (error) {
      console.error("Erro ao processar mídia", error);
      alert("Falha ao processar o arquivo.");
    }
  };

  const handleGenerate = async () => {
    if (!baseImage) return;
    setIsGenerating(true);
    try {
      const result = await generateArchitecturalDesign({
        imageDelta: baseImage,
        style: selectedStyle,
        colors: [],
        prompt
      });
      setGeneratedImage(result);
    } catch (error) {
      alert("Erro ao gerar arquitetura com IA.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetProject = () => {
    setFile(null);
    setBaseImage(null);
    setGeneratedImage(null);
    setPrompt('');
  };

  const styleOptions = ['Contemporâneo', 'Rústico', 'Minimalista', 'Industrial', 'Clássico'];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar - Premium Dark */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-col justify-between hidden md:flex relative z-10 glass-dark">
        <div>
          <div className="p-6 flex items-center space-x-3 cursor-pointer" onClick={resetProject}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
              <Sparkles size={20} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">EDSmarte</span>
          </div>
          
          <nav className="mt-8 px-4 space-y-2">
            <NavItem icon={<Home size={20} />} text="Dashboard" active />
            <NavItem icon={<PaintBucket size={20} />} text="Virtual Staging" />
            <NavItem icon={<ImageIcon size={20} />} text="Redesign Fachadas" />
            <NavItem icon={<Camera size={20} />} text="Plantas Inteligentes" />
          </nav>
        </div>
        
        <div className="p-4 mb-4">
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-md">
            <p className="text-sm font-medium text-white mb-2">Plano Pro</p>
            <p className="text-xs text-slate-400 mb-3">150 renders restantes</p>
            <div className="w-full bg-slate-700 rounded-full h-1.5 mb-3">
              <div className="bg-blue-500 h-1.5 rounded-full w-3/4 animate-pulse"></div>
            </div>
            <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-all">
              Fazer Upgrade
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-y-auto w-full">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/80 to-transparent -z-10"></div>
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute top-[20%] left-[-5%] w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Header */}
        <header className="flex items-center justify-between p-6 glass-panel sticky top-0 z-20">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              {baseImage ? "Configurar IA" : "Novo Projeto"}
            </h1>
            <p className="text-sm text-slate-500">
              {baseImage ? "Ajuste os parâmetros abaixo para gerar o design." : "Transforme ambientes em segundos com Inteligência Artificial."}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-slate-200/50 text-slate-600 transition-colors">
              <Settings size={20} />
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center font-bold text-slate-600">
               EA
            </div>
          </div>
        </header>

        {/* Workspace Area */}
        <div className="p-6 md:p-10 max-w-6xl mx-auto w-full flex-1 flex flex-col">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Esquerda: Área de Visão / Upload */}
            <div className="xl:col-span-2 space-y-6">
              
              {!baseImage ? (
                // Estado 1: Upload de Arquivo
                <div 
                  className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-all duration-300 ease-in-out glass
                    ${dragActive ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/50'}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*,video/mp4,video/quicktime" 
                    onChange={(e) => e.target.files && processFile(e.target.files[0])}
                  />
                  <div className="w-20 h-20 bg-blue-100/50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner ring-4 ring-white">
                    <Upload size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Arraste a Mídia do Imóvel</h3>
                  <p className="text-slate-500 max-w-sm mb-8">
                    Faça o upload de um <strong>Vídeo (MP4/MOV)</strong> ou <strong>Foto</strong> da fachada ou interior. A IA extrai o melhor ângulo automaticamente.
                  </p>
                  <div className="flex space-x-4">
                    <button className="px-6 py-3 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all font-medium flex items-center space-x-2 animate-fade-in pointer-events-none">
                      <Video size={18} />
                      <span>Enviar Mídia</span>
                    </button>
                  </div>
                </div>
              ) : (
                // Estado 2: Foto Carregada ou Imagem Gerada
                <div className="animate-fade-in relative">
                  {!generatedImage ? (
                    // Estado Intermediário: Apenas a base image carregada
                    <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100 aspect-[16/9] flex items-center justify-center">
                      <img src={baseImage} alt="Original" className={`w-full h-full object-cover transition-all duration-500 ${isGenerating ? 'blur-md scale-105 opacity-50' : ''}`} />
                      
                      {isGenerating && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm z-10">
                          <Loader2 size={48} className="text-white animate-spin mb-4" />
                          <h3 className="text-white text-xl font-bold tracking-wide shadow-black drop-shadow-md">
                            A IA está renderizando...
                          </h3>
                          <p className="text-white/80 font-medium">Aplicando estilo {selectedStyle}</p>
                        </div>
                      )}
                      
                      {!isGenerating && (
                        <button 
                          onClick={resetProject}
                          className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-slate-800 p-2 rounded-full shadow-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Remover Imagem"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ) : (
                    // Estado Final: Resultado Gerado
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-800 flex items-center space-x-2">
                          <Sparkles size={20} className="text-emerald-500" />
                          <span>Projeto Finalizado! Resultado de {selectedStyle}</span>
                        </h4>
                        <button onClick={resetProject} className="text-sm font-medium text-blue-600 hover:text-blue-800 underline transition-colors">
                          Iniciar Novo Projeto
                        </button>
                      </div>
                      
                      <CompareSlider beforeImage={baseImage} afterImage={generatedImage} />
                    </div>
                  )}
                </div>
              )}

              {/* Informações Extras se não gerado */}
              {!generatedImage && !baseImage && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                    <Sparkles size={18} className="text-blue-500" />
                    <span>Ou Teste com Nossas Amostras Premium</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", tag: "Fachada" },
                      { img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", tag: "Sala de Estar" },
                      { img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", tag: "Quarto Vazio" }
                    ].map((item, i) => (
                      <div key={i} className="group relative aspect-video bg-slate-200 rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-slate-200" onClick={() => processFile(new File([new Blob()], "demo.jpg", { type: "image/jpeg" }))}>
                        <img 
                          src={item.img} 
                          alt="Inspiração" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <span className="text-white text-sm font-medium">Testar {item.tag}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Direita: Painel de Preferências */}
            <div className={`bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 h-fit transition-opacity duration-500 ${isGenerating ? 'opacity-50 pointer-events-none grayscale-[50%]' : ''}`}>
              <h3 className="text-lg font-bold mb-6">Preferências da IA</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-3 block">Estilo Cobiçado</label>
                  <div className="flex flex-wrap gap-2">
                    {styleOptions.map((estilo) => (
                      <button 
                        key={estilo} 
                        onClick={() => setSelectedStyle(estilo)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedStyle === estilo ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        {estilo}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-3 block">Paleta Predominante</label>
                  <div className="flex gap-3">
                    {['bg-slate-100', 'bg-stone-800', 'bg-amber-700', 'bg-blue-900', 'bg-emerald-800'].map((color, idx) => (
                      <div key={idx} className={`w-8 h-8 rounded-full ${color} cursor-pointer ring-2 ring-offset-2 ${idx === 0 ? 'ring-blue-500' : 'ring-transparent hover:ring-slate-300'} transition-all`}></div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Instruções Extras (Opcional)</label>
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none h-28"
                    placeholder="Ex: Adicionar piso vinílico estilo madeira natural, rebaixar o teto com gesso e incluir sanca de luz."
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button 
                    onClick={handleGenerate}
                    disabled={!baseImage || isGenerating}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all transform ${!baseImage || isGenerating ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/20 hover:scale-[1.02]'}`}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Renderizando...</span>
                      </>
                    ) : (
                      <>
                        <span>Gerar Projeto com IA</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center space-x-1">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span>Requer 1 crédito de processamento</span>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, text, active = false }: { icon: React.ReactNode, text: string, active?: boolean }) {
  return (
    <a href="#" className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-blue-500/10 text-blue-500 font-semibold' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
      {icon}
      <span>{text}</span>
    </a>
  );
}

export default App;
