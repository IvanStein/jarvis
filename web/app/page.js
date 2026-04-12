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
    <div className="flex flex-col h-screen bg-[#000000] text-zinc-300 font-sans antialiased selection:bg-zinc-800 selection:text-white">
      
      {/* Top Navigation - Ultra minimal */}
      <header className="flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-sm border-b border-white/5 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-semibold text-white tracking-wide text-sm">JARVIS <span className="text-zinc-600 font-light mx-1">/</span> AURA</span >
        </div>

        <div className="hidden md:flex bg-zinc-900/40 p-1 rounded-lg border border-white/5">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'chat' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'}`}
          >
            Chat
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'}`}
          >
            Dashboard
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-zinc-900/50 transition cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Online</span>
        </div>
      </header>

      {/* Mobile Nav */}
      <nav className="flex md:hidden bg-black p-2 justify-center border-b border-white/5 z-40">
         <div className="flex bg-zinc-900/40 p-1 rounded-lg w-full max-w-sm border border-white/5">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 text-center py-2 text-xs rounded-md transition-all ${activeTab === 'chat' ? 'bg-zinc-800 text-white font-medium shadow-sm' : 'text-zinc-500'}`}
          >
            Chat
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 text-center py-2 text-xs rounded-md transition-all ${activeTab === 'dashboard' ? 'bg-zinc-800 text-white font-medium shadow-sm' : 'text-zinc-500'}`}
          >
            Dashboard
          </button>
        </div>
      </nav>

      {activeTab === 'chat' ? (
        <>
          {/* Chat Feed */}
          <main className="flex-1 overflow-y-auto w-full relative z-10 scroll-smooth">
            <div className="max-w-3xl mx-auto px-4 py-10 space-y-12 pb-36">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-5 animate-in fade-in duration-300`} style={{animationDelay: `${idx * 20}ms`}}>
                  
                  {/* Avatar */}
                  <div className="shrink-0 mt-0.5">
                    {msg.role === 'user' ? (
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
                        <User className="w-4 h-4 text-zinc-300" />
                      </div>
                    ) : msg.role === 'system' ? (
                      <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center">
                        <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <Bot className="w-5 h-5 text-black" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-1.5">
                    {/* Header */}
                    {msg.role !== 'system' && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[13px] text-white">
                          {msg.role === 'user' ? 'Você' : 'AURA IV'}
                        </span>
                        {msg.module && (
                          <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-sm">
                            {msg.module}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Text block - flat text, no bubbles! */}
                    <div className={`text-[15px] leading-relaxed ${
                      msg.role === 'system' ? 'text-zinc-500 italic text-sm' : 
                      msg.role === 'error' ? 'text-red-400' : 'text-zinc-300'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-5 animate-in fade-in duration-300">
                  <div className="shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-white/5">
                      <Bot className="w-4 h-4 text-zinc-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-1.5 py-1">
                     <span className="font-semibold text-[13px] text-zinc-500">AURA IV</span>
                     <div className="flex items-center gap-1.5 pt-1">
                        <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse" style={{animationDelay: '0ms'}}></div>
                        <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse" style={{animationDelay: '150ms'}}></div>
                        <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
                     </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Chat Input Floating Anchor */}
          <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-[#000] via-[#000]/80 to-transparent pt-12 pb-6 px-4 pointer-events-none z-40">
            <div className="max-w-3xl mx-auto pointer-events-auto">
              <div className="relative flex items-center bg-[#09090b] border border-zinc-800 rounded-2xl shadow-2xl focus-within:ring-1 focus-within:ring-zinc-600 focus-within:border-zinc-700 transition-all">
                
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="pl-5 pr-2 text-zinc-500 hover:text-white transition-colors py-4"
                  title="Anexar arquivo (PDF)"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileUpload} />
                
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={isLearning ? "Indexando conhecimento..." : "Mensagem para AURA..."}
                  className="flex-1 py-4 px-2 text-[15px] bg-transparent text-white placeholder:text-zinc-500 focus:outline-none"
                />
                
                <div className="pr-2 pl-1">
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="p-2.5 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-900 border border-transparent disabled:border-zinc-800 disabled:text-zinc-600 rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </div>
              <div className="text-center mt-3">
                 <p className="text-[11px] text-zinc-500">Jarvis pode cometer erros ao interagir com módulos complexos. Cheque criticamente.</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Dashboard Container - Linear Style */
        <main className="flex-1 overflow-y-auto w-full z-10 bg-black">
          <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
            
            <div className="space-y-1">
               <h2 className="text-2xl font-semibold tracking-tight text-white">Comando Central</h2>
               <p className="text-sm text-zinc-400">Gerenciamento e telemetria da arquitetura de inteligência.</p>
            </div>

            {/* Linear-style Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Fragmentos de RAG', value: dashboardData.totalKnowledge, desc: 'Base de conhecimento ativa', icon: Database },
                { label: 'Saúde do Sistema', value: 'Operacional', desc: 'Sistemas distribuídos online', icon: Zap },
                { label: 'Nível de Acesso', value: 'Admin (Ivan)', desc: 'Controle irrestrito', icon: Settings2 },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col p-5 bg-[#0a0a0a] border border-white/5 rounded-2xl hover:bg-zinc-900/50 transition-colors">
                  <div className="flex justify-between items-start mb-6">
                     <span className="text-sm font-medium text-zinc-400">{stat.label}</span>
                     <stat.icon className="w-4 h-4 text-zinc-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white tracking-tight">{stat.value}</h3>
                  <p className="text-[13px] text-zinc-500 mt-1">{stat.desc}</p>
                </div>
              ))}
            </div>

            {/* Specialist Row */}
            <div className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div className="space-y-1">
                   <h2 className="text-lg font-medium text-white">Agentes Especialistas</h2>
                   <p className="text-[13px] text-zinc-500">Módulos treinados para missões específicas via API.</p>
                </div>
                <button className="text-[13px] font-medium text-zinc-300 hover:text-white bg-zinc-900 border border-white/5 hover:bg-zinc-800 px-4 py-1.5 rounded-md transition-colors w-fit">
                  Gerenciar Módulos
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(dashboardData.specialists && dashboardData.specialists.length > 0) ? dashboardData.specialists.map((s, i) => (
                   <div key={i} className="flex items-start gap-4 p-5 bg-[#0a0a0a] border border-white/5 rounded-2xl hover:border-zinc-700 transition-all group">
                    <div className="p-2.5 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400 group-hover:text-white group-hover:bg-zinc-800 transition-colors shrink-0">
                      {s.id === 'CODING' && <Zap className="w-5 h-5"/>}
                      {s.id === 'FINANCE' && <DollarSign className="w-5 h-5" />}
                      {s.id === 'HEALTH' && <Heart className="w-5 h-5" />}
                      {s.id === 'PERSONAL' && <Shield className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-[15px] font-medium text-zinc-200">{s.name}</h3>
                        <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase bg-zinc-900 px-2 py-0.5 rounded">{s.id}</span>
                      </div>
                      <p className="text-[13px] text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {s.instruction}
                      </p>
                    </div>
                  </div>
                )) : (
                  [
                    { id: 'CODING', name: 'Software Engineer', icon: Zap },
                    { id: 'FINANCE', name: 'Financial Analyst', icon: DollarSign },
                    { id: 'HEALTH', name: 'Health Advisor', icon: Heart },
                    { id: 'PERSONAL', name: 'Personal Assistant', icon: Shield },
                  ].map((s, i) => (
                   <div key={i} className="flex items-start gap-4 p-5 bg-[#0a0a0a] border border-white/5 rounded-2xl hover:border-zinc-700 transition-all group">
                    <div className="p-2.5 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400 group-hover:text-white group-hover:bg-zinc-800 transition-colors shrink-0">
                      <s.icon className="w-5 h-5"/>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-[15px] font-medium text-zinc-200">{s.name}</h3>
                        <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase bg-zinc-900 px-2 py-0.5 rounded">{s.id}</span>
                      </div>
                      <p className="text-[13px] text-zinc-500 mt-1.5 leading-relaxed">
                        Aguardando sincronização com a rede neural (gemini-2.0).
                      </p>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>
            
          </div>
        </main>
      )}
    </div>
  );
}
