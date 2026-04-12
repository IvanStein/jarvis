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
    <div className="flex flex-col h-screen bg-[#09090b] text-zinc-200 font-sans antialiased selection:bg-blue-500/30">
      
      {/* 1. HEADER EXIBIÇÃO FIXA NO TOPO */}
      <header className="flex-none flex items-center justify-between px-6 py-4 bg-[#09090b] border-b border-zinc-800/80 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700">
            <Sparkles className="w-4 h-4 text-blue-500" />
          </div>
          <h1 className="text-base font-semibold tracking-wide text-zinc-100 flex items-center gap-2">
            JARVIS <span className="text-zinc-600 font-normal">/</span> <span className="font-medium">AURA IV</span>
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="hidden sm:flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 shadow-inner">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-1.5 rounded-lg text-sm transition-all ${
              activeTab === 'chat' 
                ? 'bg-zinc-800 text-zinc-100 shadow font-medium' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            Terminal
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-1.5 rounded-lg text-sm transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-zinc-800 text-zinc-100 shadow font-medium' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            Dashboard
          </button>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
            Online
          </span>
        </div>
      </header>

      {/* Mobile Switcher (abaixo do header em telas pequenas) */}
      <div className="sm:hidden flex-none p-3 border-b border-zinc-800/80 bg-[#09090b]">
        <div className="flex bg-zinc-900 w-full p-1 rounded-lg border border-zinc-800">
           <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 text-xs rounded-md transition-all ${
              activeTab === 'chat' ? 'bg-zinc-800 text-zinc-100 font-medium shadow' : 'text-zinc-400'
            }`}
          > Chat </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-2 text-xs rounded-md transition-all ${
              activeTab === 'dashboard' ? 'bg-zinc-800 text-zinc-100 font-medium shadow' : 'text-zinc-400'
            }`}
          > Dashboard </button>
        </div>
      </div>

      {/* 2. ÁREA DE CONTEÚDO PRINCIPAL (OCUPA RESTO DA TELA) */}
      <main className="flex-1 min-h-0 relative flex flex-col bg-[#09090b]">
        
        {activeTab === 'chat' ? (
          <>
            {/* 2A. MENSAGENS NO CHAT (SCROLL) */}
            <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-10 scroll-smooth">
              <div className="max-w-3xl mx-auto space-y-8 pb-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in duration-300`}>
                    
                    {/* Avatar */}
                    <div className="shrink-0 mt-0.5">
                      {msg.role === 'user' ? (
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-900/20">
                          <User className="w-4 h-4" />
                        </div>
                      ) : msg.role === 'system' ? (
                         <div className="w-9 h-9 flex items-center justify-center">
                          <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-md">
                          <Bot className="w-5 h-5 text-blue-400" />
                        </div>
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className={`flex flex-col gap-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      {/* Name Plate */}
                      {msg.role !== 'system' && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-zinc-400">
                            {msg.role === 'user' ? 'Você' : 'AURA IV'}
                          </span>
                          {msg.module && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest text-[#09090b] bg-blue-400">
                              {msg.module}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Balão / Texto */}
                      <div className={`text-[15px] leading-relaxed ${
                        msg.role === 'user' ? 'bg-zinc-800 text-zinc-100 px-5 py-3 rounded-2xl rounded-tr-sm border border-zinc-700' : 
                        msg.role === 'error' ? 'bg-red-950/50 border border-red-900/50 text-red-300 px-5 py-3 rounded-2xl' :
                        msg.role === 'system' ? 'text-zinc-500 italic text-sm py-1' : 
                        'text-zinc-300 py-2' // IA tem fundo invisível para ler melhor
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading State */}
                {isLoading && (
                  <div className="flex gap-4 animate-in fade-in duration-300">
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-zinc-600 animate-pulse" />
                    </div>
                    <div className="flex flex-col justify-center gap-1.5">
                       <span className="text-xs font-semibold text-zinc-500">PROCESSANDO...</span>
                       <div className="flex items-center gap-1 mt-1">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2B. INPUT FIXO NO RODAPÉ DO CHAT */}
            <div className="flex-none p-4 md:px-8 border-t border-zinc-800 bg-[#09090b]">
              <div className="max-w-3xl mx-auto">
                <div className="relative flex items-center bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
                  
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="p-4 text-zinc-400 hover:text-zinc-100 transition-colors rounded-l-2xl"
                    title="Anexar Arquivo RAG"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileUpload} />
                  
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder={isLearning ? "Indexando base neural..." : "Envie instrução para Jarvis..."}
                    className="flex-1 py-4 px-1 bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none text-[15px] font-medium"
                  />
                  
                  <div className="p-2 pl-1">
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim() || isLoading}
                      className="p-2.5 bg-zinc-100 text-[#09090b] hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 rounded-xl transition-all font-semibold shadow-sm flex items-center justify-center"
                    >
                      <Send className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>
                </div>
                
                <div className="text-center mt-3">
                   <p className="text-[11px] text-zinc-500">AURA pode cometer erros ao interagir com múltiplas APIs. Verifique.</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          
          /* 3. DASHBOARD (SCROLL SEPARADO) */
          <div className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="max-w-5xl mx-auto space-y-10 pb-10">
              
              <div>
                 <h2 className="text-3xl font-semibold text-zinc-100 tracking-tight">Comando Central</h2>
                 <p className="text-zinc-400 mt-2">Visão geral do sistema e telemetria de agentes RAG.</p>
              </div>

              {/* Grid de Estatísticas Fixo e Seguro */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Cérebro Digital', value: dashboardData.totalKnowledge, desc: 'Fragmentos indexados', icon: Database, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                  { label: 'Status da Rede', value: '100%', desc: 'Sistemas operacionais', icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { label: 'Identidade', value: 'Admin', desc: 'Acesso Mestre', icon: Settings2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col p-6 bg-zinc-900 border border-zinc-800 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                       <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                         <stat.icon className={`w-5 h-5 ${stat.color}`} />
                       </div>
                       <span className="text-sm font-medium text-zinc-400">{stat.label}</span>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-4xl font-semibold text-zinc-100 tracking-tight">{stat.value}</h3>
                      <p className="text-sm text-zinc-500 mt-1">{stat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid de Especialistas */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                   <h2 className="text-lg font-medium text-zinc-200">Painel de Especialistas AURA</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {((dashboardData.specialists && dashboardData.specialists.length > 0) ? dashboardData.specialists : [
                    { id: 'CODING', name: 'Software Eng.', icon: Zap, instruction: 'Otimização de código e arquitetura avançada.' },
                    { id: 'FINANCE', name: 'Finance Agent', icon: DollarSign, instruction: 'Modelagem de dados e análise de mercado.' },
                    { id: 'HEALTH', name: 'Health Advisor', icon: Heart, instruction: 'Protocolos e revisão de literatura científica.' },
                    { id: 'PERSONAL', name: 'Productivity', icon: Shield, instruction: 'Otimização de agenda e automação.' },
                  ]).map((s, i) => (
                     <div key={i} className="flex flex-col p-6 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-zinc-700 transition-all">
                      <div className="flex items-center justify-between mb-5">
                        <div className="p-2.5 bg-zinc-800 rounded-xl text-zinc-300">
                          {(s.icon) ? <s.icon className="w-5 h-5"/> : <Bot className="w-5 h-5" />}
                        </div>
                        <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase bg-[#09090b] border border-zinc-800 px-2 py-1 rounded-md">
                          {s.id}
                        </span>
                      </div>
                      <h3 className="text-[17px] font-medium text-zinc-200 mb-2">{s.name}</h3>
                      <p className="text-[13px] text-zinc-500 leading-relaxed mb-6 flex-1">
                        {s.instruction}
                      </p>
                      <button className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-sm font-medium transition-colors">
                        Calibrar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
