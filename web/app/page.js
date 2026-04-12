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
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#09090b] text-[#ededed] font-sans overflow-hidden antialiased selection:bg-zinc-800 selection:text-white">
      
      {/* --- SIDEBAR NAIL-PERFECT (Estilo Desktop Profissional) --- */}
      <aside className="hidden md:flex flex-col w-[260px] bg-[#09090b] border-r border-[#1f1f22] pt-4 pb-4 px-3 shrink-0 relative z-20">
        
        {/* Logo / Header da Sidebar */}
        <div className="flex items-center gap-3 px-3 py-2 mb-8 mt-2 group cursor-pointer">
          <div className="w-6 h-6 rounded-md bg-[#ffffff] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <Sparkles className="w-3.5 h-3.5 text-[#000000]" />
          </div>
          <span className="font-medium text-[14px] text-[#ededed] tracking-tight">Jarvis Workspace</span>
        </div>

        {/* Navegação */}
        <div className="flex-1 space-y-1">
          <div className="px-3 text-[11px] font-medium text-[#71717a] mb-2 uppercase tracking-wider">AURA OS</div>
          
          <button 
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] transition-all duration-200 ${
              activeTab === 'chat' 
                ? 'bg-[#27272a] text-[#ffffff] font-medium border border-[#3f3f46]' 
                : 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#ededed] border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-[14px] h-[14px]" />
              Terminal de IA
            </div>
            {activeTab === 'chat' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
          </button>
          
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] transition-all duration-200 ${
              activeTab === 'dashboard' 
                ? 'bg-[#27272a] text-[#ffffff] font-medium border border-[#3f3f46]' 
                : 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#ededed] border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-[14px] h-[14px]" />
              Monitor Neural
            </div>
            {activeTab === 'dashboard' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
          </button>
        </div>

        {/* Rodapé Sidebar */}
        <div className="pt-4 border-t border-[#1f1f22]">
          <div className="flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-[#18181b] rounded-md transition-colors">
            <div className="w-7 h-7 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5 text-[#a1a1aa]" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[13px] font-medium text-[#ededed] truncate">Admin Root</span>
              <span className="text-[11px] text-[#71717a] truncate">ivan@jarvis.local</span>
            </div>
          </div>
        </div>
      </aside>

      {/* --- ÁREA PRINCIPAL (MAIN) --- */}
      <main className="flex-1 min-w-0 flex flex-col h-full bg-[#09090b] relative">
        
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between px-5 h-14 border-b border-[#1f1f22] bg-[#09090b]/90 backdrop-blur-md sticky top-0 z-40">
           <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                 <Sparkles className="w-3 h-3 text-black" />
              </div>
              <span className="font-medium text-[13px]">Jarvis</span>
           </div>
           <div className="flex gap-1.5">
             <button onClick={() => setActiveTab('chat')} className={`p-1.5 rounded-md ${activeTab === 'chat' ? 'bg-[#27272a] text-white' : 'text-[#71717a]'}`}><MessageSquare className="w-[15px] h-[15px]"/></button>
             <button onClick={() => setActiveTab('dashboard')} className={`p-1.5 rounded-md ${activeTab === 'dashboard' ? 'bg-[#27272a] text-white' : 'text-[#71717a]'}`}><LayoutDashboard className="w-[15px] h-[15px]"/></button>
           </div>
        </div>

        {/* Header Sutil (Desktop) */}
        <div className="hidden md:flex h-14 w-full items-center justify-between px-8 border-b border-[#1f1f22] bg-[#09090b] select-none">
           <div className="flex items-center gap-2 text-[13px] font-medium text-[#a1a1aa]">
              Aura Framework <span className="text-[#3f3f46]">/</span> <span className="text-[#ededed]">{activeTab === 'chat' ? 'Terminal' : 'Monitor'}</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-[#18181b] border border-[#27272a] px-3 py-1 rounded-full">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                 <span className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-widest">Conectado</span>
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
                    <div className="w-12 h-12 bg-[#18181b] border border-[#27272a] rounded-xl flex items-center justify-center mb-6 shadow-sm">
                       <Bot className="w-5 h-5 text-[#ededed]" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-medium tracking-tight text-[#ededed] mb-3">Modelos Inicializados.</h2>
                    <p className="text-[14px] text-[#71717a] leading-relaxed">
                      AURA IV está escutando na porta principal. Injete relatórios, códigos-fonte ou acione módulos de telemetria diretamente via prompt.
                    </p>
                 </div>
              )}

              {/* Trama de Mensagens (Estilo Linear Comments) */}
              <div className="flex flex-col space-y-8 md:space-y-12">
                 {messages.map((msg, idx) => (
                   <div key={idx} className={`w-full flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                     
                     {msg.role === 'user' ? (
                       <div className="max-w-[85%] bg-[#ededed] text-[#09090b] px-4 py-2.5 rounded-lg text-[14px] leading-[1.6] shadow-sm font-medium">
                         {msg.text}
                       </div>
                     ) : (
                       <div className="flex gap-4 w-full max-w-[90%]">
                         {/* Ícone Lateral AI */}
                         <div className="shrink-0 mt-0.5">
                            {msg.role === 'system' ? (
                              <div className="w-7 h-7 bg-[#18181b] border border-[#27272a] rounded shadow-sm flex items-center justify-center">
                                <Loader2 className="w-3.5 h-3.5 text-[#71717a] animate-spin" />
                              </div>
                            ) : (
                              <div className="w-7 h-7 bg-[#ffffff] rounded shadow-sm flex items-center justify-center">
                                <Sparkles className="w-3.5 h-3.5 text-[#000000]" />
                              </div>
                            )}
                         </div>
                         {/* Bloco de Texto AI */}
                         <div className="flex-1 min-w-0 pt-0.5">
                            {(msg.module || msg.role !== 'system') && (
                               <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-[13px] text-[#ededed]">
                                    {msg.role === 'system' ? 'Aura (Processamento)' : 'Aura'}
                                  </span>
                                  {msg.module && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717a] bg-[#18181b] border border-[#27272a] px-1.5 py-0.5 rounded">
                                      {msg.module}
                                    </span>
                                  )}
                               </div>
                            )}
                            <div className={`text-[14px] md:text-[15px] leading-relaxed ${
                               msg.role === 'error' ? 'text-red-400 font-medium' : 
                               msg.role === 'system' ? 'text-[#71717a]' : 
                               'text-[#d4d4d8] font-light'
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
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-14 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {[
                    { label: 'Índice de Base', value: dashboardData.totalKnowledge, desc: 'Setores alocados em memória RAG', icon: Database },
                    { label: 'Saúde Kernel', value: '100%', desc: 'Sem desvios detectados', icon: Shield },
                    { label: 'Escalonamento', value: 'Máximo', desc: 'Recursos disponíveis', icon: Zap },
                  ].map((s, i) => (
                    <div key={i} className="flex flex-col p-5 bg-[#09090b] border border-[#27272a] rounded-xl hover:border-[#3f3f46] transition-colors relative">
                       <div className="flex items-center gap-2 mb-3 text-[#71717a]">
                          <s.icon className="w-4 h-4" />
                          <span className="text-[12px] font-medium tracking-wide uppercase">{s.label}</span>
                       </div>
                       <h3 className="text-3xl font-semibold text-[#ededed] mb-1">{s.value}</h3>
                       <p className="text-[13px] text-[#71717a]">{s.desc}</p>
                    </div>
                  ))}
               </div>

               <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1f1f22]">
                     <h3 className="text-lg font-medium text-[#ededed]">Especialistas Parametrizados</h3>
                     <span className="text-[12px] text-[#71717a] font-mono">4 ACTIVE</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {((dashboardData.specialists && dashboardData.specialists.length > 0) ? dashboardData.specialists : [
                      { id: 'CODING', name: 'Engenharia de Base', icon: Zap, instruction: 'Otimização avançada, clean code e design patterns estruturais.' },
                      { id: 'FINANCE', name: 'Mercados & Dados', icon: DollarSign, instruction: 'Projeções e cálculos estratégicos aprofundados (SaaS/B2B).' },
                      { id: 'HEALTH', name: 'Análise Biológica', icon: Heart, instruction: 'Avaliação estrita da literatura científica e protocolos.' },
                      { id: 'PERSONAL', name: 'Fluxo Assistencial', icon: Settings2, instruction: 'Classificação de arquivos, geração de rotinas e pautas.' },
                    ]).map((s, i) => (
                       <div key={i} className="flex gap-4 p-5 bg-[#09090b] border border-[#27272a] rounded-xl hover:bg-[#18181b] transition-all group cursor-pointer">
                          <div className="w-10 h-10 mt-1 rounded bg-[#ffffff] flex items-center justify-center text-[#09090b] shrink-0">
                            {(s.icon) ? <s.icon className="w-5 h-5"/> : <Bot className="w-5 h-5" />}
                          </div>
                          
                          <div className="flex flex-col w-full">
                            <div className="flex items-center justify-between mb-1 text-white">
                               <h4 className="text-[14px] font-semibold text-[#ededed]">{s.name}</h4>
                               <span className="text-[10px] uppercase font-bold tracking-widest text-[#71717a]">
                                 {s.id}
                               </span>
                            </div>
                            <p className="text-[13px] text-[#a1a1aa] leading-relaxed mb-3">
                               {s.instruction}
                            </p>
                            <div className="mt-auto pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <span className="text-[12px] font-medium text-blue-500 hover:text-blue-400 flex items-center gap-1">
                                 Sintonizar Módulo &rarr;
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
            <div className="fixed bottom-0 left-0 md:left-[260px] right-0 bg-[#09090b]/80 backdrop-blur-xl border-t border-[#1f1f22] p-4 md:py-6">
              <div className="w-full max-w-3xl mx-auto flex flex-col relative px-1">
                
                <div className="bg-[#18181b] border border-[#27272a] rounded-xl shadow-sm focus-within:border-[#3f3f46] focus-within:ring-1 focus-within:ring-[#3f3f46] transition-all flex items-end">
                  
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="p-3 mb-0.5 rounded-bl-xl text-[#71717a] hover:text-[#ededed] hover:bg-[#27272a] transition-colors shrink-0"
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
                    placeholder={isLearning ? "Indexando base neural..." : "Pressione Enter para enviar..."}
                    className="flex-1 max-h-[200px] min-h-[44px] bg-transparent text-[#ededed] placeholder:text-[#52525b] focus:outline-none resize-none py-[12px] px-2 text-[14px] leading-relaxed overflow-y-auto"
                    style={{ fieldSizing: 'content' }}
                  />
                  
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="m-2 shrink-0 bg-[#ededed] text-[#09090b] rounded shadow-sm hover:bg-white disabled:bg-[#27272a] disabled:text-[#52525b] transition-colors w-[32px] h-[32px] flex items-center justify-center"
                  >
                    <Send className="w-[14px] h-[14px]" />
                  </button>
                </div>

                <div className="text-center mt-2 flex items-center justify-center gap-2">
                   <div className="w-1.5 h-1.5 bg-[#27272a] rounded-full"></div>
                   <p className="text-[11px] font-medium tracking-wide text-[#71717a] uppercase">Sistema IA Sujeito a alucinações. Valide os códigos entregues.</p>
                   <div className="w-1.5 h-1.5 bg-[#27272a] rounded-full"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
