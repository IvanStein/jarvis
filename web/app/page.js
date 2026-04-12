"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, User, Bot, Paperclip, Loader2, LayoutDashboard, MessageSquare, Shield, Zap, Heart, DollarSign, Settings2, Database } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'dashboard'
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Saudações, Ivan. O sistema está operacional. Como posso auxiliá-lo hoje?', module: 'JARVIS' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLearning, setIsLearning] = useState(false);
  const [dashboardData, setDashboardData] = useState({ specialists: [], totalKnowledge: 0 });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      setDashboardData(data);
    } catch (e) {
      console.error(e);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, userId: 'ivan_stein' }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.response, module: data.module }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'error', text: 'Falha crítica na rede.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsLearning(true);
    setMessages(prev => [...prev, { role: 'system', text: `Analisando: ${file.name}...` }]);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.response, module: 'RAG' }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'error', text: 'Falha no processamento do arquivo.' }]);
    } finally {
      setIsLearning(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full bg-[#030303] text-zinc-100 font-sans overflow-hidden items-center justify-center p-0 md:p-6 lg:p-10 selection:bg-blue-500/30">
      
      {/* 1. EFEITOS DE LUZ ESPACIAL (BACKGROUND) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-[100%] mix-blend-screen pointer-events-none animate-pulse" style={{animationDuration: '8s'}} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-teal-600/15 blur-[150px] rounded-[100%] mix-blend-screen pointer-events-none animate-pulse" style={{animationDuration: '12s', animationDelay: '2s'}} />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      {/* 2. JANELA PRINCIPAL FLUTUANTE (SPATIAL OS) */}
      <div className="relative w-full max-w-7xl h-full flex flex-col bg-zinc-950/60 backdrop-blur-3xl border border-white/[0.08] md:rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden z-10 transition-all duration-700 p-0 md:p-2">
        
        {/* === HEADER INTELIGENTE === */}
        <header className="flex-none flex items-center justify-between px-6 py-4 w-full relative z-30">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                AURA <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] uppercase tracking-widest text-zinc-300 border border-white/5 font-semibold">OS</span>
              </h1>
              <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest hidden sm:block">Cognitive Core 4.0</p>
            </div>
          </div>

          {/* Segmented Control (Mac Style) */}
          <div className="hidden sm:flex bg-black/60 backdrop-blur p-1.5 rounded-full border border-white/5 shadow-inner">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'chat' 
                  ? 'bg-zinc-800 text-white shadow-md' 
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              Comunicação
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'dashboard' 
                  ? 'bg-zinc-800 text-white shadow-md' 
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              Telemetria
            </button>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-semibold tracking-wider text-zinc-300">SINCRONIZADO</span>
             </div>
             <button className="sm:hidden p-3 rounded-full bg-white/5 border border-white/10" onClick={() => setActiveTab(activeTab === 'chat' ? 'dashboard' : 'chat')}>
                {activeTab === 'chat' ? <LayoutDashboard className="w-5 h-5 text-white" /> : <MessageSquare className="w-5 h-5 text-white" />}
             </button>
          </div>
        </header>

        {/* === ÁREA CRÍTICA INTERNA (DISPLAY) === */}
        <div className="flex-1 w-full bg-black/40 md:rounded-[2rem] border-t md:border border-white/[0.03] overflow-hidden flex flex-col relative z-20 shadow-inner">
          
          {activeTab === 'chat' ? (
            
            /* -- MODO COMUNICAÇÃO (CHAT) -- */
            <div className="flex-1 flex flex-col relative w-full h-full">
              
              <div className="flex-1 overflow-y-auto w-full px-4 sm:px-8 py-8 md:py-10 pb-40 scroll-smooth">
                <div className="max-w-4xl mx-auto space-y-10">
                  
                  {messages.length === 0 && (
                     <div className="flex flex-col items-center justify-center text-center mt-32 animate-in slide-in-from-bottom-8 duration-700">
                        <div className="w-20 h-20 bg-gradient-to-b from-zinc-800 to-black rounded-[2rem] p-[1px] shadow-2xl mb-6">
                           <div className="w-full h-full bg-black rounded-[2rem] flex items-center justify-center border border-white/10 shadow-inner">
                             <Sparkles className="w-8 h-8 text-blue-400" />
                           </div>
                        </div>
                        <h2 className="text-3xl font-semibold text-white tracking-tight mb-3">Conexão Estabelecida</h2>
                        <p className="text-zinc-500 max-w-md text-sm leading-relaxed">
                          AURA OS processando em tempo real. Interaja com os módulos de desenvolvimento, análise ou saúde. O que priorizamos?
                        </p>
                     </div>
                  )}

                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                      
                      {msg.role === 'user' ? (
                        <div className="max-w-[85%] md:max-w-[75%] px-6 py-4 bg-gradient-to-br from-blue-600/20 to-blue-900/10 backdrop-blur-xl text-blue-50 border border-blue-500/20 rounded-[2rem] rounded-tr-md shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                          <p className="text-[15px] leading-relaxed font-light">{msg.text}</p>
                        </div>
                      ) : (
                        <div className="flex gap-4 md:gap-5 max-w-[95%] md:max-w-[85%]">
                          <div className="shrink-0 mt-2">
                             {msg.role === 'system' ? (
                               <div className="w-10 h-10 rounded-2xl border border-zinc-700/50 flex items-center justify-center bg-black/50 shadow-lg backdrop-blur-sm">
                                 <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                               </div>
                             ) : (
                               <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-xl shadow-white/10">
                                 <Bot className="w-5 h-5 text-black" />
                               </div>
                             )}
                          </div>
                          
                          <div className="flex-1 space-y-1.5 pt-2 min-w-0">
                             {(msg.module || msg.role !== 'system') && (
                               <div className="flex items-center gap-3 mb-3">
                                 <span className="font-semibold text-[13px] text-zinc-300">
                                   {msg.role === 'system' ? 'SISTEMA' : 'AURA IV'}
                                 </span>
                                 {msg.module && (
                                   <span className="text-[9px] uppercase font-bold tracking-widest text-cyan-400 bg-cyan-950/50 border border-cyan-800/50 px-2 py-0.5 rounded-full shadow-inner">
                                     {msg.module}
                                   </span>
                                 )}
                               </div>
                             )}
                             <div className={`text-[15px] font-light leading-relaxed ${msg.role === 'error' ? 'text-red-300 bg-red-950/20 p-4 rounded-2xl border border-red-900/30' : msg.role === 'system' ? 'text-zinc-500 italic text-[14px]' : 'text-zinc-200'}`}>
                                {msg.text}
                             </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                     <div className="flex gap-5 max-w-[85%] animate-in fade-in duration-300">
                        <div className="shrink-0 mt-2">
                           <div className="w-10 h-10 rounded-2xl border border-white/5 flex items-center justify-center bg-black/50 backdrop-blur">
                             <Sparkles className="w-4 h-4 animate-pulse text-zinc-500" />
                           </div>
                        </div>
                        <div className="flex-1 pt-5">
                           <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce shadow-[0_0_10px_rgba(59,130,246,0.8)]" style={{animationDelay: '150ms'}}></div>
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce shadow-[0_0_10px_rgba(59,130,246,0.8)]" style={{animationDelay: '300ms'}}></div>
                           </div>
                        </div>
                     </div>
                  )}

                </div>
              </div>

              {/* Input Pílula Flutuante Spatial */}
              <div className="absolute bottom-6 md:bottom-10 left-0 right-0 px-4 md:px-0 flex justify-center z-30 pointer-events-none">
                 <div className="w-full max-w-3xl bg-zinc-900/70 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-2 flex items-end shadow-[0_20px_60px_rgba(0,0,0,0.8)] pointer-events-auto transition-all duration-300 focus-within:bg-zinc-900/90 focus-within:border-blue-500/30 focus-within:shadow-[0_20px_80px_rgba(59,130,246,0.15)] relative">
                    
                    <button 
                      onClick={() => fileInputRef.current.click()}
                      className="w-12 h-12 mb-1 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileUpload} />
                    
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      rows="1"
                      placeholder={isLearning ? "Aguarde indexação..." : "Comunique-se com Jarvis..."}
                      className="flex-1 max-h-32 min-h-[44px] mb-[6px] px-2 bg-transparent text-white placeholder:text-zinc-500 focus:outline-none resize-none py-[10px] text-[16px] font-medium overflow-y-auto leading-relaxed"
                      style={{ fieldSizing: 'content' }}
                    />
                    
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim() || isLoading}
                      className="w-12 h-12 mb-1 flex items-center justify-center rounded-full bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:shadow-none"
                    >
                      <Send className="w-5 h-5 ml-1" />
                    </button>

                    <p className="absolute -bottom-8 left-0 right-0 text-center text-[10px] font-medium tracking-wide text-zinc-500 uppercase">
                      Jarvis pode iterar erroneamente. Audite as saídas.
                    </p>
                 </div>
              </div>

            </div>
          ) : (

            /* -- MODO TELEMETRIA (DASHBOARD) -- */
            <div className="flex-1 overflow-y-auto w-full px-6 py-10 md:p-12 pb-32 scroll-smooth">
              <div className="max-w-6xl mx-auto space-y-12">
                 
                 <div className="text-center md:text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-4xl font-semibold tracking-tight text-white mb-2">Telemetria de Sistema</h2>
                    <p className="text-zinc-400 text-sm max-w-md mx-auto md:mx-0 leading-relaxed">Capacidade alocada e configuração das redes neurais ativas do framework.</p>
                 </div>

                 {/* Cartões Estatísticos de Vidro Neon */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {[
                      { label: 'Cérebro Quântico', value: dashboardData.totalKnowledge, desc: 'Setores alocados via RAG', icon: Database, bg: 'bg-blue-500/10 text-blue-400 bg-gradient-to-br from-blue-900/20 to-blue-600/5 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]' },
                      { label: 'Operacionalidade', value: 'Máxima', desc: 'Performance em 100%', icon: Zap, bg: 'bg-teal-500/10 text-teal-400 bg-gradient-to-br from-teal-900/20 to-teal-600/5 border-teal-500/20 shadow-[0_0_30px_rgba(20,184,166,0.1)]' },
                      { label: 'Privilégio Kernel', value: 'Root', desc: 'Permissões avançadas', icon: Shield, bg: 'bg-cyan-500/10 text-cyan-400 bg-gradient-to-br from-cyan-900/20 to-cyan-600/5 border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]' },
                    ].map((s, i) => (
                      <div key={i} className={`flex flex-col p-8 backdrop-blur-xl border rounded-[2rem] hover:scale-[1.02] transition-all relative overflow-hidden group ${s.bg}`}>
                         <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/[0.03] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
                         <div className="flex items-center justify-between mb-8">
                             <p className="text-sm font-semibold tracking-wider uppercase opacity-80">{s.label}</p>
                             <div className="p-3 bg-black/40 rounded-2xl shadow-inner backdrop-blur-md">
                               <s.icon className="w-5 h-5" />
                             </div>
                         </div>
                         <div className="mt-auto">
                            <h3 className="text-4xl font-bold text-white tracking-tighter mb-2">{s.value}</h3>
                            <p className="text-[13px] opacity-70 font-medium">{s.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="pt-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                    <h3 className="text-2xl font-medium text-white mb-8">Nódulos Neurais <span className="opacity-40">Especialistas</span></h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {((dashboardData.specialists && dashboardData.specialists.length > 0) ? dashboardData.specialists : [
                        { id: 'CODING', name: 'Software Engineer', icon: Zap, instruction: 'Otimização avançada, clean code e design patterns.' },
                        { id: 'FINANCE', name: 'Market Analyst', icon: DollarSign, instruction: 'Projeções e cálculos estratégicos B2B.' },
                        { id: 'HEALTH', name: 'Bio-Advisor', icon: Heart, instruction: 'Avaliação científica de protocolos orgânicos.' },
                        { id: 'PERSONAL', name: 'Exec Assistant', icon: Settings2, instruction: 'Organização algorítmica de fluxo e dados.' },
                      ]).map((s, i) => (
                         <div key={i} className="flex flex-col p-6 bg-zinc-950/60 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-xl hover:border-blue-500/30 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] transition-all group cursor-pointer relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="flex items-center justify-between mb-8 relative z-10">
                               <div className="w-14 h-14 rounded-[1.25rem] bg-black/80 border border-white/10 flex items-center justify-center text-zinc-300 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                                 {(s.icon) ? <s.icon className="w-6 h-6"/> : <Bot className="w-6 h-6" />}
                               </div>
                               <span className="text-[9px] font-black tracking-widest text-zinc-500 uppercase bg-black/50 backdrop-blur px-3 py-1.5 rounded-full border border-white/5 group-hover:border-blue-500/30 group-hover:text-blue-200 transition-colors">
                                 {s.id}
                               </span>
                            </div>
                            
                            <h4 className="text-lg font-semibold text-white mb-3 relative z-10">{s.name}</h4>
                            <p className="text-[13px] text-zinc-400 font-medium leading-relaxed flex-1 relative z-10">
                               {s.instruction}
                            </p>
                            
                            <button className="mt-8 w-full py-3 bg-white/5 border border-white/5 text-zinc-300 hover:text-black hover:bg-white rounded-[1rem] text-[13px] font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-2 relative z-10">
                               <Zap className="w-4 h-4 fill-current opacity-50" /> Sintonizar Kernel
                            </button>
                         </div>
                      ))}
                    </div>
                 </div>

              </div>
            </div>

          )}
        </div>
      </div>
    </div>
  );
}
