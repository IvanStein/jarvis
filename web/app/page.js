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
    <div className="flex flex-col h-screen bg-[#050505] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Ambient Glows - NO PURPLE (Protocol Rule) */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Header - Sleek & Minimal */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="p-2 sm:p-2.5 bg-white/5 border border-white/10 rounded-xl group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-all duration-300">
            <Sparkles className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              JARVIS <span className="text-white/20 font-light text-2xl leading-none -mt-1">/</span> <span className="text-blue-400 font-medium">AURA IV</span>
            </h1>
          </div>
        </div>

        {/* Tab Switcher - Pill Design */}
        <nav className="hidden md:flex bg-white/5 p-1 rounded-full border border-white/10 shadow-inner">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-6 py-1.5 text-sm rounded-full transition-all duration-300 ${activeTab === 'chat' ? 'bg-white text-black shadow-md font-medium' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat</span>
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-6 py-1.5 text-sm rounded-full transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-white text-black shadow-md font-medium' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        </nav>

        <div className="flex items-center gap-2.5 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-[11px] font-medium text-emerald-400 tracking-wider">SYSTEM ONLINE</span>
        </div>
      </header>

      {/* Mobile Nav (if screen is small) */}
      <nav className="flex md:hidden bg-black/50 p-2 justify-center border-b border-white/5 z-40">
         <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-5 py-1.5 text-xs rounded-full transition-all duration-300 ${activeTab === 'chat' ? 'bg-white text-black shadow-md font-medium' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <MessageSquare className="w-3 h-3" />
            <span>Chat</span>
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-5 py-1.5 text-xs rounded-full transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-white text-black shadow-md font-medium' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <LayoutDashboard className="w-3 h-3" />
            <span>Dashboard</span>
          </button>
        </div>
      </nav>

      {activeTab === 'chat' ? (
        <>
          {/* Chat Container */}
          <main className="flex-1 overflow-y-auto px-4 py-8 md:p-12 space-y-12 scroll-smooth z-10 w-full max-w-4xl mx-auto">
            <div className="space-y-10 pb-10">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out fill-mode-both`} style={{animationDelay: `${idx * 50}ms`}}>
                  
                  {/* Avatar */}
                  <div className={`flex items-center items-start justify-center mt-1 w-9 h-9 rounded-full shrink-0 border ${
                    msg.role === 'user' ? 'bg-blue-600 border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.25)]' : 
                    msg.role === 'system' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-[#0a0a0a] border-white/10 shadow-lg'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : 
                     msg.role === 'system' ? <Loader2 className="w-4 h-4 animate-spin text-amber-500" /> :
                     <Bot className="w-5 h-5 text-slate-300" />}
                  </div>

                  {/* Message Content */}
                  <div className={`flex flex-col gap-1.5 max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    
                    {/* Meta/Username line */}
                    {msg.role !== 'user' && (
                       <div className="flex items-center gap-2 px-1">
                          <span className="text-[11px] font-semibold tracking-widest text-slate-500">
                            {msg.role === 'system' ? 'SYSTEM PROCESS' : 'AURA IV'}
                          </span>
                          {msg.module && (
                            <span className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[9px] font-bold tracking-widest text-blue-400">
                              {msg.module}
                            </span>
                          )}
                       </div>
                    )}

                    {/* Bubble / Text */}
                    <div className={`text-[15px] leading-relaxed ${
                      msg.role === 'user' ? 'bg-slate-800 text-slate-100 px-5 py-3.5 rounded-2xl rounded-tr-sm border border-slate-700 shadow-sm' : 
                      msg.role === 'error' ? 'text-red-400 bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20' :
                      msg.role === 'system' ? 'text-amber-400/80 italic text-sm' :
                      'text-slate-300 py-1' /* Flat text for professional look */
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-5 animate-in fade-in duration-500">
                  <div className="flex items-center justify-center mt-1 w-9 h-9 rounded-full bg-[#0a0a0a] border border-white/10 shrink-0">
                    <Bot className="w-4 h-4 text-slate-500 animate-pulse" />
                  </div>
                  <div className="flex flex-col gap-2">
                     <span className="text-[11px] font-semibold tracking-widest text-slate-500 px-1">AURA IV COMPUTING...</span>
                     <div className="flex items-center gap-1.5 py-2 px-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                     </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Floating Input Area */}
          <footer className="p-4 md:p-8 pt-0 z-50">
            <div className="max-w-3xl mx-auto relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-slate-500/30 rounded-3xl blur opacity-20 group-focus-within:opacity-50 transition duration-1000"></div>
              <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl">
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="pl-5 pr-3 py-4 text-slate-500 hover:text-blue-400 transition-colors"
                  title="Anexar Conhecimento (PDF)"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileUpload} />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={isLearning ? "Sincronizando arquivo no vetor de conhecimento..." : "Envie uma instrução ou mensagem..."}
                  className="flex-1 bg-transparent py-4 text-slate-200 placeholder:text-slate-600 text-sm md:text-base outline-none w-full"
                />
                <div className="pr-3 pl-2 py-3">
                   <button
                     onClick={sendMessage}
                     disabled={!input.trim() || isLoading}
                     className="p-2.5 bg-white text-black hover:bg-slate-200 disabled:opacity-20 disabled:hover:bg-white rounded-xl transition-all disabled:cursor-not-allowed"
                   >
                     <Send className="w-5 h-5" />
                   </button>
                </div>
              </div>
              <div className="text-center mt-4">
                 <p className="text-[10px] text-slate-600 font-medium tracking-widest uppercase">Jarvis Aura PODE COMETER ERROS. Verifique os dados fornecidos.</p>
              </div>
            </div>
          </footer>
        </>
      ) : (
        /* Dashboard Restyled */
        <main className="flex-1 overflow-y-auto p-6 md:p-12 z-10 w-full mx-auto max-w-7xl">
          <div className="space-y-12 pb-10">
            
            <div className="mb-8">
               <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-2">Comando <span className="font-bold text-blue-400">Central</span></h2>
               <p className="text-slate-400">Monitoramento e telemetria do sistema multiplataforma.</p>
            </div>

            {/* Minimalist Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Cérebro Digital', value: dashboardData.totalKnowledge, desc: 'Fragmentos RAG Indexados', icon: Database, color: 'blue' },
                { label: 'Estado do Sistema', value: '100%', desc: 'Eficiência Operacional', icon: Zap, color: 'emerald' },
                { label: 'Nível de Acesso', value: 'ALPHA', desc: 'Identificação: Ivan Stein', icon: Settings2, color: 'slate' },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col p-8 bg-[#0a0a0a] border border-white/5 rounded-[2rem] hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-8">
                     <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">{stat.label}</span>
                     <div className={`p-2.5 rounded-xl bg-white/5`}>
                       <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                     </div>
                  </div>
                  <h3 className="text-5xl font-light text-slate-100 tracking-tight">{stat.value}</h3>
                  <p className="text-sm text-slate-500 mt-3">{stat.desc}</p>
                </div>
              ))}
            </div>

            {/* Specialist Grid */}
            <div className="pt-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                   <h2 className="text-2xl font-light text-slate-200">Módulos Especialistas</h2>
                   <p className="text-sm text-slate-500 mt-1">Sistemas de domínio específico integrados a rede AURA.</p>
                </div>
                <button className="text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2 rounded-lg transition-colors w-fit">VER TODOS OS MÓDULOS</button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(dashboardData.specialists && dashboardData.specialists.length > 0) ? dashboardData.specialists.map((s, i) => (
                  <div key={i} className="flex flex-col p-6 lg:p-8 bg-[#0a0a0a] border border-white/5 rounded-[2rem] hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 rounded-xl bg-white/5 text-slate-300 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                        {s.id === 'CODING' && <Zap className="w-6 h-6"/>}
                        {s.id === 'FINANCE' && <DollarSign className="w-6 h-6" />}
                        {s.id === 'HEALTH' && <Heart className="w-6 h-6" />}
                        {s.id === 'PERSONAL' && <Shield className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-slate-200 leading-tight">{s.name}</h3>
                        <p className="text-[10px] tracking-widest text-slate-500 font-bold mt-1">{s.id}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-8 flex-1">
                      {s.instruction}
                    </p>
                    <button className="w-full py-3 rounded-xl border border-white/10 text-[11px] font-bold tracking-widest text-slate-300 hover:bg-white hover:text-black transition-all">
                      CALIBRAR PARÂMETROS
                    </button>
                  </div>
                )) : (
                  // Fallbacks se não tiver fetch ou carregar a api vazia
                  [
                    { id: 'CODING', name: 'Engenheiro de Software', icon: Zap },
                    { id: 'FINANCE', name: 'Analista Financeiro', icon: DollarSign },
                    { id: 'HEALTH', name: 'Consultor de Saúde', icon: Heart },
                    { id: 'PERSONAL', name: 'Assistente Pessoal', icon: Shield },
                  ].map((s, i) => (
                   <div key={i} className="flex flex-col p-6 lg:p-8 bg-[#0a0a0a] border border-white/5 rounded-[2rem] hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 rounded-xl bg-white/5 text-slate-300 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                        <s.icon className="w-6 h-6"/>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-slate-200 leading-tight">{s.name}</h3>
                        <p className="text-[10px] tracking-widest text-slate-500 font-bold mt-1">{s.id}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-8 flex-1">
                      Sistema especialista aguardando conexão remota e inicialização.
                    </p>
                    <button className="w-full py-3 rounded-xl border border-white/10 text-[11px] font-bold tracking-widest text-slate-300 hover:bg-white hover:text-black transition-all">
                      SINTONIZAR MÓDULO
                    </button>
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
