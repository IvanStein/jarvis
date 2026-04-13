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
    <div className="flex flex-col md:flex-row h-screen w-full bg-[--background] text-[--foreground] overflow-hidden antialiased">
      
      {/* --- SIDEBAR: Tonal Depth Level 1 --- */}
      <aside className="hidden md:flex flex-col w-[260px] bg-[--surface-container-low] pt-4 pb-4 px-3 shrink-0 relative z-20">
        
        {/* Logo / Header da Sidebar */}
        <div className="flex items-center gap-3 px-3 py-2 mb-8 mt-2 group cursor-pointer">
          <div className="w-6 h-6 rounded-md liquid-light flex items-center justify-center shrink-0 shadow-[0_0_20px_var(--primary-dim)]">
            <Sparkles className="w-3.5 h-3.5 text-[--on-primary]" />
          </div>
          <span className="font-bold text-[14px] text-[--foreground] tracking-tight display-font uppercase">Jarvis Workspace</span>
        </div>

        {/* Navegação */}
        <div className="flex-1 space-y-1">
          <div className="px-3 text-[11px] font-medium text-[#71717a] mb-2 uppercase tracking-wider">AURA OS</div>
          
          <button 
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-[13px] transition-all duration-300 ${
              activeTab === 'chat' 
                ? 'bg-[--surface-container-highest] text-[--primary] font-semibold ghost-border' 
                : 'text-[--on-surface-variant] hover:bg-[--surface-container] hover:text-[--foreground]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-[14px] h-[14px]" />
              Terminal de IA
            </div>
            {activeTab === 'chat' && <span className="w-1.5 h-1.5 rounded-full bg-[--primary] shadow-[0_0_8px_var(--primary)]"></span>}
          </button>
          
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-[13px] transition-all duration-300 ${
              activeTab === 'dashboard' 
                ? 'bg-[--surface-container-highest] text-[--primary] font-semibold ghost-border' 
                : 'text-[--on-surface-variant] hover:bg-[--surface-container] hover:text-[--foreground]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-[14px] h-[14px]" />
              Monitor Neural
            </div>
            {activeTab === 'dashboard' && <span className="w-1.5 h-1.5 rounded-full bg-[--primary] shadow-[0_0_8px_var(--primary)]"></span>}
          </button>
        </div>

        {/* Rodapé Sidebar */}
        <div className="pt-4 border-t border-[--outline-variant]">
          <div className="flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-[--surface-container-highest] rounded-md transition-colors group">
            <div className="w-7 h-7 rounded-full bg-[--surface-container] ghost-border flex items-center justify-center shrink-0 group-hover:bg-[--primary] transition-colors">
              <User className="w-3.5 h-3.5 text-[--on-surface-variant] group-hover:text-[--on-primary]" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[13px] font-bold text-[--foreground] truncate display-font uppercase tracking-tight">Admin_Root</span>
              <span className="text-[10px] text-[--on-surface-variant] truncate font-mono opacity-60">ivan@jarvis.local</span>
            </div>
          </div>
        </div>
      </aside>

      {/* --- ÁREA PRINCIPAL (MAIN) --- */}
      <main className="flex-1 min-w-0 flex flex-col h-full bg-[--surface] relative">
        
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between px-5 h-14 bg-[--surface-container-low]/90 backdrop-blur-md sticky top-0 z-40">
           <div className="flex items-center gap-2">
              <div className="w-5 h-5 liquid-light rounded flex items-center justify-center">
                 <Sparkles className="w-3 h-3 text-[--on-primary]" />
              </div>
              <span className="font-bold text-[13px] display-font uppercase tracking-tighter">Jarvis</span>
           </div>
           <div className="flex gap-1.5">
             <button onClick={() => setActiveTab('chat')} className={`p-1.5 rounded-md transition-colors ${activeTab === 'chat' ? 'bg-[--surface-container-highest] text-[--primary] ghost-border' : 'text-[--on-surface-variant]'}`}><MessageSquare className="w-[15px] h-[15px]"/></button>
             <button onClick={() => setActiveTab('dashboard')} className={`p-1.5 rounded-md transition-colors ${activeTab === 'dashboard' ? 'bg-[--surface-container-highest] text-[--primary] ghost-border' : 'text-[--on-surface-variant]'}`}><LayoutDashboard className="w-[15px] h-[15px]"/></button>
           </div>
        </div>

        {/* Header Sutil (Desktop) */}
        <div className="hidden md:flex h-14 w-full items-center justify-between px-8 bg-[--surface] select-none">
           <div className="flex items-center gap-2 text-[13px] font-medium text-[--on-surface-variant]">
              <span className="display-font tracking-widest text-[11px] opacity-70">AURA_OS</span> <span className="text-[#3f3f46]">/</span> <span className="text-[--foreground] uppercase tracking-tighter">{activeTab === 'chat' ? 'Terminal' : 'Monitor'}</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-[--surface-container-low] px-3 py-1 rounded-full ghost-border">
                 <div className="w-1.5 h-1.5 bg-[--primary] rounded-full shadow-[0_0_8px_var(--primary)]"></div>
                 <span className="text-[10px] font-bold text-[--on-surface-variant] uppercase tracking-widest">System_Live</span>
              </div>
           </div>
        </div>

        {/* Container Central com Scroll */}
        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col relative z-10 scroll-smooth">
          
          {activeTab === 'chat' ? (
            
            /* -- INTERFACE DO TERMINAL / CHAT -- */
            <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col pt-8 pb-48 md:py-12 md:pb-56 relative px-5">
              
              {/* Contexto Vazio */}
              {messages.length === 0 && (
                 <div className="flex-1 flex flex-col justify-center max-w-lg mt-10 md:mt-20">
                    <div className="w-12 h-12 bg-[--surface-container] ghost-border rounded-xl flex items-center justify-center mb-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                       <Bot className="w-5 h-5 text-[--primary]" />
                    </div>
                    <h2 className="text-4xl font-bold tracking-tighter text-[--foreground] mb-3 display-font uppercase">Modelos Inicializados.</h2>
                    <p className="text-[15px] text-[--on-surface-variant] leading-relaxed max-w-md">
                      AURA IV está escutando. Injete relatórios ou acione módulos de telemetria via prompt de comando.
                    </p>
                 </div>
              )}

              {/* Trama de Mensagens (Estilo Linear Comments) */}
              <div className="flex flex-col space-y-8 md:space-y-12">
                 {messages.map((msg, idx) => (
                   <div key={idx} className={`w-full flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                     
                     {msg.role === 'user' ? (
                       <div className="max-w-[85%] bg-[--foreground] text-[--background] px-4 py-3 rounded-lg text-[14px] leading-[1.6] shadow-xl font-medium">
                         {msg.text}
                       </div>
                     ) : (
                       <div className="flex gap-4 w-full max-w-[90%]">
                         {/* Ícone Lateral AI */}
                         <div className="shrink-0 mt-0.5">
                            {msg.role === 'system' ? (
                              <div className="w-7 h-7 bg-[--surface-container] ghost-border rounded shadow-sm flex items-center justify-center">
                                <Loader2 className="w-3.5 h-3.5 text-[--on-surface-variant] animate-spin" />
                              </div>
                            ) : (
                              <div className="w-7 h-7 liquid-light rounded shadow-[0_0_12px_var(--primary-dim)] flex items-center justify-center">
                                <Sparkles className="w-3.5 h-3.5 text-[--on-primary]" />
                              </div>
                            )}
                         </div>
                         {/* Bloco de Texto AI */}
                         <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex items-center justify-between mb-1.5 h-7">
                               <span className="font-bold text-[12px] text-[--primary] display-font uppercase tracking-wider">
                                 {msg.role === 'system' ? 'Kernel_Processing' : 'Aura_System'}
                               </span>
                               {msg.module && (
                                 <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[--on-primary] bg-[--primary] px-2 py-0.5 rounded-sm transform translate-x-1 -translate-y-1 rotate-1">
                                   {msg.module}
                                 </span>
                               )}
                            </div>
                            <div className={`text-[15px] leading-[1.7] ${
                               msg.role === 'error' ? 'text-red-400 font-bold' : 
                               msg.role === 'system' ? 'text-[--on-surface-variant]' : 
                               'text-[--foreground]'
                            }`}>
                               {msg.text}
                            </div>
                         </div>
                       </div>
                     )}
                   </div>
                 ))}

                 {isLoading && (
                    <div className="w-full max-w-[90%] flex gap-4 animate-in fade-in">
                       <div className="shrink-0 mt-0.5">
                          <div className="w-7 h-7 bg-[#18181b] border border-[#27272a] rounded flex items-center justify-center">
                            <Bot className="w-3.5 h-3.5 text-[#71717a] animate-pulse" />
                          </div>
                       </div>
                       <div className="flex items-center h-7 px-2">
                          <div className="flex gap-1">
                             <div className="w-1.5 h-1.5 bg-[#52525b] rounded-full animate-pulse"></div>
                             <div className="w-1.5 h-1.5 bg-[#52525b] rounded-full animate-pulse delay-150"></div>
                             <div className="w-1.5 h-1.5 bg-[#52525b] rounded-full animate-pulse delay-300"></div>
                          </div>
                       </div>
                    </div>
                 )}
              </div>
            </div>
          ) : (

            /* -- INTERFACE DE TELEMETRIA (Dashboard Ultra Limpo) -- */
            <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col py-10 px-6 md:p-12 pb-32">
               
               <div className="mb-12 animate-in fade-in duration-500">
                  <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-1">Telemetria de Sistema</h2>
                  <p className="text-[14px] text-[#a1a1aa] max-w-xl">Métricas extraídas em tempo real da camada hipervisora. As alocações abaixo refletem o consumo dos especialistas RAG ativos.</p>
               </div>

               {/* Kpis / Métricas */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {[
                    { label: 'Índice de Base', value: dashboardData.totalKnowledge, desc: 'Setores alocados em memória RAG', icon: Database },
                    { label: 'Saúde Kernel', value: '100%', desc: 'Sem desvios detectados', icon: Shield },
                    { label: 'Escalonamento', value: 'Máximo', desc: 'Recursos disponíveis', icon: Zap },
                  ].map((s, i) => (
                    <div key={i} className="flex flex-col p-6 bg-[--surface-container-low] ghost-border rounded-xl hover:bg-[--surface-container] transition-all duration-300 group">
                       <div className="flex items-center gap-2 mb-4 text-[--on-surface-variant]">
                          <s.icon className="w-4 h-4 group-hover:text-[--primary] transition-colors" />
                          <span className="text-[11px] font-bold tracking-[0.1em] uppercase display-font">{s.label}</span>
                       </div>
                       <h3 className="text-4xl font-bold text-[--foreground] mb-2 display-font tracking-tighter">{s.value}</h3>
                       <p className="text-[13px] text-[--on-surface-variant] opacity-60">{s.desc}</p>
                    </div>
                  ))}
               </div>

               <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1f1f22]">
                     <h3 className="text-lg font-medium text-[#ededed]">Especialistas Parametrizados</h3>
                     <span className="text-[12px] text-[#71717a] font-mono">4 ACTIVE</span>
                  </div>
                  
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {((dashboardData.specialists && dashboardData.specialists.length > 0) ? dashboardData.specialists : [
                      { id: 'CODING', name: 'Engenharia de Base', icon: Zap, instruction: 'Otimização avançada, clean code e design patterns estruturais.' },
                      { id: 'FINANCE', name: 'Mercados & Dados', icon: DollarSign, instruction: 'Projeções e cálculos estratégicos aprofundados (SaaS/B2B).' },
                      { id: 'HEALTH', name: 'Análise Biológica', icon: Heart, instruction: 'Avaliação estrita da literatura científica e protocolos.' },
                      { id: 'PERSONAL', name: 'Fluxo Assistencial', icon: Settings2, instruction: 'Classificação de arquivos, geração de rotinas e pautas.' },
                    ]).map((s, i) => (
                       <div key={i} className="flex gap-4 p-6 bg-[--surface-container-low] rounded-xl hover:bg-[--surface-container-highest] transition-all duration-300 group cursor-pointer relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-[--primary] opacity-[0.02] -mr-16 -mt-16 rounded-full group-hover:opacity-[0.05] transition-opacity"></div>
                          <div className="w-12 h-12 rounded bg-[--surface-container-highest] ghost-border flex items-center justify-center text-[--primary] shrink-0 group-hover:liquid-light group-hover:text-[--on-primary] transition-all duration-500 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                            {(s.icon) ? <s.icon className="w-6 h-6"/> : <Bot className="w-6 h-6" />}
                          </div>
                          
                          <div className="flex flex-col w-full relative z-10">
                            <div className="flex items-center justify-between mb-2">
                               <h4 className="text-[15px] font-bold text-[--foreground] display-font uppercase tracking-tight">{s.name}</h4>
                               <span className="text-[9px] uppercase font-black tracking-widest text-[--on-surface-variant]">
                                 {s.id}
                               </span>
                            </div>
                            <p className="text-[13px] text-[--on-surface-variant] leading-[1.6] mb-4 opacity-80">
                               {s.instruction}
                            </p>
                            <div className="mt-auto pt-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                               <span className="text-[11px] font-black tracking-[0.15em] text-[--primary] uppercase flex items-center gap-2">
                                 Sintonizar_Módulo <span className="text-[14px]">&rarr;</span>
                               </span>
                            </div>
                          </div>
                       </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {/* INPUT BAR FIXA - (Linear Style Flat) */}
          {activeTab === 'chat' && (
            <div className="fixed bottom-0 left-0 md:left-[260px] right-0 glass-overlay border-t border-[--outline-variant] p-5 md:py-8">
              <div className="w-full max-w-3xl mx-auto flex flex-col relative px-1">
                
                <div className="bg-[--surface-container-highest] rounded-xl shadow-2xl focus-within:ghost-border transition-all flex items-end">
                  
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="p-3 mb-0.5 rounded-bl-xl text-[--on-surface-variant] hover:text-[--primary] hover:bg-[--surface-container] transition-colors shrink-0"
                  >
                    <Paperclip className="w-[18px] h-[18px]" />
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
                    placeholder={isLearning ? "Indexando base neural..." : "Aguardando comando..."}
                    className="flex-1 max-h-[200px] min-h-[44px] bg-transparent text-[--foreground] placeholder:text-[--on-surface-variant] placeholder:opacity-40 focus:outline-none resize-none py-[12px] px-2 text-[14px] leading-relaxed overflow-y-auto"
                    style={{ fieldSizing: 'content' }}
                  />
                  
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="m-2 shrink-0 liquid-light text-[--on-primary] rounded shadow-[0_0_15px_var(--primary-dim)] hover:brightness-110 disabled:bg-[--surface-container-highest] disabled:text-[--on-surface-variant] disabled:shadow-none transition-all w-[36px] h-[36px] flex items-center justify-center"
                  >
                    <Send className="w-[16px] h-[16px]" />
                  </button>
                </div>

                {isLearning && (
                  <div className="mt-3 kinetic-progress-track">
                    <div className="kinetic-progress-fill w-[45%]" />
                  </div>
                )}

                <div className="text-center mt-4 flex items-center justify-center gap-3">
                   <div className="w-1 h-1 bg-[--primary] rounded-full opacity-40"></div>
                   <p className="text-[10px] font-bold tracking-[0.2em] text-[--on-surface-variant] uppercase display-font">Core_Validation: Active_Neural_Check</p>
                   <div className="w-1 h-1 bg-[--primary] rounded-full opacity-40"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
