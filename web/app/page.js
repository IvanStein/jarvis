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
    <div className="flex flex-col h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-blue-500/30">
      {/* Ambient Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-400/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Header - Larger, sleeker */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl group-hover:bg-blue-900/20 group-hover:border-blue-500/30 transition-all duration-300">
            <Sparkles className="w-6 h-6 text-blue-500 group-hover:text-blue-400 shadow-blue-500/50 drop-shadow-lg" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-3">
              JARVIS <span className="text-zinc-600 font-light text-3xl leading-none -mt-1">/</span> <span className="text-blue-500 font-medium">AURA IV</span>
            </h1>
          </div>
        </div>

        {/* Tab Switcher - More prominent */}
        <nav className="hidden md:flex bg-zinc-900 p-1.5 rounded-full border border-zinc-800 shadow-inner">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2.5 px-8 py-2.5 text-sm rounded-full transition-all duration-300 ${activeTab === 'chat' ? 'bg-zinc-100 text-zinc-950 shadow-lg font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Terminal</span>
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2.5 px-8 py-2.5 text-sm rounded-full transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-zinc-100 text-zinc-950 shadow-lg font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Inteligência</span>
          </button>
        </nav>

        <div className="flex items-center gap-3 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-inner">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
            </div>
            <span className="text-xs font-semibold text-emerald-400 tracking-widest">ONLINE</span>
        </div>
      </header>

      {/* Mobile Nav */}
      <nav className="flex md:hidden bg-zinc-900/50 p-3 justify-center border-b border-zinc-800 z-40">
         <div className="flex bg-zinc-950 p-1.5 rounded-full border border-zinc-800 w-full max-w-sm">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 flex justify-center items-center gap-2 px-4 py-3 text-sm rounded-full transition-all duration-300 ${activeTab === 'chat' ? 'bg-zinc-100 text-zinc-950 shadow-md font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat</span>
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 flex justify-center items-center gap-2 px-4 py-3 text-sm rounded-full transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-zinc-100 text-zinc-950 shadow-md font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Painel</span>
          </button>
        </div>
      </nav>

      {activeTab === 'chat' ? (
        <>
          {/* Chat Container */}
          <main className="flex-1 overflow-y-auto px-4 py-8 md:p-12 space-y-12 scroll-smooth z-10 w-full max-w-5xl mx-auto">
            <div className="space-y-12 pb-20">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both`} style={{animationDelay: `${idx * 50}ms`}}>
                  
                  {/* Avatar */}
                  <div className={`flex flex-col items-center gap-2 shrink-0 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-center justify-center w-12 h-12 rounded-2xl border-2 shadow-xl ${
                      msg.role === 'user' ? 'bg-blue-600 border-blue-500 shadow-blue-900/20' : 
                      msg.role === 'system' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-zinc-900 border-zinc-700'
                    }`}>
                      {msg.role === 'user' ? <User className="w-6 h-6 text-white" /> : 
                       msg.role === 'system' ? <Loader2 className="w-6 h-6 animate-spin text-amber-500" /> :
                       <Bot className="w-6 h-6 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className={`flex flex-col gap-2 max-w-[85%] sm:max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    
                    {/* Username/Module line */}
                    {msg.role !== 'user' && (
                       <div className="flex items-center gap-3 px-1 mt-1">
                          <span className="text-xs font-bold tracking-widest text-zinc-400">
                            {msg.role === 'system' ? 'SYSTEM PROCESS' : 'AURA IV'}
                          </span>
                          {msg.module && (
                            <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded shadow-sm text-[10px] uppercase font-bold tracking-widest text-blue-400">
                              {msg.module}
                            </span>
                          )}
                       </div>
                    )}

                    {/* Bubble / Text */}
                    <div className={`text-[17px] leading-relaxed tracking-normal ${
                      msg.role === 'user' ? 'bg-blue-600/10 border border-blue-500/20 text-blue-50 px-6 py-4 rounded-3xl rounded-tr-sm shadow-inner' : 
                      msg.role === 'error' ? 'text-red-400 bg-red-950/30 px-6 py-4 rounded-3xl border border-red-900/50' :
                      msg.role === 'system' ? 'text-amber-400/80 italic text-sm py-2' :
                      'text-zinc-200 py-3 lg:pr-10' // Clearer reading space for AI
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-6 animate-in fade-in duration-500">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-900 border-2 border-zinc-800 shrink-0">
                    <Bot className="w-6 h-6 text-zinc-500 animate-pulse" />
                  </div>
                  <div className="flex flex-col justify-center gap-3">
                     <span className="text-[11px] font-bold tracking-widest text-zinc-500 px-1 uppercase">AURA IV COMPUTING...</span>
                     <div className="flex items-center gap-2 px-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce shadow-[0_0_8px_#3b82f6]" style={{animationDelay: '0ms'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce shadow-[0_0_8px_#3b82f6]" style={{animationDelay: '150ms'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce shadow-[0_0_8px_#3b82f6]" style={{animationDelay: '300ms'}}></div>
                     </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Floating Input Area */}
          <footer className="p-4 md:p-8 pt-0 z-50">
            <div className="max-w-4xl mx-auto relative group">
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-transparent to-blue-600/20 rounded-[2rem] blur-xl opacity-50 group-focus-within:opacity-100 transition duration-700"></div>
              
              <div className="relative flex items-center bg-zinc-900/80 backdrop-blur-2xl border border-zinc-700/50 rounded-[2rem] shadow-2xl p-2 transition-colors group-focus-within:border-blue-500/50 group-focus-within:bg-zinc-900">
                
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="p-4 text-zinc-400 hover:text-blue-400 hover:bg-white/5 rounded-xl transition-all"
                  title="Anexar Conhecimento (PDF)"
                >
                  <Paperclip className="w-6 h-6" />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileUpload} />
                
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={isLearning ? "Sincronizando arquivo no vetor de conhecimento..." : "Envie uma instrução ou mensagem..."}
                  className="flex-1 bg-transparent py-4 px-2 text-zinc-100 placeholder:text-zinc-500 text-base md:text-lg outline-none w-full font-medium"
                />
                
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="p-4 m-1 bg-blue-600 text-white hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-2xl transition-all disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] disabled:shadow-none"
                >
                  <Send className="w-5 h-5 -ml-1 mt-1 md:m-0" />
                </button>
              </div>
              <div className="text-center mt-6">
                 <p className="text-xs text-zinc-600 font-medium tracking-widest uppercase">JARVIS AURA PODE COMETER ERROS. VERIFIQUE INFORMAÇÕES CRÍTICAS.</p>
              </div>
            </div>
          </footer>
        </>
      ) : (
        <main className="flex-1 overflow-y-auto p-6 md:p-12 z-10 w-full mx-auto max-w-7xl">
          <div className="space-y-12 pb-10">
            
            <div className="mb-10">
               <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-3">Comando <span className="font-bold text-blue-500">Central</span></h2>
               <p className="text-zinc-500 text-lg">Monitoramento e telemetria do sistema multiplataforma.</p>
            </div>

            {/* Premium Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Cérebro Digital', value: dashboardData.totalKnowledge, desc: 'Fragmentos RAG Indexados', icon: Database, color: 'blue' },
                { label: 'Estado do Sistema', value: '100%', desc: 'Eficiência Operacional', icon: Zap, color: 'emerald' },
                { label: 'Nível de Acesso', value: 'ALPHA', desc: 'Identificação: Ivan Stein', icon: Settings2, color: 'zinc' },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col p-8 md:p-10 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] hover:border-zinc-700 hover:bg-zinc-800/50 transition-all shadow-xl">
                  <div className="flex justify-between items-start mb-8">
                     <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">{stat.label}</span>
                     <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 border border-${stat.color}-500/20`}>
                       <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                     </div>
                  </div>
                  <h3 className="text-6xl font-light text-white tracking-tight">{stat.value}</h3>
                  <p className="text-base text-zinc-500 mt-4 font-medium">{stat.desc}</p>
                </div>
              ))}
            </div>

            {/* Specialist Grid */}
            <div className="pt-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <div>
                   <h2 className="text-3xl font-medium text-zinc-200">Módulos Especialistas</h2>
                   <p className="text-base text-zinc-500 mt-2">Sistemas de domínio específico integrados a rede AURA.</p>
                </div>
                <button className="text-sm font-bold tracking-widest text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-600 px-6 py-3 rounded-xl transition-all w-fit">VER TODOS</button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {(dashboardData.specialists && dashboardData.specialists.length > 0) ? dashboardData.specialists.map((s, i) => (
                   <div key={i} className="flex flex-col p-8 bg-zinc-900 border border-zinc-800 rounded-[2rem] hover:border-blue-500/50 hover:bg-zinc-800/80 transition-all shadow-xl group duration-300 hover:-translate-y-2">
                    <div className="flex items-center gap-5 mb-8">
                      <div className="p-4 rounded-2xl bg-zinc-800 text-zinc-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                        {s.id === 'CODING' && <Zap className="w-7 h-7"/>}
                        {s.id === 'FINANCE' && <DollarSign className="w-7 h-7" />}
                        {s.id === 'HEALTH' && <Heart className="w-7 h-7" />}
                        {s.id === 'PERSONAL' && <Shield className="w-7 h-7" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-zinc-200 leading-tight">{s.name}</h3>
                        <p className="text-xs tracking-widest text-zinc-500 font-bold mt-2">{s.id}</p>
                      </div>
                    </div>
                    <p className="text-base text-zinc-400 leading-relaxed max-h-24 overflow-hidden mb-10 flex-1">
                      {s.instruction}
                    </p>
                    <button className="w-full py-4 rounded-xl border-2 border-zinc-800 text-xs font-bold tracking-widest text-zinc-300 hover:bg-white hover:text-black transition-all">
                      CALIBRAR PARÂMETROS
                    </button>
                  </div>
                )) : (
                  [
                    { id: 'CODING', name: 'Eng. Software', icon: Zap },
                    { id: 'FINANCE', name: 'Análise Financeira', icon: DollarSign },
                    { id: 'HEALTH', name: 'Saúde e Bem-estar', icon: Heart },
                    { id: 'PERSONAL', name: 'Gestão Pessoal', icon: Shield },
                  ].map((s, i) => (
                   <div key={i} className="flex flex-col p-8 bg-zinc-900 border border-zinc-800 rounded-[2rem] hover:border-blue-500/50 hover:bg-zinc-800/80 transition-all shadow-xl group duration-300 hover:-translate-y-2">
                    <div className="flex items-center gap-5 mb-8">
                      <div className="p-4 rounded-2xl bg-zinc-800 text-zinc-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors border border-transparent group-hover:border-blue-500/20">
                        <s.icon className="w-7 h-7"/>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-zinc-200 leading-tight">{s.name}</h3>
                        <p className="text-xs tracking-widest text-zinc-500 font-bold mt-2">{s.id}</p>
                      </div>
                    </div>
                    <p className="text-base text-zinc-500 leading-relaxed mb-10 flex-1">
                      Sistema especialista aguardando inicialização remota.
                    </p>
                    <button className="w-full py-4 rounded-xl border-2 border-zinc-800 bg-zinc-950 text-xs font-bold tracking-widest text-zinc-400 hover:bg-white hover:text-black transition-all">
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
