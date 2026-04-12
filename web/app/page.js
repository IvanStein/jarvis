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
    <div className="flex h-screen bg-[#212121] text-zinc-100 font-sans antialiased">
      
      {/* 1. SIDEBAR (Estilo ChatGPT) */}
      <aside className="hidden md:flex flex-col w-[260px] bg-[#171717] px-3 py-4 shrink-0">
        <div className="flex items-center gap-2 px-3 py-2 mb-6 cursor-pointer hover:bg-zinc-800/50 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <span className="font-semibold text-white tracking-wide">Jarvis / AURA</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors ${
              activeTab === 'chat' ? 'bg-zinc-800/80 text-white font-medium' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Terminal de IA
          </button>
          
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors ${
              activeTab === 'dashboard' ? 'bg-zinc-800/80 text-white font-medium' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Comando Central
          </button>
        </div>

        {/* User Profile Area Sidebar */}
        <div className="mt-auto pt-4 flex items-center gap-3 px-3 py-3 hover:bg-zinc-800/50 rounded-lg cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium text-white truncate">Admin (Ivan)</p>
            <p className="text-xs text-zinc-500 truncate">Sistemas Operacionais</p>
          </div>
        </div>
      </aside>

      {/* 2. ÁREA PRINCIPAL */}
      <main className="flex-1 min-w-0 flex flex-col relative h-full bg-[#212121]">
        
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-white/5 bg-[#212121]">
           <span className="font-medium text-zinc-200">Jarvis</span>
           <div className="flex gap-2">
             <button onClick={() => setActiveTab('chat')} className={`p-2 rounded-md ${activeTab === 'chat' ? 'text-white bg-white/10' : 'text-zinc-400'}`}><MessageSquare className="w-5 h-5"/></button>
             <button onClick={() => setActiveTab('dashboard')} className={`p-2 rounded-md ${activeTab === 'dashboard' ? 'text-white bg-white/10' : 'text-zinc-400'}`}><LayoutDashboard className="w-5 h-5"/></button>
           </div>
        </header>

        {/* Modelo Dropdown Simulação (Topo Esquerdo Desktop) */}
        {activeTab === 'chat' && (
          <div className="hidden md:flex items-center px-4 h-14 sticky top-0 z-10 bg-[#212121]/90 backdrop-blur-sm">
             <div className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-lg cursor-pointer text-zinc-300 font-medium">
               Aura IV <span className="text-zinc-500 text-xs">▼</span>
             </div>
          </div>
        )}

        {/* CONTEÚDO */}
        <div className="flex-1 overflow-y-auto px-4 w-full flex flex-col scroll-smooth">
          
          {activeTab === 'chat' ? (
            <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col py-6 md:py-8 space-y-8 pb-32">
              
              {/* Tela Inicial Sem Mensagens */}
              {messages.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center mt-20">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl">
                     <Sparkles className="w-8 h-8 text-black" />
                  </div>
                  <h2 className="text-2xl font-medium text-white mb-2">Como posso ajudar hoje?</h2>
                  <p className="text-zinc-400 max-w-sm">Eu sou Aura, o núcleo de inteligência de Jarvis. Posso processar código, planilhas, ou dados variados.</p>
                </div>
              )}

              {/* Feed de Mensagens Estilo Claude/ChatGPT */}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full animate-in fade-in duration-300`}>
                  
                  {msg.role === 'user' ? (
                    /* Bubble User: Rounded pill, gray backround */
                    <div className="max-w-[80%] bg-[#2f2f2f] text-zinc-100 px-5 py-3 rounded-3xl text-[16px] leading-relaxed">
                      {msg.text}
                    </div>
                  ) : (
                    /* Bubble AI: Flush left, plain text, icon on left */
                    <div className="w-full max-w-3xl flex gap-4">
                      
                      <div className="shrink-0 mt-1">
                        {msg.role === 'system' ? (
                           <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-[#171717]">
                             <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                           </div>
                        ) : (
                           <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
                             <Sparkles className="w-5 h-5 text-black" />
                           </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 mt-1.5 space-y-1">
                         {msg.module && (
                           <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
                             {msg.module}
                           </div>
                         )}
                         <div className={`text-[16px] leading-relaxed text-zinc-200 ${msg.role === 'error' ? 'text-red-400' : ''}`}>
                            {msg.text}
                         </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                 <div className="w-full max-w-3xl flex gap-4 animate-in fade-in">
                    <div className="shrink-0 mt-1">
                       <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
                         <Sparkles className="w-5 h-5 text-black animate-pulse" />
                       </div>
                    </div>
                    <div className="flex-1 min-w-0 mt-2.5 flex items-center gap-1.5">
                       <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></div>
                       <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                       <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                 </div>
              )}
            </div>
          ) : (
            /* Dashboard de IA - Visão de Painel de Controle */
            <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col py-10 pb-20">
               <h2 className="text-3xl font-semibold text-white mb-2">Comando Central</h2>
               <p className="text-zinc-400 mb-10">Métricas de inferência e capacidade computacional dos agentes conectados.</p>
               
               {/* Metrics Grid */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: 'Cérebro RAG', value: dashboardData.totalKnowledge, desc: 'Clusters de conhecimento isolados', icon: Database },
                    { label: 'Status da Rede', value: '100%', desc: 'Infraestrutura Otimizada', icon: Zap },
                    { label: 'Privilégio', value: 'Root', desc: 'Acesso sem restrições', icon: Settings2 },
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col p-6 bg-[#2f2f2f] rounded-2xl">
                      <div className="flex items-center justify-between mb-4 text-zinc-400">
                         <span className="text-sm font-medium">{stat.label}</span>
                         <stat.icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-3xl font-semibold text-white mt-auto">{stat.value}</h3>
                      <p className="text-xs text-zinc-500 mt-1">{stat.desc}</p>
                    </div>
                  ))}
               </div>

               <h3 className="text-lg font-medium text-white mb-4">Bibliotecas Especializadas</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {((dashboardData.specialists && dashboardData.specialists.length > 0) ? dashboardData.specialists : [
                    { id: 'CODING', name: 'Software Engineer', desc: 'Padrões avançados de arquitetura e debugging.' },
                    { id: 'FINANCE', name: 'Analista de Dados', desc: 'Projeções e integração direta com planilhas.' },
                    { id: 'HEALTH', name: 'Health Advisor', desc: 'Análise de protocolos e estudos científicos.' },
                    { id: 'PERSONAL', name: 'Assistente Executivo', desc: 'Automação de e-mails, atas e produtividade diária.' },
                  ]).map((s, i) => (
                     <div key={i} className="flex items-center gap-4 p-5 bg-[#2A2A2A] rounded-2xl hover:bg-[#333333] transition-colors cursor-pointer border border-[#3A3A3A]">
                        <div className="w-12 h-12 bg-[#212121] rounded-xl flex items-center justify-center shrink-0 border border-white/5">
                           <Bot className="w-6 h-6 text-zinc-300" />
                        </div>
                        <div className="flex-1">
                           <h4 className="text-[15px] font-medium text-white mb-0.5 flex items-center justify-between">
                             {s.name}
                             <span className="text-[10px] bg-[#171717] text-zinc-400 px-2 py-0.5 rounded uppercase font-bold tracking-wider">{s.id}</span>
                           </h4>
                           <p className="text-[13px] text-zinc-400 line-clamp-1">{s.desc || s.instruction}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          )}

          {/* INPUT BAR FLUTUANTE CENTRALIZADA (Estilo ChatGPT) */}
          {activeTab === 'chat' && (
            <div className="fixed bottom-0 left-0 md:left-[260px] right-0 bg-gradient-to-t from-[#212121] via-[#212121] to-transparent pt-8 pb-6 px-4">
              <div className="max-w-3xl mx-auto relative">
                {/* O Input Container Rounded */}
                <div className="bg-[#2f2f2f] rounded-[24px] rounded-br-[24px] pr-2 pl-4 py-2 flex items-end shadow-xl shadow-black/20 focus-within:bg-[#383838] transition-colors">
                  
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="p-2 mb-1 shrink-0 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
                    title="Anexar arquivos RAG"
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
                    placeholder="Mensagem para Jarvis..."
                    className="flex-1 max-h-32 min-h-[44px] bg-transparent text-white placeholder:text-zinc-500 focus:outline-none resize-none py-[10px] px-2 text-[16px] leading-relaxed overflow-y-auto"
                    style={{ fieldSizing: 'content' }}
                  />
                  
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="p-2.5 mb-1 shrink-0 bg-white text-black rounded-full hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-500 transition-colors ml-2"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
                
                <div className="text-center mt-2.5">
                   <p className="text-xs text-zinc-500">Jarvis pode cometer erros. Considere verificar as informações críticas antes de salvar.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
